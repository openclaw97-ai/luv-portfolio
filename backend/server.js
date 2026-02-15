const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { execFile } = require('child_process');
const { promisify } = require('util');
const https = require('https');
const http = require('http');
require('dotenv').config();

const execFileAsync = promisify(execFile);
const app = express();
const PORT = process.env.PORT || 3001;

// Python and yt-dlp paths
const PYTHON_PATH = process.env.PYTHON_PATH || '/opt/homebrew/bin/python3.11';
const YTDLP_MODULE = 'yt_dlp';

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3002', 'http://192.168.68.101:3002', 'http://192.168.68.106:3002'],
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Parse JSON bodies
app.use(express.json());

// Helper function to run yt-dlp
async function runYtDlp(url, flags = []) {
  const args = ['-m', YTDLP_MODULE, ...flags, url];
  const { stdout } = await execFileAsync(PYTHON_PATH, args, {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 60000
  });
  return JSON.parse(stdout);
}

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'YouTube Downloader API',
    version: '1.0.0'
  });
});

// Get video info
app.post('/api/info', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const result = await runYtDlp(url, [
      '--dump-json',
      '--no-check-certificates',
      '--no-warnings',
      '--prefer-free-formats'
    ]);

    const formats = result.formats
      ?.filter(f => f.vcodec !== 'none' || f.acodec !== 'none')
      ?.map(f => ({
        formatId: f.format_id,
        quality: f.quality_label || f.quality,
        resolution: f.resolution,
        ext: f.ext,
        filesize: f.filesize || f.filesize_approx,
        hasVideo: f.vcodec !== 'none',
        hasAudio: f.acodec !== 'none'
      })) || [];

    const bestAudio = formats
      .filter(f => f.hasAudio && !f.hasVideo)
      .sort((a, b) => (b.filesize || 0) - (a.filesize || 0))[0];

    const bestVideo = formats
      .filter(f => f.hasVideo && f.hasAudio && String(f.quality || '').includes('720'))[0] ||
      formats.filter(f => f.hasVideo && f.hasAudio)[0];

    res.json({
      id: result.id,
      title: result.title,
      description: result.description?.substring(0, 500),
      duration: result.duration,
      durationString: result.duration_string,
      thumbnail: result.thumbnail,
      uploader: result.uploader,
      uploadDate: result.upload_date,
      viewCount: result.view_count,
      formats: formats.slice(0, 10),
      bestAudio: bestAudio?.formatId,
      bestVideo: bestVideo?.formatId,
      webpageUrl: result.webpage_url
    });

  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({
      error: 'Failed to fetch video info',
      message: error.message
    });
  }
});

// Download video (streams through server)
app.post('/api/download', async (req, res) => {
  try {
    const { url, formatId } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const format = formatId || 'best[height<=720]';
    const result = await runYtDlp(url, [
      '--dump-json',
      '--format', format,
      '--no-check-certificates',
      '--no-warnings'
    ]);

    if (!result.url) {
      return res.status(500).json({ error: 'Could not get download URL' });
    }

    // Use native https/http module for streaming
    const videoUrl = new URL(result.url);
    const client = videoUrl.protocol === 'https:' ? https : http;

    const filename = `${result.title.replace(/[^a-zA-Z0-9]/g, '_')}.${result.ext || 'mp4'}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', result.content_type || 'video/mp4');

    client.get(result.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.youtube.com/'
      }
    }, (videoRes) => {
      if (videoRes.statusCode !== 200) {
        res.status(500).json({ error: `Failed to fetch video: ${videoRes.statusCode}` });
        return;
      }
      videoRes.pipe(res);
    }).on('error', (err) => {
      console.error('Error streaming video:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream video', message: err.message });
      }
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to download video',
        message: error.message
      });
    }
  }
});

// Get direct streaming URL
app.post('/api/stream-url', async (req, res) => {
  try {
    const { url, formatId } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const format = formatId || 'best[height<=720]';
    const result = await runYtDlp(url, [
      '--dump-json',
      '--format', format,
      '--no-check-certificates',
      '--no-warnings'
    ]);

    res.json({
      title: result.title,
      url: result.url,
      ext: result.ext,
      format: result.format,
      duration: result.duration
    });

  } catch (error) {
    console.error('Error getting stream URL:', error);
    res.status(500).json({
      error: 'Failed to get stream URL',
      message: error.message
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 YouTube Downloader API running on port ${PORT}`);
  console.log(`📹 Using Python: ${PYTHON_PATH}`);
});
