import { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./server-utils";

export const nextAuthEdgeConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      // runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      if (!isLoggedIn && isTryingToAccessApp) return false;

      if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasPaid) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccessApp && auth?.user.hasPaid) return true;

      if (
        isLoggedIn &&
        auth?.user.hasPaid &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup"))
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (isLoggedIn && !isTryingToAccessApp && !auth?.user.hasPaid) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }

        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) return true;

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasPaid = user.hasPaid;
      }

      if (trigger === "update") {
        // on every request
        const userFromDb = await getUserByEmail(token.email);
        if (userFromDb) token.hasPaid = userFromDb.hasPaid;
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasPaid = token.hasPaid;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
