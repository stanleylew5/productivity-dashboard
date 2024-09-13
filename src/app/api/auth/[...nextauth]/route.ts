import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore imports
import { db } from "@/utils/firebase";

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
        // Store user data in Firestore on sign-in
        const userRef = doc(db, "users", user.id!); // Firestore document with user's email as the ID
        await setDoc(
          userRef,
          {
            name: user.name,
            email: user.email,
            city: "", // Placeholder for user city
            timezone: "",
            services: {
              spotify: false,
              googleCalendar: false,
            },
          },
          { merge: true },
        ); // Use merge to update if document exists

        return true; // Return true to proceed with the sign-in
      } catch (error) {
        console.error("Error storing user in Firestore:", error);
        return false; // Return false if storing fails to prevent sign-in
      }
    },

    async session({ session, token }) {
      // Safely check if session and session.user exist
      if (session?.user) {
        session.user.id = token.sub; // Add user's ID to the session
      }
      return session;
    },
  },
};

// Export NextAuth route handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
