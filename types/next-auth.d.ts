// types/next-auth.d.ts

import type { DefaultSession } from "next-auth";
import type { DefaultJWT }     from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id:   string;
      role: "SUPERADMIN" | "ADMIN" | "USER";
    } & DefaultSession["user"];
  }

  interface User {
    id:   string;
    role: "SUPERADMIN" | "ADMIN" | "USER";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id:   string;
    role: "SUPERADMIN" | "ADMIN" | "USER";
  }
}