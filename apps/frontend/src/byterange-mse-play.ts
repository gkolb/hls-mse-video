const assetUrl = '/frag_bunny.mp4';

export function byteRangePlay() {
  const video = document.querySelector('video') as HTMLVideoElement;

  type ByteSegment = {
    start: number;
    end: number;
  };
  // mp4info frag_bunny.mp4 | grep Codec
  const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
  // Fetch 1MB byte segments at a time
  const segmentLength = 1024 * 1024;
  const targetBuffer = 10;
  let totalSegments: number;
  let totalBytes: number;
  const segments: ByteSegment[] = [];
  let fetching = false;

  let mediaSource: MediaSource;
  let sourceBuffer: SourceBuffer;
  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
    mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', sourceOpen);
  } else {
    console.error('Unsupported MIME type or codec: ', mimeCodec);
  }

  async function sourceOpen() {
    sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

    const fileLength = await getFileLength(assetUrl);

    if (fileLength) {
      totalBytes = fileLength;
      console.log((fileLength / 1024 / 1024).toFixed(2), 'MB');
      totalSegments = Math.ceil(fileLength / segmentLength);
      let cur = 0;
      for (let i = 0; i < totalSegments; i++) {
        segments.push({
          start: cur,
          end: Math.min(cur + segmentLength, totalBytes),
        });
        cur = cur + segmentLength + 1;
      }
      video.addEventListener('timeupdate', checkBuffer);
      video.addEventListener('canplay', function () {
        video.play();
      });
      fetchSegment();
    }
  }

  async function getFileLength(url: string): Promise<number | null> {
    return fetch(url, { method: 'HEAD' }).then((response) => {
      const fileLength = response.headers.get('Content-Length');
      return fileLength ? parseInt(fileLength) : null;
    });
  }

  async function fetchSegment() {
    fetching = true;
    const next = segments.shift();
    if (!next) {
      console.log('All segments fetched');
      return;
    }
    const { start, end } = next;
    console.log(`Fetching segment bytes=${start}-${end}`);

    const response = await fetch(assetUrl, {
      headers: {
        Range: `bytes=${start}-${end}`, // HTTP Range header
      },
    });

    if (!response.ok || response.status !== 206) {
      throw new Error('Byte range request failed');
    }

    const buffer = await response.arrayBuffer();

    await new Promise((resolve) => {
      sourceBuffer.addEventListener('updateend', resolve, { once: true });
      sourceBuffer.appendBuffer(buffer);
    });

    fetching = false;
  }

  function checkBuffer() {
    if (shouldFetchNextSegment() && !fetching) {
      fetchSegment();
    }
  }

  function getRemainingBufferDuration() {
    if (!video || video.buffered.length === 0) return 0;

    const currentTime = video.currentTime;

    // Find the buffered range that includes currentTime
    for (let i = 0; i < video.buffered.length; i++) {
      const start = video.buffered.start(i);
      const end = video.buffered.end(i);

      if (currentTime >= start && currentTime < end) {
        console.log('Buffer remaining ', end - currentTime);
        return end - currentTime;
      }
    }

    return 0;
  }

  function shouldFetchNextSegment() {
    return getRemainingBufferDuration() < targetBuffer;
  }
}
