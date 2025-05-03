"use client";

import Grid from "./components/Grid";
import PuzzleCompletionPopup from "./components/PuzzleCompletionPopup"; // Import PuzzleCompletionPopup
import Header from "./components/Header"; // Import Header
import GameStats from "./components/GameStats"; // Import GameStats
import { useState } from "react";

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0); // Added puzzleIndex state
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <Header puzzleIndex={puzzleIndex} />
      <div className={`flex flex-col items-center ${isPopupVisible ? "filter opacity-50" : ""}`}>
        {/* GameStats component */}
        <GameStats
          isRunning={isRunning}
          time={time}
          setTime={setTime}
          isPuzzleComplete={isPuzzleComplete}
          moveCount={moveCount}
          onToggle={() => setIsRunning((prevRunning) => !prevRunning)}
        />
        {/* Grid centered horizontally and vertically */}
        <div className="m-2 sm:m-3 md:m-4 lg:m-5 xl:m-6 2xl:m-7">
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
        <PuzzleCompletionPopup
          time={time}
          moveCount={moveCount}
          onClose={() => setIsPopupVisible(false)}
        />
      )}
    </div>
  );
}
