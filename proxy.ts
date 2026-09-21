import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = [
  "/dashboard",
  "/learning",
  "/quiz",
  "/certificate",
  "/admin",
];
const authRoutes = ["/login"];

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

async function hasValidSession(req: NextRequest) {
  const cookie = req.cookies.get("session")?.value;
  if (!cookie) return false;
  try {
    await jwtVerify(cookie, encodedKey, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(path);

  const isAuthenticated = await hasValidSession(req);

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
