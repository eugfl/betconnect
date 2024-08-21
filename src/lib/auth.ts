import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface UserWithPassword {
  id: string;
  name: string;
  email: string;
  password: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ email, password }) {
        if (!email || !password) {
          throw new Error("E-mail e senha são obrigatórios.");
        }

        const user = (await prisma.user.findUnique({
          where: { email: email as string },
        })) as UserWithPassword | null;

        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        const isValidPassword = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Credenciais inválidas.");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
