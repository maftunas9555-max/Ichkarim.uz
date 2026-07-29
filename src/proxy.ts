import middleware from "next-auth/middleware";
import { NextRequest } from "next/server";

export default function proxy(req: NextRequest) {
  return (middleware as any)(req);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
