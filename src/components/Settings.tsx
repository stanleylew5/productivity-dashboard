"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectTime } from "./clock/SelectTime";
import { SetCity } from "./weather/SetCity";
const Settings = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  if (status === "loading") {
    // will need to create loading page later
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8 flex flex-col bg-dash-black-100 text-dash-orange-100">
      <p className="pb-4">Welcome, {session?.user?.name}!</p>
      <button
        onClick={handleSignOut}
        className="rounded-xl border-2 border-dash-orange-100 bg-dash-black-100 p-2"
      >
        Sign out
      </button>
      <SetCity />
      <SelectTime />
    </div>
  );
};

export default Settings;
