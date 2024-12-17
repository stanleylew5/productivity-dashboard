"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import loginbg from "../../public/login.jpg";
import dashboard from "../../public/dashboard.jpg";
import clock from "../../public/clock.png";
import Image from "next/image";

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-dash-black-100">
        <div className="px-8 py-4 text-dash-orange-200">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Image
        className="absolute z-[-1] h-screen w-screen"
        src={dashboard}
        alt="loginbg"
      />
      <div className="flex flex-col items-center justify-center text-white">
        <Image
          className="mb-[5vh] mt-[10vh] w-[8vw] invert"
          src={clock}
          alt="clock"
        />
        <p className="mb-[5vh] text-5xl text-white">Sign in to Dashboard</p>
        <div className="rounded-md border-2 border-white bg-purple-200 px-[10vw] py-[4vh] text-purple-950">
          {!session && (
            <button
              onClick={() => signIn("google")}
              className="flex flex-row items-center gap-4 text-4xl"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
