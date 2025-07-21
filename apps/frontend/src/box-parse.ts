const assetUrl = '/bbb_720p_fragmented.mp4';

export async function boxParse() {
  const resp = await fetch(assetUrl);
  const buffer = await resp.arrayBuffer();
  parseBoxes(buffer);
  console.log('byte parse');
}

function parseBoxes(
  buffer: ArrayBuffer,
  offset = 0,
  end = buffer.byteLength,
  depth = 0
) {
  const view = new DataView(buffer, offset, end - offset);
  let pos = 0;

  while (pos < view.byteLength) {
    if (pos + 8 > view.byteLength) break; // Not enough for header

    const size = view.getUint32(pos); // box size
    const type = String.fromCharCode(
      view.getUint8(pos + 4),
      view.getUint8(pos + 5),
      view.getUint8(pos + 6),
      view.getUint8(pos + 7)
    );

    console.log(' '.repeat(depth * 2) + `Box: ${type}, size: ${size}`);

    // If it's a container (like 'moov' or 'trak'), recurse into its contents
    if (
      ['moov', 'trak', 'mdia', 'minf', 'stbl', 'edts'].includes(type) &&
      size > 8
    ) {
      parseBoxes(buffer, offset + pos + 8, offset + pos + size, depth + 1);
    }

    pos += size;
  }
}
