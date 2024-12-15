"use client";
2;
import { useSession } from "next-auth/react";
import useSpotifyCurrentlyPlaying from "@/hooks/useCurrentlyPlaying";
import useSpotifyQueue from "@/hooks/useQueue";
import Image from "next/image";
import QueueItem from "./QueueItem";

const Queue = () => {
  const { data: session } = useSession();
  const { currentTrack, errorCurrPlay } = useSpotifyCurrentlyPlaying();
  const { queue, errorQueue } = useSpotifyQueue();

  if (!session) {
    return <p>Please log in to see your Spotify queue.</p>;
  }
  if (errorCurrPlay) return <p>{errorCurrPlay}</p>;

  return (
    <div className="rounded-lg py-4 text-dash-orange-100 drop-shadow-xl">
      {currentTrack && (
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src={currentTrack.item.album.images[0].url}
            alt="Album Cover"
            className="mb-4 w-[9vw] rounded-lg"
            width={160}
            height={160}
          />
          <p className="text-md">{currentTrack.item.name}</p>
          <p className="text-xs text-dash-orange-100">
            {currentTrack.item.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      )}
      <div className="">
        {queue.map((track, index) => (
          <QueueItem
            key={index}
            albumUrl={track.album.images[index].url}
            songName={track.name}
            artist={track.artists.map((artist) => artist.name).join(", ")}
          />
        ))}
      </div>
    </div>
  );
};

export default Queue;
