import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import db from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { emailSchema } from "./lib/schema";
import { compare } from "bcryptjs";
import GitHub from "next-auth/providers/github";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = emailSchema.parse(credentials);

        const user = await db.user.findFirst({
          where: {
            email: validatedCredentials.email.toString(),
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
          },
        });

        if (!user) return null;

        const isPasswordValid = await compare(
          validatedCredentials.password.toString(),
          user.password || "",
        );
        if (!isPasswordValid) return null;
        const { password: _password, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token || null;
        token.refreshToken = account.refresh_token || null;
        token.credentials = account.provider === "credentials";
        token.id = user?.id || token.sub;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
