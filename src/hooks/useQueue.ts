"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

const useSpotifyQueue = () => {
  const { data: session } = useSession();
  const [queue, setQueue] = useState<Track[]>([]);
  const [errorQueue, setErrorQueue] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.spotifyAccessToken) return;

    const fetchQueue = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/queue",
          {
            headers: {
              Authorization: `Bearer ${session.spotifyAccessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch queue");
        }

        const data = await response.json();
        setQueue(data.queue.slice(0, 3));
      } catch (error) {
        setErrorQueue("Error fetching queue");
      }
    };

    fetchQueue();

    const interval = setInterval(fetchQueue, 1000);
    return () => clearInterval(interval);
  }, [session.spotifyAccessToken]);

  return { queue, errorQueue };
};

export default useSpotifyQueue;
