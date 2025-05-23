import assetUrl from "/frag_bunny.mp4";
import MP4Box, { DataStream } from "mp4box";

export function mp4boxPlay() {
  console.log(assetUrl);
  var video = document.querySelector("video") as HTMLVideoElement;

  const mediaSource = new MediaSource();
  video.src = URL.createObjectURL(mediaSource);

  mediaSource.addEventListener("sourceended", () => {
    console.log("MediaSource ended");
  });
  mediaSource.addEventListener("sourceclose", () => {
    console.error("MediaSource closed unexpectedly!");
  });

  mediaSource.addEventListener("sourceopen", async () => {
    const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

    if (!MediaSource.isTypeSupported(mimeCodec)) {
      console.error("Unsupported MIME type or codec:", mimeCodec);
      return;
    }

    const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

    sourceBuffer.addEventListener("error", (e) => {
      console.error("SourceBuffer error:", e);
    });
    try {
      const response = await fetch(assetUrl);
      const buffer = await response.arrayBuffer();

      const stream = new DataStream(buffer, 0, DataStream.BIG_ENDIAN);

      parseMP4Boxes(stream);

      // 2. Create MP4Box file object
      const mp4boxFile = MP4Box.createFile();

      // 3. Set up promise to handle the onReady callback
      const fileInfo = await new Promise((resolve, reject) => {
        mp4boxFile.onReady = (info) => {
          resolve(info);
        };

        mp4boxFile.onError = (error) => {
          reject(error);
        };

        //   // 4. Parse the file
        (buffer as any).fileStart = 0;
        mp4boxFile.appendBuffer(buffer);
        mp4boxFile.flush();
      });

      // 5. Use the file info
      console.log("MP4 File Info:", fileInfo);

      sourceBuffer.addEventListener("updateend", () => {
        if (!sourceBuffer.updating && mediaSource.readyState === "open") {
          mediaSource.endOfStream();
        }
      });
      sourceBuffer.appendBuffer(buffer);
      video.play();
    } catch (e) {
      console.error("Error fetching or appending video data:", e);
    }
  });
}

function parseMP4Boxes(buffer: any) {
  // Create a DataStream (big-endian by default for MP4)
  const stream = new DataStream(buffer, 0, DataStream.BIG_ENDIAN);

  // Parse boxes until the end of the file
  while (stream.position < buffer.byteLength) {
    const box = readBox(stream);
    console.log(box);
  }
}

function readBox(stream: any) {
  const startPos = stream.position;

  // Read box header (size + type)
  const size = stream.readUint32();
  const type = stream.readString(4);

  // Handle 64-bit size (if size === 1, read extended size)
  let actualSize = size;
  if (size === 1) {
    actualSize = stream.readUint64(); // For large boxes (>4GB)
  }

  // Parse box data (skip for now, but you can add logic per box type)
  const data = stream.readUint8Array(actualSize - (stream.position - startPos));

  return {
    type,
    size: actualSize,
    startOffset: startPos,
    data, // Raw bytes (can be parsed further)
  };
}
