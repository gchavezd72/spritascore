import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

function hostnameOf(request: NextRequest): string {
  return (request.headers.get("host") ?? "").split(":")[0].toLowerCase();
}

function isAnalyticsHost(request: NextRequest): boolean {
  const hostname = hostnameOf(request);
  return hostname === "analytics.spritascore.com" || hostname === "analytics.localhost";
}

function isAnalyticsPath(pathname: string): boolean {
  return pathname === "/analytics" || pathname.startsWith("/analytics/");
}

function shouldRewrite(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return false;
  if (pathname.startsWith("/api")) return false;
  if (isAnalyticsPath(pathname)) return false;
  if (/\.[a-z0-9]+$/i.test(pathname)) return false;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);

  if (pathname.startsWith("/api/crm")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(`crm:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: "Demasiadas solicitudes" }, { status: 429 });
    }
  }

  const analyticsHost = isAnalyticsHost(request);
  if (analyticsHost || isAnalyticsPath(pathname)) {
    requestHeaders.set("x-sprita-app", "analytics");
  }

  if (analyticsHost && shouldRewrite(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/analytics" : `/analytics${pathname}`;
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
