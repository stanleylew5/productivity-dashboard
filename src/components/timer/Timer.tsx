"use client";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { RiRestartFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const Timer = () => {
  const { data: session } = useSession();
  const [receivedTime, setReceivedTime] = useState<number | null>(null); // Time fetched in minutes
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false); // Running status
  const [isPaused, setIsPaused] = useState(false); // Paused status

  // Fetch the timer from Firestore
  useEffect(() => {
    const fetchTimerInfo = async () => {
      if (!session?.user?.id) return;
      try {
        const userRef = doc(db, "users", session.user.email);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const fetchedTime = userData.timer || 0; // Fetched time in minutes
          setReceivedTime(fetchedTime);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchTimerInfo();
  }, [session?.user?.id]);

  // Update the `time` in seconds based on receivedTime (fetched from Firestore)
  useEffect(() => {
    if (receivedTime !== null) {
      setTime(receivedTime * 60); // Convert minutes to seconds
    }
  }, [receivedTime]);

  // Timer logic to decrement the time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (time === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, time]);

  // Format time to HR:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="rounded-lg pt-4 text-center">
        <div className="cursor-pointer text-6xl font-bold">
          {formatTime(time)}
        </div>
        {isRunning ? (
          <div className="mt-4 flex justify-center">
            <button
              className="mr-2 rounded py-2 text-[2vw] text-dash-orange-200 hover:text-dash-orange-100"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <FaCirclePlay /> : <FaCirclePause />}
            </button>
            <button
              className="ml-2 rounded text-[2.35vw] text-dash-orange-200 hover:text-dash-orange-100"
              onClick={() => {
                if (receivedTime !== null) {
                  // Reset time to fetched value from Firestore (in seconds)
                  setTime(receivedTime * 60);
                  setIsRunning(false);
                  setIsPaused(false);
                }
              }}
            >
              <RiRestartFill />
            </button>
          </div>
        ) : (
          <button
            className="mt-4 rounded text-[2vw] text-dash-orange-100"
            onClick={() => {
              if (time > 0) {
                setIsRunning(true);
                setIsPaused(false);
              }
            }}
          >
            <FaCirclePlay />
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
