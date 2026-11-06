/** Live site: set BACK_OFFICE_ENABLED=true only when the client is ready. Local dev stays on by default. */
export function backOfficeEnabled() {
  if (process.env.BACK_OFFICE_ENABLED === "true") return true;
  if (process.env.BACK_OFFICE_ENABLED === "false") return false;
  return process.env.NODE_ENV === "development";
}
