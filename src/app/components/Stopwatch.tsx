"use client";

import { useEffect } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/16/solid"; // Import Heroicons

export default function Stopwatch({
  isRunning,
  time,
  isPuzzleComplete, // Added isPuzzleComplete prop
  onToggle,
  setTime, // Pass setTime to Stopwatch
}: {
  isRunning: boolean;
  time: number; // Current time in seconds
  isPuzzleComplete: boolean; // Added isPuzzleComplete prop
  onToggle: () => void;
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center space-x-1">
      <p>{formatTime(time)}</p>
      {!isPuzzleComplete && (
        <button onClick={() => onToggle()}>
          {isRunning ? (
            <PauseIcon className="h-4 w-4" /> // Pause icon
          ) : (
            <PlayIcon className="h-4 w-4" /> // Play icon
          )}
        </button>
      )}
    </div>
  );
}