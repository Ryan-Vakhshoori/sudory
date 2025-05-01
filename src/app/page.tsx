"use client";

import Grid from "./components/Grid";
import Stopwatch from "./components/Stopwatch";
import MoveCounter from "./components/MoveCounter";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid"; // Import Heroicons

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0); // Added puzzleIndex state
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row w-screen justify-start p-1 sm:p-2 md:p-3 lg:p-4 space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
        <p className="text-2xl sm:text-4xl md:text-5xl font-bold">Sudory</p>
        {puzzleIndex !== 0 && (
          <p className="text-2xl sm:text-4xl md:text-5xl">#{puzzleIndex}</p>
        )}
      </div>
      <div className={`flex flex-col items-center ${isPopupVisible ? "filter opacity-50" : ""}`}>
        {/* Stopwatch positioned above the grid */}
        <div className="flex w-screen justify-center space-x-4 p-1 sm:p-4 border-t border-b border-gray-300">
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
        <div className="m-2 sm:m-4 md:m-8">
          <Grid
            isRunning={isRunning}
            onResume={() => setIsRunning(true)}
            onMove={() => setMoveCount((prevCount) => prevCount + 1)} // Fixed
            onComplete={() => {
              setIsRunning(false);
              setIsPuzzleComplete(true);
              setIsPopupVisible(true); // Show popup when puzzle is complete
            }}
            isPuzzleComplete={isPuzzleComplete} // Pass isPuzzleComplete to Grid
            onPuzzleLoad={(index: number) => setPuzzleIndex(index)} // Pass callback to Grid
          />
        </div>
      </div>
      {/* Popup for puzzle completion */}
      {isPopupVisible && (
        <div
        className="fixed inset-0 flex items-center justify-center"
        onClick={() => setIsPopupVisible(false)} // Close popup when clicking on the overlay
        >
          <div
            className="relative bg-white p-2 sm:p-4 md:p-8 shadow-sm sm:shadow-md md:shadow-lg text-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
          >
            {/* Close button */}
            <button
              className="absolute top-1 right-1 md:top-2 md:right-2"
              onClick={() => setIsPopupVisible(false)}
            >
              <XMarkIcon className="h-4 w-4 md:h-6 md:w-6" />
            </button>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2 md:mb-4">Congratulations!</h2>
            <p className="text-xs sm:text-sm md:text-base mb-1 sm:mb-2 md:mb-4">
              You completed the puzzle in <span className="font-bold">{time}</span> seconds with <span className="font-bold">{moveCount}</span> moves.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
