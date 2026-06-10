import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/client-ip";

const SESSION_COOKIE = "admin_session";
const SESSION_VALUE = "authenticated";

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "agentum-pro-secret-key";
}

async function createSessionToken() {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(SESSION_VALUE),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function isAuthenticated(request: NextRequest) {
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) return false;

  const expected = await createSessionToken();
  return safeEqual(session, expected);
}

function applyApiRateLimit(request: NextRequest, pathname: string) {
  const ip = getClientIp(request);

  if (pathname === "/api/admin/login") {
    const result = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!result.ok) {
      return rateLimitResponse(result.retryAfterSec ?? 60);
    }
    return null;
  }

  if (pathname === "/api/leads" && request.method === "POST") {
    const result = checkRateLimit(`leads:${ip}`, 5, 10 * 60 * 1000);
    if (!result.ok) {
      return rateLimitResponse(result.retryAfterSec ?? 60);
    }
    return null;
  }

  if (pathname === "/api/manyasha/chat" && request.method === "POST") {
    const result = checkRateLimit(`manyasha:${ip}`, 20, 60 * 1000);
    if (!result.ok) {
      return rateLimitResponse(result.retryAfterSec ?? 30);
    }
    return null;
  }

  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    const limited = applyApiRateLimit(request, pathname);
    if (limited) return limited;
  }

  const isLoginPage = pathname === "/admin/login";
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminArea) {
    return NextResponse.next();
  }

  const authed = await isAuthenticated(request);

  if (isLoginPage) {
    if (authed) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin", "/api/:path*"],
};
