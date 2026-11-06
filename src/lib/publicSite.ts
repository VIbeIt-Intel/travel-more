/** True for the static GitHub Pages build (no API routes, no back office). */
export function isStaticPublicSite() {
  return process.env.NEXT_PUBLIC_GITHUB_PAGES === "true";
}

export function staticAsset(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
