import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { JWT } from 'next-auth/jwt';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '@/@server/config/env-schema';

import { api } from '@/lib/api';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import prisma from './data-source';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

async function refreshToken(token: JWT | any): Promise<JWT> {
  const res = await axios.post(env.NEXT_BASE_URL_API + '/auth/refresh', {
    method: 'POST',
    headers: {
      authorization: `Refresh ${token.backendTokens.refreshToken}`,
    },
  });

  return {
    ...token,
    backendTokens: res.data,
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, _req) {
        try {
          if (!credentials) return null;

          const { email, password } = credentials;

          if (!email || !password) {
            throw new Error('Email and password are required');
          }

          const auth = await api.post('/auth/login', {
            email,
            password,
          });

          if (!auth || auth.status == 401) {
            console.log(auth.statusText);
            throw new Error(
              'Authentication failed: Invalid credentials or user not found',
            );
          }

          return auth.data;
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientInitializationError ||
            error instanceof Prisma.PrismaClientKnownRequestError
          ) {
            throw new Error('System error. Please contact support');
          }

          throw error;
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({ user, profile, account }) => {
      if (account?.provider === 'google') {
        console.log('\nSIGN_IN: GOOGLE\n');
        if (user) {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: String(user.email),
            },
          });

          if (existingUser?.email === profile?.email) return true;
        }
      }

      if (account?.provider === 'credentials') {
        console.log('\nSIGN_IN: CREDENTIALS\n');
        if (user) {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: String(user?.email),
            },
          });
          if (!existingUser) return false;
        }
      }

      return true;
    },
    jwt: async ({ token, account, profile: _profile, user }) => {
      if (account?.provider === 'google') {
        console.log('\nJWT: GOOGLE\n');
        if (token) {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: String(token.email),
            },
          });

          token.name = existingUser?.name;
          token.email = existingUser?.email;
          token.role = existingUser?.role;
          token.accessToken = account.access_token;

          return token;
        }
      }

      if (account?.provider === 'credentials') {
        console.log('\nJWT: CREDENTIALS\n');
        if (token && user) {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: String(token.email),
            },
          });

          token.name = existingUser?.name;
          token.email = existingUser?.email;
          token.role = existingUser?.role;
          // token.accessToken = account.access_token;
          console.log({ token, account, _profile, user })

          return { ...token, ...user };
        }

        if (token) {
          const existingUser = await prisma.user.findUnique({
            where: {
              email: String(token.email),
            },
          });

          const expire: any = token.backendTokens;

          if (new Date().getTime() < expire.expiresIn) {
            return token;
          }

          token.name = existingUser?.name;
          token.email = existingUser?.email;
          token.role = existingUser?.role;

          console.log({ token, account, _profile, user })

          return await refreshToken(token);
        }
        console.log({ token, account, profile: _profile, user })
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        console.log('\nSESSION: CREDENTIALS\n');
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/',
    error: '/auth/error',
    newUser: '/auth/sign-up',
    verifyRequest: '/auth/sign-in'
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    // maxAge: 30 * 24 * 60 * 60, // 30 days
    // updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
