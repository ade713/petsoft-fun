import { NextResponse } from "next/server";

export function middleware(request: Request) {
  console.log("req:", request.url);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
