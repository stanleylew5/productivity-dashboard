"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

const Weather = () => {
  const { data: session } = useSession();
  const [city, setCity] = useState<string>("");
  const [region, setRegion] = useState<string>("California");
  const [recentTime, setRecentTime] = useState<string>("");
  const [temp, setTemp] = useState<number>();

  useEffect(() => {
    const fetchCity = async () => {
      if (!session?.user.id) return;

      try {
        const userRef = doc(db, "users", session.user.id);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.city && userData.city !== "") {
            setCity(userData.city); // Use city from Firestore if it exists
          } else {
            setCity("Los Angeles"); // Fallback to default
            await setDoc(userRef, { city: "Los Angeles" }, { merge: true }); // Only set if city is not in Firestore
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user city", error);
      }
    };

    fetchCity();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!city) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json`,
          {
            params: {
              key: process.env.WEATHER_API_KEY,
              q: city,
            },
          },
        );
        const data = response.data;
        const region = data.location.region;
        const updatedTime = data.current.last_updated;
        const temperature = data.current.temp_f;

        setRegion(region);
        setRecentTime(updatedTime);
        setTemp(Math.floor(temperature));
      } catch (error) {
        console.error("Error fetching region:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 120000); // Update the time every 2 minutes
    return () => clearInterval(intervalId);
  }, [city]);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="pb-4 pt-2 text-[0.75vw]">
        {city}, {region}
      </p>
      <p className="text-[4.5vw] leading-none tracking-wider">{temp}° F</p>
      <p className="pb-2 pt-4 text-[0.75vw]">Last updated {recentTime}</p>
    </div>
  );
};

export default Weather;
