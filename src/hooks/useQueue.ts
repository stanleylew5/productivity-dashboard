"use client";
import { useEffect, useState } from "react";

interface QueueTrack {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

const useSpotifyQueue = (accessToken: string | null) => {
  const [queue, setQueue] = useState<QueueTrack[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchQueue = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/queue",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch queue");
        }

        const data = await response.json();
        setQueue(data.queue.slice(0, 3));
      } catch (error) {
        setError("Error fetching queue");
      }
    };

    fetchQueue();

    const interval = setInterval(fetchQueue, 1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  return { queue, error };
};

export default useSpotifyQueue;
