"use client";
import { useSession } from "next-auth/react";
import dashboard from "../../public/dash.webp";
import { IoMdSettings } from "react-icons/io";
import Clock from "./clock/Clock";
import Weather from "./weather/Weather";
import Events from "./events/Events";
import Timer from "./timer/Timer";
import Queue from "./queue/Queue";
import SpotifyControls from "./spotifycontrols/SpotifyControls";
import Image from "next/image";
import Link from "next/link";

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

      <div className="grid grid-cols-2 gap-20 px-[10vw] pt-[2vh]">
        <div className="rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Weather />
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Timer />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-8 px-[2vw] py-[2.5vh]">
        <div className="flex flex-col items-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Events />
        </div>
        <div className="col-span-2 rounded-xl bg-dash-orange-100 bg-opacity-20 py-[11.5vh]">
          <Clock />
        </div>
        <div className="rounded-xl bg-dash-orange-100 bg-opacity-20">
          <Queue />
        </div>
      </div>
      <div className="mx-[10vw] flex h-[8vh] items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20">
        <SpotifyControls />
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
