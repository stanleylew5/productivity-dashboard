"use client";
import { useSession } from "next-auth/react";
import useSpotifyCurrentlyPlaying from "@/hooks/useCurrentlyPlaying";
import useSpotifyQueue from "@/hooks/useQueue";
import Image from "next/image";
import note from "../../../public/note.png";
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
          {currentTrack.item.album.images?.[0]?.url ? (
            <Image
              src={currentTrack.item.album.images[0].url}
              alt="Album Cover"
              className="mb-4 w-[9vw] rounded-lg"
              width={160}
              height={160}
            />
          ) : (
            <div className="mb-4 flex h-[9vw] w-[9vw] items-center justify-center rounded-lg bg-dash-gray-100">
              <Image
                src={note}
                alt="Missing Album Fallback"
                className="h-12 w-12"
                width={48}
                height={48}
              />
            </div>
          )}
          <p className="text-md">{currentTrack.item.name}</p>
          <p className="text-xs text-dash-orange-100">
            {currentTrack.item.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      )}
      <div>
        {queue.map((track, index) => (
          <QueueItem
            key={index}
            albumUrl={track.album.images?.[index]?.url}
            songName={track.name}
            artist={track.artists.map((artist) => artist.name).join(", ")}
          />
        ))}
      </div>
    </div>
  );
};

export default Queue;
