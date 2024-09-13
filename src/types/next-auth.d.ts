import NextAuth from "next-auth";
// Extend default session to include user ID
declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null; // Add id property
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
