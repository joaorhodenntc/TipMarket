import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      full_name?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    full_name?: string;
  }
}
