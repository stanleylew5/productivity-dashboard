"use client";
import { useSession, signOut } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { SelectTime } from "./clock/SelectTime";
import { SetCity } from "./weather/SetCity";
import Link from "next/link";
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
    <div className="flex h-screen w-screen flex-col justify-center bg-dash-black-100 px-[10%] text-dash-orange-100">
      <p className="pb-4">Welcome, {session?.user?.name}!</p>
      <SetCity />
      <SelectTime />
      <button className="mb-2 rounded-xl border-2 border-dash-orange-100 bg-dash-black-100 p-2">
        <Link href="/dashboard"> Back to Dashboard</Link>
      </button>
      <button
        onClick={handleSignOut}
        className="rounded-xl border-2 border-dash-orange-100 bg-dash-black-100 p-2"
      >
        Sign out
      </button>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        rtl={false}
        theme="dark"
      />
    </div>
  );
};

export default Settings;
