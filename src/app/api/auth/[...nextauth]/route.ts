/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import { NextAuthOptions } from "next-auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
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
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/google",
        },
      },
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "user-read-playback-state user-read-currently-playing user-modify-playback-state user-read-email user-read-private",
          redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/spotify",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;

        const userRef = doc(db, "users", session.user.email!);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          session.googleAccessToken = userData.googleAccessToken || null;
          session.spotifyAccessToken = userData.spotifyAccessToken || null;
          session.googleExpiresAt = userData.googleExpiresAt || null;
          session.spotifyExpiresAt = userData.spotifyExpiresAt || null;
        } else {
          console.warn(
            `No Firestore document found for user: ${session.user.email}`,
          );
        }

        session.error = token.error as string | null;
      }

      return session;
    },

    async jwt({ token, account, session }: any) {
      if (account) {
        if (account.provider === "google") {
          token.googleAccessToken = account.access_token as string;
          token.googleRefreshToken = account.refresh_token as string;
          token.googleExpiresAt =
            Date.now() + (account.expires_in as number) * 1000;
        } else if (account.provider === "spotify") {
          token.spotifyAccessToken = account.access_token as string;
          token.spotifyRefreshToken = account.refresh_token as string;
          token.spotifyExpiresAt =
            Date.now() + (account.expires_in as number) * 1000;
        }
      }

      if (Date.now() >= (token.googleExpiresAt as number)) {
        token = await refreshAccessToken(token, session, "google");
      }

      if (Date.now() >= (token.spotifyExpiresAt as number)) {
        token = await refreshAccessToken(token, session, "spotify");
      }

      return token;
    },

    async signIn({ user, account }) {
      try {
        const userRef = doc(db, "users", user.email!);
        const userDoc = await getDoc(userRef);
        const currentData = userDoc.exists() ? userDoc.data() : {};

        const googleExpiresAt =
          account.provider === "google" &&
          typeof account.expires_in === "number"
            ? Date.now() + account.expires_in * 1000
            : currentData.googleExpiresAt || Date.now() + 3500 * 1000;

        const spotifyExpiresAt =
          account.provider === "spotify" &&
          typeof account.expires_in === "number"
            ? Date.now() + account.expires_in * 1000
            : currentData.spotifyExpiresAt || Date.now() + 3500 * 1000;

        await setDoc(
          userRef,
          {
            name: user.name,
            email: user.email,
            services: {
              spotify:
                currentData.services?.spotify || account.provider === "spotify",
              googleCalendar:
                currentData.services?.googleCalendar ||
                account.provider === "google",
            },
            timer: currentData.timer || 30,
            googleAccessToken:
              account.provider === "google"
                ? account.access_token
                : currentData.googleAccessToken,
            spotifyAccessToken:
              account.provider === "spotify"
                ? account.access_token
                : currentData.spotifyAccessToken,
            googleExpiresAt,
            spotifyExpiresAt,
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

// Function to refresh the access token based on provider
async function refreshAccessToken(
  token: JWT,
  session: any,
  provider: string,
): Promise<JWT> {
  try {
    let refreshedTokens;
    if (provider === "google") {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: token.googleRefreshToken,
        grant_type: "refresh_token",
      });
      refreshedTokens = response.data;

      // Update Firestore with new tokens using session.user.email
      if (session?.user?.email) {
        const userRef = doc(db, "users", session.user.email);
        await setDoc(
          userRef,
          {
            googleAccessToken: refreshedTokens.access_token,
            googleExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
          },
          { merge: true },
        );
      }

      return {
        ...token,
        googleAccessToken: refreshedTokens.access_token,
        googleExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
        googleRefreshToken:
          refreshedTokens.refresh_token ?? token.googleRefreshToken,
      };
    } else if (provider === "spotify") {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        null,
        {
          params: {
            grant_type: "refresh_token",
            refresh_token: token.spotifyRefreshToken,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
          },
        },
      );
      refreshedTokens = response.data;

      // Update Firestore with new tokens using session.user.email
      if (session?.user?.email) {
        const userRef = doc(db, "users", session.user.email);
        await setDoc(
          userRef,
          {
            spotifyAccessToken: refreshedTokens.access_token,
            spotifyExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
          },
          { merge: true },
        );
      }

      return {
        ...token,
        spotifyAccessToken: refreshedTokens.access_token,
        spotifyExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
        spotifyRefreshToken:
          refreshedTokens.refresh_token ?? token.spotifyRefreshToken,
      };
    }
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
