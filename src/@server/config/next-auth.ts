import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from 'next-auth';

import { JWT } from 'next-auth/jwt';

import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { env } from '@/@server/config/env-schema';

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
  const res = await fetch(env.NEXT_BASE_URL_API + '/auth/refresh', {
    method: 'POST',
    headers: {
      authorization: `Refresh ${token.backendTokens.refreshToken}`,
    },
  });
  console.log('REFRESH');

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  };
}

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const { email, password } = credentials;

        const res = await fetch(env.NEXT_BASE_URL_API + '/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.status == 401) {
          console.log(res.statusText);
          throw new Error('Invalid credentials');
        }

        const user = await res.json();

        return user;
      },
    }),
  ],
  callbacks: {
    // Use o signIn()retorno de chamada para controlar se um usuário tem permissão para fazer login.
    // Ao usar o CredentialsProvider, o user objeto é a resposta retornada do authorize retorno de chamada e o profile objeto é o corpo bruto do HTTP POSTenvio.
    signIn: async ({ user, profile, account }) => {
      if (user && account?.provider === 'google') {
        console.log({
          user,
          profile
        })
      }
      return true
    },
    // jwt: Esse retorno de chamada é chamado sempre que um JSON Web Token é criado (ou seja, no login) ou atualizado (ou seja, sempre que uma sessão é acessada no cliente). O valor retornado será criptografado e armazenado em um cookie.
    // JSON Web Tokens podem ser usados ​​para tokens de sessão se habilitados com session: { strategy: "jwt" }a opção. JSON Web Tokens serão ativados por padrão se você não tiver especificado um adaptador. JSON Web Tokens são criptografados (JWE) por padrão. Recomendamos que você mantenha esse comportamento. Consulte a opção Substituir JWT encodee decodemétodos avançados.
    // Os argumentos user , account , profile e isNewUser só são passados ​​na primeira vez que esse callback for chamado em uma nova sessão, após o login do usuário. Nas chamadas subsequentes, somente token estará disponível.
    jwt: async ({ token, account: account, profile: profile }) => {
      if (account && account.provider == 'google') {
        token.accessToken = account.access_token
        token.email = profile?.email
      } else {
        token.accessToken = account?.access_token
        token.email = profile?.email
      }
      return token
    },
    // O retorno de chamada da sessão é chamado sempre que uma sessão é verificada. Por padrão, apenas um subconjunto do token é retornado para aumentar a segurança . Se você quiser disponibilizar algo que adicionou ao token (como access_tokene user.idacima) por meio do jwt()retorno de chamada, você deve encaminhá-lo explicitamente aqui para disponibilizá-lo ao cliente.

    session: async ({ session, token }) => {
      if (token) {
        if (token.provider === 'google') {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
          session.user.image = token.picture;
        } else {
          session.user.id = token.id;
          session.user.name = token.name;
          session.user.email = token.email;
        }
      }
      return session;
    },
  },
  debug: true,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: env.NEXTAUTH_SECRET,
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
