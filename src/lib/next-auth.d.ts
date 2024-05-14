import { User } from "next-auth";

declare module "next-auth" {
  interface User {
    hasPaid: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      hasPaid: boolean;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    userId: string;
    hasPaid: boolean;
  }
}
