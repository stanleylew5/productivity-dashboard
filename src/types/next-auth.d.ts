/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    googleAccessToken?: string | null;
    spotifyAccessToken?: string | null;
    googleRefreshToken?: string | null;
    spotifyRefreshToken?: string | null;
    googleExpiresAt?: number | null;
    spotifyExpiresAt?: number | null;
    error?: string | null;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    googleAccessToken?: string | null;
    spotifyAccessToken?: string | null;
    googleRefreshToken?: string | null;
    spotifyRefreshToken?: string | null;
    googleExpiresAt?: number;
    spotifyExpiresAt?: number;
    error?: string | null;
    provider?: string;
  }
}
