/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
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
        session.googleAccessToken = token.googleAccessToken as string;
        session.spotifyAccessToken = token.spotifyAccessToken as string;
        session.error = token.error as string | null;
      }
      return session;
    },

    async jwt({ token, account }: any) {
      // Initial sign in
      if (account) {
        if (account.provider === "google") {
          token.googleAccessToken = account.access_token as string;
          token.googleRefreshToken = account.refresh_token as string;
          token.googleExpiresAt = Date.now() + (account.expires_in as number) * 1000;
        } else if (account.provider === "spotify") {
          token.spotifyAccessToken = account.access_token as string;
          token.spotifyRefreshToken = account.refresh_token as string;
          token.spotifyExpiresAt = Date.now() + (account.expires_in as number) * 1000;
        }
      }

      // Check if Google token needs to be refreshed
      if (Date.now() >= (token.googleExpiresAt as number)) {
        token = await refreshAccessToken(token, "google");
      }

      // Check if Spotify token needs to be refreshed
      if (Date.now() >= (token.spotifyExpiresAt as number)) {
        token = await refreshAccessToken(token, "spotify");
      }

      return token;
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
            timer: 30,
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
async function refreshAccessToken(token: JWT, provider: string): Promise<JWT> {
  try {
    if (provider === "google") {
      const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: token.googleRefreshToken,
        grant_type: "refresh_token",
      });
      const refreshedTokens = response.data;
      return {
        ...token,
        googleAccessToken: refreshedTokens.access_token,
        googleExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
        googleRefreshToken: refreshedTokens.refresh_token ?? token.googleRefreshToken,
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
      const refreshedTokens = response.data;
      return {
        ...token,
        spotifyAccessToken: refreshedTokens.access_token,
        spotifyExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
        spotifyRefreshToken: refreshedTokens.refresh_token ?? token.spotifyRefreshToken,
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
