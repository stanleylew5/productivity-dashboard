/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import axios from "axios";
import { JWT } from "next-auth";

// Define NextAuth options
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Include the access token in the session
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.accessToken = token.accessToken as string;
        session.error = token.error as string | null;
      }
      return session;
    },

    // Store and refresh the access token in the JWT
    async jwt({ token, account }: any) {
      // Initial sign in
      if (account) {
        token.accessToken = account.access_token as string;
        token.refreshToken = account.refresh_token as string; // Store the refresh token
        token.accessTokenExpires =
          Date.now() + (account.expires_in as number) * 1000; // Expiration time
      }

      // Return the previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, so refresh it
      return await refreshAccessToken(token); // Temporarily casting token as `any`
    },

    async signIn({ user }) {
      try {
        const userRef = doc(db, "users", user.id!);
        await setDoc(
          userRef,
          {
            name: user.name,
            email: user.email,
            services: {
              spotify: false,
              googleCalendar: true,
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
  },
};

// Function to refresh the access token
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: token.refreshToken, // Access refreshToken from JWT
      grant_type: "refresh_token",
    });

    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // New expiration time
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
