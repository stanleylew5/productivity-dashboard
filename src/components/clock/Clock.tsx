"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);

  const hours12 = date.getHours() % 12 || 12;
  const minutesFormatted = date.getMinutes().toString().padStart(2, "0");

  const amPm = date.getHours() >= 12 ? "PM" : "AM";

  return `${hours12}:${minutesFormatted} ${amPm}`;
};

const Clock = () => {
  const { data: session } = useSession();
  const [time, setTime] = useState<string>(""); // state as string
  const [timeZone, setTimeZone] = useState<string>("");

  useEffect(() => {
    const fetchTimeZone = async () => {
      if (!session?.user?.id) return;
      try {
        const userRef = doc(db, "users", session.user.id);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setTimeZone(userData.timezone || "America/Los_Angeles"); // fallback if no timezone
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchTimeZone();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!timeZone) return;

    const fetchTime = async () => {
      try {
        const response = await axios.get(
          `https://timeapi.io/api/Time/current/zone?timeZone=${timeZone}`,
        );
        const { time } = response.data;
        setTime(formatTime(time)); // `formatTime()` now returns a string
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();

    const intervalId = setInterval(fetchTime, 1000); // Update the time every second

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [timeZone]); // Refetches if timeZone changes

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-[9.5vw] leading-none">{time}</p>
    </div>
  );
};

export default Clock;
