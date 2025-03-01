import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Verificar se 'credentials' não é undefined
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        // Verificar se o usuário foi encontrado e se a senha não é null
        if (user && user.password) {
          // Comparar a senha fornecida com o hash armazenado no banco
          const isPasswordValid = await bcrypt.compare(
            credentials.password, // Senha fornecida
            user.password // Hash da senha armazenada
          );

          // Se a senha for válida, retorna os dados do usuário, caso contrário, retorna null
          if (isPasswordValid) {
            return {
              id: user.id,
              email: user.email,
              full_name: user.full_name || "", // Se for null, retornar uma string vazia
              created_at: user.created_at,
            };
          }
        }

        // Se o usuário não for encontrado ou a senha for inválida, retorna null
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.full_name = token.full_name as string; // Adicionando full_name na sessão
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.full_name = user.full_name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Página de login personalizada
  },
  secret: process.env.NEXTAUTH_SECRET, // Chave secreta
  adapter: PrismaAdapter(prisma), // Usando PrismaAdapter para integração com o Prisma
});

export { handler as GET, handler as POST };
