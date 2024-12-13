"use client";
import { useSession } from "next-auth/react";
import useSpotifyCurrentlyPlaying from "@/hooks/useCurrentlyPlaying";
// import useSpotifyQueue from "@/hooks/useQueue";
import Image from "next/image";

const Queue = () => {
  const { data: session } = useSession();
  const { currentTrack, error } = useSpotifyCurrentlyPlaying();

  if (!session) {
    return <p>Please log in to see your Spotify queue.</p>;
  }
  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center rounded-lg bg-dash-black-100 py-4 text-dash-orange-100 drop-shadow-xl">
      {currentTrack && (
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src={currentTrack.item.album.images[0].url}
            alt="Album Cover"
            className="mb-4 rounded-lg"
            width={160}
            height={160}
          />
          <p className="text-md">{currentTrack.item.name}</p>
          <p className="text-xs text-dash-orange-100">
            {currentTrack.item.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Queue;
