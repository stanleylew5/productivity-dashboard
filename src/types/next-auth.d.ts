import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string | null;
    error?: string | null; // Add the error property here
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    accessToken?: string | null;
    refreshToken?: string | null; // Add refreshToken if you're using it
    accessTokenExpires?: number; // Track when the access token expires
    error?: string | null; // Track error state if the token refresh fails
  }
}
