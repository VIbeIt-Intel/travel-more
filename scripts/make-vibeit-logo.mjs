import sharp from "sharp";
import fs from "fs";

const src =
  "C:/Users/Nicov/.cursor/projects/c-Users-Nicov-OneDrive-Desktop-VibeIt-Intel-Clients-TravelMore/assets/image-3cdca4c0-384d-4a89-8c10-4b8bf12902b1.png";

const meta = await sharp(src).metadata();
console.log("source", meta.width + "x" + meta.height);

// Crop the central VI glyph, then make pure-black background transparent.
const cropW = Math.round(meta.width * 0.12);
const cropH = Math.round(meta.height * 0.45);
const left = Math.round(meta.width / 2 - cropW / 2);
const top = Math.round(meta.height * 0.3);

const { data, info } = await sharp(src)
  .extract({ left, top, width: cropW, height: cropH })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const channels = info.channels;
for (let i = 0; i < data.length; i += channels) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  // Near-black -> transparent
  if (r < 24 && g < 24 && b < 24) {
    data[i + 3] = 0;
  }
}

// Composite over the exact footer navy so any anti-aliased fringe blends in.
await sharp(data, { raw: { width: info.width, height: info.height, channels } })
  .trim({ threshold: 10 })
  .resize({ height: 96, withoutEnlargement: false })
  .flatten({ background: "#0a1628" })
  .png()
  .toFile("public/vibeit-logo.png");

console.log("vibeit-logo.png", Math.round(fs.statSync("public/vibeit-logo.png").size / 1024) + "KB");
