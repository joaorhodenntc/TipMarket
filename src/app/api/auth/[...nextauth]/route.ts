import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Usuário não encontrado");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Senha incorreta");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.full_name,
          role: user.role as "admin" | "user",
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "user";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as "admin" | "user";
        console.log("JWT Token:", token);
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Página de login personalizada
  },
  secret: process.env.NEXTAUTH_SECRET, // Chave secreta
});

export { handler as GET, handler as POST };
