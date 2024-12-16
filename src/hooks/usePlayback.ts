"use client";
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";

const usePlayback = () => {
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchPlaybackState = useCallback(async () => {
    if (!session?.spotifyAccessToken) return;

    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${session.spotifyAccessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playback state");
      }

      const playbackState = await response.json();
      setIsPlaying(playbackState.is_playing);
    } catch (error) {
      console.error("Error fetching playback state:", error);
    }
  }, [session?.spotifyAccessToken]);

  const togglePlayback = useCallback(async () => {
    if (!session?.spotifyAccessToken) return;

    try {
      const action = isPlaying ? "pause" : "play";
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.spotifyAccessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} playback`);
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error(`Error toggling playback:`, error);
    }
  }, [isPlaying, session?.spotifyAccessToken]);

  useEffect(() => {
    fetchPlaybackState();
  }, [fetchPlaybackState]);

  return { isPlaying, togglePlayback };
};

export default usePlayback;
