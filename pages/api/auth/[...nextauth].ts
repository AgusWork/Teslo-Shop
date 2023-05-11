import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

import { dbUsers } from '../../../database';

declare module "next-auth" {
    interface Session {
      accessToken?: string;
    }
}; 
export default NextAuth({
  // Configure one or more authentication providers
  providers: [   
    // ...add more providers here
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com'  },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña'  },
      },
      async authorize(credentials) {
        console.log({credentials})
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };

        return await dbUsers.checkUserEmailPassword( credentials!.email, credentials!.password );
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log({ token, account, user });
      if ( account ) {
       token.accessToken = account.access_token;
        switch( account.type ) {
          case 'oauth': 
            token.user = await dbUsers.oAUthToDbUser( user?.email || '', user?.name || '' );
          break;

          case 'credentials':
            token.user = user;
          break;
        }

      }

      return token;
    },
    async session({ session, token, user }){
      // console.log({ session, token, user });
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;

      return session;
    }
    

  }

});