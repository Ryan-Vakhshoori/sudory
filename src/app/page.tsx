"use client";

import Grid from "./components/Grid";
import Stopwatch from "./components/Stopwatch";
import { useState } from "react";

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);

  return (
    <div className="relative h-screen">
      {/* Stopwatch positioned above the grid */}
      <div className="absolute top-12 w-full flex justify-center">
        <Stopwatch isRunning={isRunning} onToggle={setIsRunning} />
      </div>
      {/* Grid centered horizontally and vertically */}
      <div className="flex justify-center items-center h-full">
        <Grid isRunning={isRunning} onResume={() => setIsRunning(true)} />
      </div>
    </div>
  );
}
