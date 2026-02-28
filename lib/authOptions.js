// lib/authOptions.js

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { validateCredentials } from "@/lib/services/auth.service";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { scope: "openid email profile" },
      },
      // allow linking to an existing user record when the email matches
      // (the default behaviour throws OAuthAccountNotLinked for security).
      allowDangerousEmailAccountLinking: true,
      // only keep the fields that match our Prisma User model; the raw
      // profile from Google contains many extra properties that would
      // make `prisma.user.create` fail with an "Unknown arg" error.
      profile(profile) {
        return {
          id: profile.sub || profile.id,
          name: profile.name || null,
          email: profile.email,
          image: profile.picture || null,
        };
      },
    }),

    CredentialsProvider({
      name: "Email or Username",
      credentials: {
        identifier: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // business logic resides in service layer, which returns a GeneralResponse
        const result = await validateCredentials({
          identifier: credentials?.identifier,
          password: credentials?.password,
        });
        // NextAuth expects either a user object (truthy) or null/false
        if (!result || !result.success) {
          // returning null will trigger an error
          return null;
        }
        return result.data; // user data object
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id;
        session.user.role = token.role;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return baseUrl + url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  // helpful for troubleshooting OAuth issues in development
  debug: process.env.NODE_ENV === "development",
};