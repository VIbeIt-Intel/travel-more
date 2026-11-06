import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { backOfficeEnabled } from "@/lib/backOffice";

export function middleware(request: NextRequest) {
  if (backOfficeEnabled()) return NextResponse.next();

  const { pathname } = request.nextUrl;

  if (pathname === "/office" || pathname.startsWith("/office/")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (pathname.startsWith("/api/office")) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  if (pathname === "/api/enquiries" || pathname.startsWith("/api/enquiries/")) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  if (pathname === "/api/specials/upload") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  if (pathname.startsWith("/api/specials") && request.method !== "GET") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  if (pathname === "/api/rates" && request.method !== "GET") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/office",
    "/office/:path*",
    "/api/office/:path*",
    "/api/enquiries",
    "/api/enquiries/:path*",
    "/api/specials/upload",
    "/api/specials",
    "/api/specials/:path*",
    "/api/rates",
  ],
};
