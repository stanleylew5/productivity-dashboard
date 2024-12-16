"use client";
import { useCallback } from "react";
import { useSession } from "next-auth/react";

const usePreviousTrack = () => {
  const { data: session } = useSession();

  const skipToPrevious = useCallback(async () => {
    if (!session?.spotifyAccessToken) return;

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/previous",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.spotifyAccessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to skip to the previous track");
      }

      console.log("Skipped to the previous track.");
    } catch (error) {
      console.error("Error skipping to the previous track:", error);
    }
  }, [session?.spotifyAccessToken]);

  return { skipToPrevious };
};

export default usePreviousTrack;
