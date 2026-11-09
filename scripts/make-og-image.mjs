import sharp from "sharp";
import fs from "fs";

const W = 1200;
const H = 630;

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(8,24,40,0.10)"/>
      <stop offset="60%" stop-color="rgba(8,24,40,0.32)"/>
      <stop offset="100%" stop-color="rgba(8,24,40,0.74)"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="88" y="300" font-family="Georgia, 'Times New Roman', serif" font-size="108" font-weight="700" fill="#ffffff">Travel<tspan fill="#3ecfb8" font-style="italic">MORE</tspan></text>
  <text x="94" y="362" font-family="Arial, sans-serif" font-size="29" letter-spacing="7" fill="#ffffff">BUSINESS &amp; LEISURE  &#8226;  SOUTH AFRICA</text>
  <text x="94" y="566" font-family="Georgia, serif" font-size="34" fill="#f3ece1">Your Next Chapter Starts with TravelMORE.</text>
</svg>`;

sharp("public/header-shore.jpg")
  .resize(W, H, { fit: "cover", position: "attention" })
  .composite([{ input: Buffer.from(svg) }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og-image.jpg")
  .then(() => {
    console.log("og-image.jpg", Math.round(fs.statSync("public/og-image.jpg").size / 1024) + "KB");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
