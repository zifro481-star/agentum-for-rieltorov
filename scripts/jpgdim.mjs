import { readFileSync } from "node:fs";

function dim(path) {
  const b = readFileSync(path);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      const h = b.readUInt16BE(i + 5);
      const w = b.readUInt16BE(i + 7);
      return { w, h, bytes: b.length };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return { w: 0, h: 0, bytes: b.length };
}

for (const f of process.argv.slice(2)) {
  console.log(f.split("/").pop(), JSON.stringify(dim(f)));
}
