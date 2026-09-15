import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_PREFIXES = ["/signup", "/family-tree", "/stories", "/life-book", "/dashboard"];

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("session")?.value;
  const authFailed = !token || !(await verify(token));

  if (authFailed) {
    // /signup is the natural first stop for a brand-new visitor, so send them
    // to create an account rather than log in to one they don't have yet.
    // Everything else assumes a returning user.
    const destination = pathname.startsWith("/signup") ? "/register" : "/login";
    const url = new URL(destination, request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

async function verify(token: string) {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: [
    "/signup/:path*",
    "/family-tree/:path*",
    "/stories/:path*",
    "/life-book/:path*",
    "/dashboard/:path*",
  ],
};
