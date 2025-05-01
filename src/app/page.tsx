"use client";

import Grid from "./components/Grid";
import Stopwatch from "./components/Stopwatch";
import MoveCounter from "./components/MoveCounter";
import { useState } from "react";

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0); // Added puzzleIndex state

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-screen justify-start p-1 sm:p-2 md:p-4 space-x-1 sm:space-x-2 md:space-x-4">
        <p className="text-3xl sm:text-4xl md:text-5xl font-bold">Sudory</p>
        {puzzleIndex !== 0 && (
          <p className="text-3xl sm:text-4xl md:text-5xl">#{puzzleIndex}</p>
        )}
      </div>
      {/* Stopwatch positioned above the grid */}
      <div className="flex w-screen justify-center space-x-4 p-1 sm:p-2 md:p-4 border-t border-b border-gray-300">
        <Stopwatch
          isRunning={isRunning}
          onToggle={() => setIsRunning((prevRunning) => !prevRunning)}
          time={time}
          setTime={setTime} // Pass setTime to Stopwatch
          isPuzzleComplete={isPuzzleComplete} // Pass isPuzzleComplete to Stopwatch
        />
        <MoveCounter moveCount={moveCount} />
      </div>
      {/* Grid centered horizontally and vertically */}
      <div className="p-2 sm:p-4 md:p-8">
        <Grid
          isRunning={isRunning}
          onResume={() => setIsRunning(true)}
          onMove={() => setMoveCount((prevCount) => prevCount + 1)} // Fixed
          onComplete={() => {
            setIsRunning(false);
            setIsPuzzleComplete(true);
          }}
          time={time}
          moves={moveCount}
          isPuzzleComplete={isPuzzleComplete} // Pass isPuzzleComplete to Grid
          onPuzzleLoad={(index: number) => setPuzzleIndex(index)} // Pass callback to Grid
        />
      </div>
    </div>
  );
}
