import { readFileSync } from "node:fs";

function inspect(path) {
  const buf = readFileSync(path);
  const size = buf.length;
  const codecs = [];

  function walk(start, end) {
    let p = start;
    while (p + 8 <= end) {
      const boxSize = buf.readUInt32BE(p);
      const type = buf.toString("latin1", p + 4, p + 8);
      let contentStart = p + 8;
      let realSize = boxSize;
      if (boxSize === 1) {
        realSize = Number(buf.readBigUInt64BE(p + 8));
        contentStart = p + 16;
      } else if (boxSize === 0) {
        realSize = end - p;
      }

      // sample entry codecs of interest
      if (["avc1","hvc1","hev1","vp08","vp09","av01","mp4a","Opus","ac-3"].includes(type)) {
        codecs.push(type);
      }

      if (["moov","trak","mdia","minf","stbl"].includes(type)) {
        walk(contentStart, p + realSize);
      }
      // stsd has a header before child sample entries
      if (type === "stsd") {
        walk(contentStart + 8, p + realSize);
      }
      if (realSize <= 0) break;
      p += realSize;
    }
  }
  walk(0, size);
  return { path, size, codecs: [...new Set(codecs)] };
}

for (const f of process.argv.slice(2)) {
  console.log(JSON.stringify(inspect(f)));
}
