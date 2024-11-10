"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Track {
  item: {
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
  };
}

const useSpotifyCurrentlyPlaying = () => {
  const { data: session } = useSession();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.spotifyAccessToken) return;

    const fetchCurrentlyPlayingTrack = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              Authorization: `Bearer ${session.spotifyAccessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch currently playing track");
        }

        const data = await response.json();
        setCurrentTrack(data);
      } catch (error) {
        setError("Error fetching currently playing track");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentlyPlayingTrack();

    const interval = setInterval(fetchCurrentlyPlayingTrack, 1000);
    return () => clearInterval(interval);
  }, [session.spotifyAccessToken]);

  return { currentTrack, loading, error };
};

export default useSpotifyCurrentlyPlaying;
