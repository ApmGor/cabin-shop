import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import {createGuest, getGuest} from "@/app/_lib/data-service";

const authConfig = {
  providers: [Google],
  callbacks: {
    authorized({auth, request}) {
      return !!auth;
    },
    async signIn({user, account, profile}) {
      try {
        const existingGuest = await getGuest(user.email);
        if (!existingGuest) await createGuest({email: user.email, fullName: user.name});
        return true;
      } catch {
        return false;
      }
    },
    async session({session, token}){
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
}

export const { signIn, signOut, handlers: {GET, POST}, auth } = NextAuth(authConfig);