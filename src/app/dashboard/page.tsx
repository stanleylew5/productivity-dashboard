"use client";

import { useSession, signOut } from "next-auth/react";

import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Sign out without redirecting immediately
    router.push("/"); // Redirect to home page after sign-out
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {session?.user?.name}!</h1>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
