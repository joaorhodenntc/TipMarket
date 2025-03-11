import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "admin" | "user";
  }

  interface Session {
    user: User & {
      role: "admin" | "user";
    };
  }
}
