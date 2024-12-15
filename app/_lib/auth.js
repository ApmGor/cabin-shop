import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const authConfig = {
  providers: [Google],
  callbacks: {
    authorized({auth, request}) {
      return !!auth?.user;
    }
  },
  pages: {
    signIn: "/login",
  },
}

export const { signIn, signOut, handlers: {GET, POST}, auth } = NextAuth(authConfig);