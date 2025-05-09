import assetUrl from "/frag_bunny.mp4";

export function playVideo() {
  var video = document.querySelector("video") as HTMLVideoElement;

  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener("sourceopen", async () => {
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

    if (!MediaSource.isTypeSupported(mimeCodec)) {
      console.error("Unsupported MIME type or codec:", mimeCodec);
      return;
    }

    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

    try {
      const response = await fetch(assetUrl);
      const data = await response.arrayBuffer();
      sourceBuffer.addEventListener("updateend", () => {
        if (!sourceBuffer.updating && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
        }
      });
      sourceBuffer.appendBuffer(data);
    } catch (e) {
      console.error("Error fetching or appending video data:", e);
    }
  });
}
