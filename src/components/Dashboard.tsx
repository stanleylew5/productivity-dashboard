"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dashboard from "../../public/dash.webp";
import TimeZoneSelect from "./TimeZoneSelect";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [city, setCity] = useState("");
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Sign out without redirecting immediately
    router.push("/"); // Redirect to home page after sign-out
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

  if (status === "loading") {
    // will need to create loading page later
    return <div>Loading...</div>;
  }

  return (
    <div className="text-dash-orange-200">
      <Image
        src={dashboard}
        alt="dashboard bg"
        className="absolute z-[-1] h-screen w-screen"
      />
      <div className="grid grid-cols-2 gap-20 px-[10vw] pt-[3vh]">
        <div className="flex flex-col items-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          <p className="pb-4 pt-2 text-[0.75vw]"> Riverside, California</p>
          <p className="text-[4.5vw] leading-none tracking-wider">100° F</p>
          <p className="pb-2 pt-4 text-[0.75vw]">Last updated 11:11 pm</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          <p className="text-[4.5vw] leading-none tracking-wider">00:00:00</p>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-8 px-[2vw] py-[3.5vh]">
        <div className="flex flex-col items-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          <p className="pt-2 text-[1.8vw]">Upcoming</p>
          <p className="text-[1.8vw] leading-none">Events</p>
        </div>
        <div className="col-span-2 flex flex-col items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20 py-[12vh]">
          <p className="text-[9.5vw] leading-none">11:11:11</p>
          <p className="text-[9.5vw] leading-none">PM</p>
        </div>
        <div className="rounded-xl bg-dash-orange-100 bg-opacity-20">e</div>
      </div>
      <div className="mx-[10vw] h-[10vh] rounded-xl bg-dash-orange-100 opacity-20"></div>
      <div className="flex flex-col bg-dash-black-100 text-dash-orange-100">
        <p>Welcome, {session?.user?.name}!</p>
        <button onClick={handleSignOut}>Sign out</button>
        <input
          type="text"
          placeholder="Enter your city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="custom-input" // temporary styling for readability
        />
        <button onClick={handleCityUpdate}>Update City</button>
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
        <TimeZoneSelect />
      </div>
    </div>
  );
};

export default Dashboard;
