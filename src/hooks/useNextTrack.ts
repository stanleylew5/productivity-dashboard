"use client";
import { useCallback } from "react";
import { useSession } from "next-auth/react";

const useNextTrack = () => {
  const { data: session } = useSession();

  const skipToNext = useCallback(async () => {
    if (!session?.spotifyAccessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/next",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.spotifyAccessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to skip to the next track");
      }

      console.log("Skipped to the next track.");
    } catch (error) {
      console.error("Error skipping to the next track:", error);
    }
  }, [session?.spotifyAccessToken]);

  return { skipToNext };
};

export default useNextTrack;
