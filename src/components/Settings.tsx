"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TimeZoneSelect from "./clock/TimeZoneSelect";
import { ToastContainer, toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
const Settings = () => {
  const { data: session, status } = useSession();
  const [city, setCity] = useState("");
  const [timezone, setTimeZone] = useState("");
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleCityUpdate = async () => {
    if (!session?.user.id) return;
    try {
      const userRef = doc(db, "users", session.user.id);

      await updateDoc(userRef, {
        city: city,
      });
      toast.success("City Updated");
    } catch (error) {
      toast.error("Error Ocurred");
    }
  };

  const handleTimeZone = async () => {
    if (!session?.user.id) return;
    try {
      const userRef = doc(db, "users", session.user.id);

      await updateDoc(userRef, {
        timezone: timezone,
      });
      toast.success("Time Zone Updated");
    } catch (error) {
      toast.error("Error Ocurred");
    }
  };

  const handleTimeZoneSelect = (selectedTimeZone: string) => {
    setTimeZone(selectedTimeZone);
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
      <input
        type="text"
        placeholder="Enter your city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="custom-input" // temporary styling for readability
      />
      <button
        onClick={handleCityUpdate}
        className="rounded-xl border-2 border-dash-orange-100 bg-dash-black-100 p-2"
      >
        Update City
      </button>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <TimeZoneSelect onSelect={handleTimeZoneSelect} />
      <button
        onClick={handleTimeZone}
        className="rounded-xl border-2 border-dash-orange-100 bg-dash-black-100 p-2"
      >
        Update Time Zone
      </button>
    </div>
  );
};

export default Settings;
