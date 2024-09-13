import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        const userRef = doc(db, "users", user.id!);
        await setDoc(
          userRef,
          {
            name: user.name,
            email: user.email,
            city: "",
            timezone: "",
            services: {
              spotify: false,
              googleCalendar: false,
            },
          },
          { merge: true },
        );

        return true;
      } catch (error) {
        console.error("Error storing user in Firestore:", error);
        return false;
      }
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
