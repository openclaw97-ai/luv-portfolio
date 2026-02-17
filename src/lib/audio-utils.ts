/**
 * Audio processing utilities using Web Audio API
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  return `${mins}m ${secs}s`;
}

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioContext.close();
  return audioBuffer;
}

export function trimAudio(
  buffer: AudioBuffer,
  startTime: number,
  endTime: number
): AudioBuffer {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor(endTime * sampleRate);
  const length = endSample - startSample;

  const offlineCtx = new OfflineAudioContext(
    buffer.numberOfChannels,
    length,
    sampleRate
  );

  const newBuffer = offlineCtx.createBuffer(
    buffer.numberOfChannels,
    length,
    sampleRate
  );

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const oldData = buffer.getChannelData(channel);
    const newData = newBuffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      newData[i] = oldData[startSample + i];
    }
  }

  return newBuffer;
}

export function cutAudio(
  buffer: AudioBuffer,
  startTime: number,
  endTime: number
): AudioBuffer {
  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor(endTime * sampleRate);
  const cutLength = endSample - startSample;
  const newLength = buffer.length - cutLength;

  const offlineCtx = new OfflineAudioContext(
    buffer.numberOfChannels,
    newLength,
    sampleRate
  );

  const newBuffer = offlineCtx.createBuffer(
    buffer.numberOfChannels,
    newLength,
    sampleRate
  );

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const oldData = buffer.getChannelData(channel);
    const newData = newBuffer.getChannelData(channel);

    // Copy before cut
    for (let i = 0; i < startSample; i++) {
      newData[i] = oldData[i];
    }

    // Copy after cut
    for (let i = endSample; i < buffer.length; i++) {
      newData[i - cutLength] = oldData[i];
    }
  }

  return newBuffer;
}

export function applyFadeIn(
  buffer: AudioBuffer,
  duration: number
): AudioBuffer {
  const sampleRate = buffer.sampleRate;
  const fadeSamples = Math.floor(duration * sampleRate);

  const newBuffer = cloneAudioBuffer(buffer);
  for (let channel = 0; channel < newBuffer.numberOfChannels; channel++) {
    const data = newBuffer.getChannelData(channel);
    for (let i = 0; i < fadeSamples && i < data.length; i++) {
      data[i] *= i / fadeSamples;
    }
  }
  return newBuffer;
}

export function applyFadeOut(
  buffer: AudioBuffer,
  duration: number
): AudioBuffer {
  const sampleRate = buffer.sampleRate;
  const fadeSamples = Math.floor(duration * sampleRate);

  const newBuffer = cloneAudioBuffer(buffer);
  for (let channel = 0; channel < newBuffer.numberOfChannels; channel++) {
    const data = newBuffer.getChannelData(channel);
    const startSample = data.length - fadeSamples;
    for (let i = startSample; i < data.length; i++) {
      data[i] *= (data.length - i) / fadeSamples;
    }
  }
  return newBuffer;
}

function cloneAudioBuffer(buffer: AudioBuffer): AudioBuffer {
  const offlineCtx = new OfflineAudioContext(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );

  const newBuffer = offlineCtx.createBuffer(
    buffer.numberOfChannels,
    buffer.length,
    buffer.sampleRate
  );

  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const oldData = buffer.getChannelData(channel);
    const newData = newBuffer.getChannelData(channel);
    newData.set(oldData);
  }

  return newBuffer;
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channels
  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = buffer.getChannelData(ch)[i];
      const clamped = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, clamped * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
