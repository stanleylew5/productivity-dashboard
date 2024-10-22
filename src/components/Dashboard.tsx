"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import dashboard from "../../public/dash.webp";
import Clock from "./clock/Clock";
import { IoMdSettings } from "react-icons/io";
import Weather from "./weather/Weather";
import Events from "./events/Events";
import Link from "next/link";
import Timer from "./timer/Timer";
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
          {/*<p className="text-[4.5vw] leading-none tracking-wider">00:00:00</p>*/}
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
        <div className="flex items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20">
          Coming Soon
        </div>
      </div>
      <div className="mx-[10vw] flex h-[10vh] items-center justify-center rounded-xl bg-dash-orange-100 bg-opacity-20">
        <p className="text-dash-orange-200">Coming Soon</p>
      </div>
      <button className="absolute bottom-12 right-12 text-[4vw]">
        <Link href="/settings">
          <IoMdSettings />
        </Link>
      </button>
    </div>
  );
};

export default Dashboard;
