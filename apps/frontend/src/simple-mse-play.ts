const assetUrl = '/bbb_720p_fragmented.mp4';

export function simpleMsePlay() {
  const video = document.querySelector('video') as HTMLVideoElement;

  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener('sourceopen', async () => {
    const mimeCodec = 'video/mp4; codecs="avc1.64001F, mp4a.40.2"';

    if (!MediaSource.isTypeSupported(mimeCodec)) {
      console.error('Unsupported MIME type or codec:', mimeCodec);
      return;
    }

    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
    sourceBuffer.addEventListener('updateend', () => {
      if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
        mediaSource.endOfStream();
      }
    });
    try {
      const response = await fetch(assetUrl);
      const buffer = await response.arrayBuffer();
      sourceBuffer.appendBuffer(buffer);
      video.play();
    } catch (e) {
      console.error('Error fetching or appending video data:', e);
    }
  });
}
