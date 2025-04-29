"use client";

import Grid from "./components/Grid";
import Stopwatch from "./components/Stopwatch";
import MoveCounter from "./components/MoveCounter";
import { useState } from "react";

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);
  const [moveCount, setMoveCount] = useState(0);

  return (
    <div className="relative h-screen">
      {/* Stopwatch positioned above the grid */}
      <div className="absolute top-12 w-full flex justify-center space-x-4">
        <Stopwatch isRunning={isRunning} onToggle={() => setIsRunning((prevRunning) => !prevRunning)} />
        <MoveCounter moveCount={moveCount} />
      </div>
      {/* Grid centered horizontally and vertically */}
      <div className="flex justify-center items-center h-full">
        <Grid
          isRunning={isRunning}
          onResume={() => setIsRunning(true)}
          onMove={() => setMoveCount((prevCount) => prevCount + 1)} // Fixed
        />
      </div>
    </div>
  );
}
