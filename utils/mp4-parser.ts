/**
 * Extracts duration from MP4 file's moov atom
 * @param {ArrayBuffer} arrayBuffer - MP4 file data
 * @returns {Promise<number>} Duration in seconds
 */
export function getMp4DurationFromArrayBuffer(arrayBuffer: ArrayBuffer) {
  return new Promise((resolve, reject) => {
    try {
      const data = new Uint8Array(arrayBuffer);
      let duration = 0;
      let timescale = 1;
      let i = 0;
      const fileSize = data.length;

      // Search for 'moov' atom (should be within first 1MB if not fragmented)
      const searchLimit = Math.min(fileSize, 1000000);

      while (i < searchLimit - 8) {
        const size = readUint32(data, i);
        const type = readAtomType(data, i + 4);

        if (type === 'moov') {
          const moovEnd = i + size;
          let j = i + 8; // Start of moov children

          while (j < moovEnd - 8) {
            const innerSize = readUint32(data, j);
            const innerType = readAtomType(data, j + 4);

            if (innerType === 'mvhd') {
              // Found movie header atom
              const version = data[j + 8];
              const start = j + 12; // Start of mvhd data

              if (version === 0 || version === 1) {
                timescale = readUint32(data, start);
                duration =
                  version === 0
                    ? readUint32(data, start + 4)
                    : readUint64(data, start + 4);

                if (timescale > 0) {
                  return resolve(duration / timescale);
                }
              }
              break; // Found mvhd, stop searching
            }
            j += innerSize;
          }
          break; // Found moov, stop searching
        }
        i += size > 1 ? size : 8; // Prevent infinite loop
      }

      reject(new Error('Could not find moov atom or valid duration'));
    } catch (err) {
      reject(err);
    }
  });
}

// Helper functions
function readUint32(data: Uint8Array<ArrayBuffer>, offset: number) {
  return (
    (data[offset] << 24) |
    (data[offset + 1] << 16) |
    (data[offset + 2] << 8) |
    data[offset + 3]
  );
}

function readUint64(data: Uint8Array<ArrayBuffer>, offset: number) {
  const high = readUint32(data, offset);
  const low = readUint32(data, offset + 4);
  return high * 4294967296 + low; // high * 2^32 + low
}

function readAtomType(data: Uint8Array<ArrayBuffer>, offset: number) {
  return String.fromCharCode(
    data[offset],
    data[offset + 1],
    data[offset + 2],
    data[offset + 3]
  );
}
