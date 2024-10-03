import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { RiRestartFill } from "react-icons/ri";
import { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(0); // Time in seconds
  const [inputTime, setInputTime] = useState(""); // Input for setting time
  const [isRunning, setIsRunning] = useState(false); // Running status
  const [isPaused, setIsPaused] = useState(false); // Paused status
  // Timer logic to decrement the time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (time === 0) {
      setIsRunning(false); // Stop when time is up
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, time]);

  // Handle setting time from input
  const handleTimeSet = () => {
    const seconds = parseInt(inputTime, 10);
    if (!isNaN(seconds) && seconds >= 0) {
      setTime(seconds);
      setIsRunning(false);
    }
    setInputTime("");
  };

  // Format time to HR:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-80 rounded-lg p-8 text-center shadow-md">
        <div
          className="cursor-pointer text-5xl font-bold"
          onClick={() => !isRunning && setIsPaused(false)}
        >
          {formatTime(time)}
        </div>
        {/*<p className="text-[4.5vw] leading-none tracking-wider">00:00:00</p>*/}
        {!isRunning && (
          <div className="mt-4">
            <input
              type="number"
              placeholder="Set time (in seconds)"
              value={inputTime}
              onChange={(e) => setInputTime(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
            />
            <button
              className="mt-2 w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
              onClick={handleTimeSet}
            >
              Set Time
            </button>
          </div>
        )}

        {isRunning ? (
          <div className="mt-4 flex justify-between">
            <button
              className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <FaCirclePlay /> : <FaCirclePause />}
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={() => {
                setIsRunning(false);
                setTime(0);
              }}
            >
              <RiRestartFill />
            </button>
          </div>
        ) : (
          <button
            className="mt-4 rounded text-[2vw] text-dash-orange-100"
            onClick={() => {
              if (time > 0) {
                setIsRunning(true);
                setIsPaused(false);
              }
            }}
          >
            <FaCirclePlay />
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
