"use client";

import { useState, useEffect } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/16/solid"; // Import Heroicons

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true); // Start running by default

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center space-x-1">
      <p>{formatTime(time)}</p>
      <button
        onClick={() => setIsRunning((prev) => !prev)}
      >
        {isRunning ? (
          <PauseIcon className="h-4 w-4" /> // Pause icon
        ) : (
          <PlayIcon className="h-4 w-4" /> // Play icon
        )}
      </button>
    </div>
  );
}