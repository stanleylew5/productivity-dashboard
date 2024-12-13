"use client";
import { useSession, signIn } from "next-auth/react";
import dashboard from "../../public/dash.webp";
import { IoMdSettings } from "react-icons/io";
import Clock from "./clock/Clock";
import Weather from "./weather/Weather";
import Events from "./events/Events";
import Timer from "./timer/Timer";
import Queue from "./queue/Queue";
import Image from "next/image";
import Link from "next/link";

const handleLogin = async (provider: "google" | "spotify") => {
  await signIn(provider, { callbackUrl: "/" });
};

const Dashboard = () => {
  const { status } = useSession();

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
        <div className="rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Weather />
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Timer />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8 px-[2vw] py-[3.25vh]">
        <div className="flex flex-col items-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Events />
        </div>
        <div className="col-span-2 rounded-xl bg-dash-orange-100 bg-opacity-20 py-[12vh]">
          <Clock />
        </div>
        <div className="rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Queue />
        </div>
      </div>
      <div className="mx-[10vw] flex h-[9vh] items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20">
        <button onClick={() => handleLogin("spotify")}>
          Log in with Spotify
        </button>
        <button onClick={() => handleLogin("google")}>
          Log in with Google
        </button>
      </div>
      <button className="absolute bottom-[2vh] right-12 text-[4vw]">
        <Link href="/settings">
          <IoMdSettings />
        </Link>
      </button>
    </div>
  );
};

export default Dashboard;
