import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // ✅ Public routes (no login required)
  const publicPaths = [
    "/auth/signin",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-otp",
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // ✅ If NOT logged in and trying to access a protected route → redirect to signin
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // ✅ Role-based protection example
  // If user is logged in but NOT an admin and trying to access admin-only routes
  const adminOnlyPaths = ["/"]; 
  const isAdminPath = adminOnlyPaths.some((path) => pathname.startsWith(path));

  if (token && isAdminPath && token.role !== "admin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // ✅ If already logged in and tries to visit signin/forgot/reset → redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect everything except API, Next.js internals, static files, etc.
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
