"use client";

import { useEffect } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/16/solid"; // Import Heroicons
import { formatTime } from "../utils/formatTime"; // Import formatTime utility function

export default function Stopwatch({
  isRunning,
  time,
  isPuzzleComplete, // Added isPuzzleComplete prop
  setIsRunning,
  setTime, // Pass setTime to Stopwatch
}: {
  isRunning: boolean;
  time: number; // Current time in seconds
  isPuzzleComplete: boolean; // Added isPuzzleComplete prop
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setTime: React.Dispatch<React.SetStateAction<number>>;
}) {

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime: number) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, setTime]);

  return (
    <div className="flex items-center space-x-1">
      <p>{formatTime(time)}</p>
      {!isPuzzleComplete && (
        <button onClick={() => setIsRunning((prev) => !prev)}>
          {isRunning ? (
            <PauseIcon className="size-4 cursor-pointer text-stone-950 hover:text-stone-500" /> // Pause icon
          ) : (
            <PlayIcon className="size-4 cursor-pointer text-stone-950 hover:text-stone-500" /> // Play icon
          )}
        </button>
      )}
    </div>
  );
}