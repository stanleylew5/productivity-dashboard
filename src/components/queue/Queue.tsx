"use client";
import { useSession } from "next-auth/react";
import useSpotifyCurrentlyPlaying from "@/hooks/useCurrentlyPlaying";
// import useSpotifyQueue from "@/hooks/useQueue";
import Image from "next/image";

const Queue = () => {
  const { data: session } = useSession();
  const { currentTrack, loading, error } = useSpotifyCurrentlyPlaying();

  if (!session) {
    return <p>Please log in to see your Spotify queue.</p>;
  }
  if (loading) return <p>Loading time zones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mx-auto max-w-md rounded-lg bg-black bg-opacity-50 p-6 text-white">
      {currentTrack && (
        <div className="mb-8 text-center">
          <Image
            src={currentTrack.item.album.images[0].url}
            alt="Album Cover"
            className="mx-auto mb-4 rounded-lg"
            width={400}
            height={400}
          />
          <h2 className="text-xl font-semibold">{currentTrack.item.name}</h2>
          <p className="text-sm text-gray-300">
            {currentTrack.item.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default Queue;
