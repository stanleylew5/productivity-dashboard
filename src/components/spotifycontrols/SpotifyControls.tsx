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
        className="text-dash-orange-200 text-[2vw] pr-4"
      >
        <BiSolidSkipPreviousCircle/>
      </button>
      <button
        onClick={togglePlayback}
        className="text-dash-orange-200 text-[2vw]"
      >
        {isPlaying ? <FaPauseCircle/> : <FaCirclePlay className="text-[2vw]"/>}
      </button>
      <button
        onClick={skipToNext}
        className="text-dash-orange-200 text-[2vw] pl-4"
      >
        <BiSolidSkipNextCircle/>
      </button>
    </div>
  );
};

export default SpotifyControls;
