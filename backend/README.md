# YouTube Downloader API

Backend service for downloading YouTube videos using yt-dlp.

## API Endpoints

### POST /api/info
Get video metadata and available formats.

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=..."
}
```

### POST /api/download
Download video/audio (streams through server).

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=...",
  "formatId": "best[height<=720]"
}
```

### POST /api/stream-url
Get direct streaming URL (for client-side handling).

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=...",
  "formatId": "bestaudio"
}
```

## Deployment

Deployed on Render Free Tier.
