import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const stash = path.join(root, ".github-pages-stash");

function moveIntoStash(fromRel) {
  const from = path.join(root, fromRel);
  if (!fs.existsSync(from)) return;
  const to = path.join(stash, fromRel.replace(/\//g, "__"));
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  fs.rmSync(from, { recursive: true, force: true });
}

function restoreFromStash(fromRel) {
  const to = path.join(root, fromRel);
  const from = path.join(stash, fromRel.replace(/\//g, "__"));
  if (!fs.existsSync(from)) return;
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

export function prep() {
  fs.rmSync(stash, { recursive: true, force: true });
  fs.mkdirSync(stash, { recursive: true });
  moveIntoStash("src/app/api");
  moveIntoStash("src/app/office");
  moveIntoStash("src/middleware.ts");

  const siteData = path.join(root, "public", "site-data");
  fs.mkdirSync(siteData, { recursive: true });
  const specials = path.join(root, "data", "specials.json");
  if (fs.existsSync(specials)) {
    fs.copyFileSync(specials, path.join(siteData, "specials.json"));
  }
}

export function restore() {
  restoreFromStash("src/middleware.ts");
  restoreFromStash("src/app/office");
  restoreFromStash("src/app/api");
  fs.rmSync(stash, { recursive: true, force: true });
}

const cmd = process.argv[2];

if (cmd === "prep") {
  prep();
} else if (cmd === "restore") {
  restore();
} else if (cmd === "build") {
  try {
    prep();
    const result = spawnSync("npx", ["next", "build"], {
      cwd: root,
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        GITHUB_PAGES: "true",
        NEXT_PUBLIC_GITHUB_PAGES: "true",
        NEXT_PUBLIC_BASE_PATH: "/travel-more",
      },
    });
    if (result.status !== 0) process.exit(result.status ?? 1);
  } finally {
    restore();
  }
} else {
  console.error("Usage: node scripts/github-pages.mjs prep|restore|build");
  process.exit(1);
}
