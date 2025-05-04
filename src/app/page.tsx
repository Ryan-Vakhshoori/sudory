"use client";

import Grid from "./components/Grid";
import Popup from "./components/Popup"; // Import Popup
import Header from "./components/Header"; // Import Header
import GameBar from "./components/GameBar"; // Import GameBar
import { useState } from "react";

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0); // Added puzzleIndex state
  const [isCompletionPopupVisible, setIsCompletionPopupVisible] = useState(false);
  const [isHelpPopupVisible, setIsHelpPopupVisible] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <Header puzzleIndex={puzzleIndex} />
      <div className={`flex flex-col items-center ${(isCompletionPopupVisible || isHelpPopupVisible) ? "filter opacity-50" : ""}`}>
        {/* GameBar component */}
        <GameBar
          isRunning={isRunning}
          time={time}
          setTime={setTime}
          isPuzzleComplete={isPuzzleComplete}
          moveCount={moveCount}
          setIsRunning={setIsRunning}
          setIsHelpPopupVisible={setIsHelpPopupVisible} // Pass setIsHelpPopupVisible to GameBar
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
              setIsCompletionPopupVisible(true); // Show popup when puzzle is complete
            }}
            isPuzzleComplete={isPuzzleComplete} // Pass isPuzzleComplete to Grid
            onPuzzleLoad={(index: number) => setPuzzleIndex(index)} // Pass callback to Grid
          />
        </div>
      </div>
      {/* Popup for puzzle completion */}
      {isCompletionPopupVisible && (
        <Popup
          onClose={() => setIsCompletionPopupVisible(false)}
        >
          <p className="text-center text-2xl sm:text-4xl font-bold mb-1 sm:mb-4">Congratulations!</p>
          <p className="text-base sm:text-xl mb-1 sm:mb-4">
            You completed the puzzle in <span className="font-bold">{time}</span> seconds with <span className="font-bold">{moveCount}</span> moves.
          </p>
        </Popup>
      )}
      {/* Help popup */}
      {isHelpPopupVisible && (
        <Popup
          onClose={() => setIsHelpPopupVisible(false)}
        >
          <p className="text-2xl sm:text-4xl font-bold ">How to play Sudory</p>
          <p className="text-lg sm:text-2xl mb-1 sm:mb-4">Reveal all hidden tiles and complete the Sudoku board.</p>
          <ul className="list-disc list-inside text-base sm:text-xl mb-1 sm:mb-4">
            <li>Some numbers are already revealed — these numbers cannot be changed.</li>
            <li>Tap two hidden tiles to reveal their numbers.</li>
            <li>If the numbers match, they stay revealed.</li>
            <li>If they don&apos;t match, the tiles are hidden again after a short delay.</li>
            <li>Follow classic Sudoku rules: 1-9 in every row, column, and 3x3 grid.</li>
          </ul>
        </Popup>
      )}
    </div>
  );
}
