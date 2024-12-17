"use client";
import React from "react";
import usePlayback from "@/hooks/usePlayback";
import usePreviousTrack from "@/hooks/usePreviousTrack";
import useNextTrack from "@/hooks/useNextTrack";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { BiSolidSkipPreviousCircle } from "react-icons/bi";
import { BiSolidSkipNextCircle } from "react-icons/bi";

const SpotifyControls = () => {
  const { isPlaying, togglePlayback } = usePlayback();
  const { skipToPrevious } = usePreviousTrack();
  const { skipToNext } = useNextTrack();

  return (
    <div>
      <button
        onClick={skipToPrevious}
        className="pr-4 text-[2vw] text-dash-orange-200"
      >
        <BiSolidSkipPreviousCircle />
      </button>
      <button
        onClick={togglePlayback}
        className="text-[2vw] text-dash-orange-200"
      >
        {isPlaying ? (
          <FaPauseCircle />
        ) : (
          <FaCirclePlay className="text-[2vw]" />
        )}
      </button>
      <button
        onClick={skipToNext}
        className="pl-4 text-[2vw] text-dash-orange-200"
      >
        <BiSolidSkipNextCircle />
      </button>
    </div>
  );
};

export default SpotifyControls;
