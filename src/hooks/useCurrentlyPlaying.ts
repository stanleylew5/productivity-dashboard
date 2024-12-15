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
  const [errorCurrPlay, setErrorCurrPlay] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.spotifyAccessToken) return;

    const fetchCurrentlyPlayingTrack = async () => {
      try {
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
        setErrorCurrPlay("Error fetching currently playing track");
      }
    };

    fetchCurrentlyPlayingTrack();

    const interval = setInterval(fetchCurrentlyPlayingTrack, 1000);
    return () => clearInterval(interval);
  }, [session.spotifyAccessToken]);

  return { currentTrack, errorCurrPlay };
};

export default useSpotifyCurrentlyPlaying;
