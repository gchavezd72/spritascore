import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { localeFromPath } from "@/lib/calculatorPath";
import { LOCALE_COOKIE, readLocaleCookie } from "@/lib/localePreference";
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

const APEX_HOSTS = new Set([
  "www.spritascore.com",
  "spritascore.vercel.app",
  "analytics.spritascore.com",
]);

function rejectsBackslash(request: NextRequest, pathname: string): boolean {
  const raw = `${pathname} ${request.url}`;
  return raw.includes("\\") || raw.toLowerCase().includes("%5c");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (rejectsBackslash(request, pathname)) {
    return new NextResponse("Bad request", {
      status: 400,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  const hostname = hostnameOf(request);
  if (APEX_HOSTS.has(hostname)) {
    const dest = new URL(request.url);
    dest.protocol = "https:";
    dest.hostname = "spritascore.com";
    dest.port = "";
    return NextResponse.redirect(dest, 308);
  }

  const requestHeaders = new Headers(request.headers);
  const locale =
    localeFromPath(pathname) ?? readLocaleCookie(request.cookies.get(LOCALE_COOKIE)?.value);
  requestHeaders.set("x-sprita-locale", locale);
  requestHeaders.set("x-sprita-pathname", pathname);

  if (pathname.startsWith("/api/crm")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!rateLimit(`crm:${ip}`, 10, 60_000) || !rateLimit(`crm-day:${ip}`, 20, 86_400_000)) {
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
    requestHeaders.set("x-sprita-pathname", url.pathname);
    requestHeaders.set("x-sprita-locale", "es");
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
