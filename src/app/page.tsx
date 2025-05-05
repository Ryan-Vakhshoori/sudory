"use client";

import Grid from "./components/Grid";
import Popup from "./components/Popup"; // Import Popup
import Header from "./components/Header"; // Import Header
import GameBar from "./components/GameBar"; // Import GameBar
import { useState, useEffect } from "react";

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0); // Added puzzleIndex state
  const [isCompletionPopupVisible, setIsCompletionPopupVisible] = useState(false);
  const [isHelpPopupVisible, setIsHelpPopupVisible] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null); // State for difficulty selection

  // Function to handle difficulty selection
  const handleDifficultySelect = (level: string) => {
    setDifficulty(level); // Set the selected difficulty
  };

  // Function to calculate puzzleIndex
  const calculatePuzzleIndex = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart;
  };

  useEffect(() => {
    const startDate = "2025-04-20"; // Example start date
    const index = calculatePuzzleIndex(startDate);
    setPuzzleIndex(index);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {!difficulty ? (
        // Difficulty Selection Screen
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <div className="flex flex-row space-x-4">
            <p className="text-[49px] font-bold">Sudory</p>
            {puzzleIndex !== 0 && (
              <p className="text-[49px]">#{puzzleIndex}</p>
            )}
          </div>
          <p>Choose Your Puzzle:</p>
          <button
            className="bg-black text-white px-6 py-3 rounded hover:bg-green-600"
            onClick={() => handleDifficultySelect("easy")}
          >
            Easy
          </button>
          <button
            className="bg-black text-white px-6 py-3 rounded hover:bg-yellow-600"
            onClick={() => handleDifficultySelect("medium")}
          >
            Medium
          </button>
          <button
            className="bg-black text-white px-6 py-3 rounded hover:bg-red-600"
            onClick={() => handleDifficultySelect("hard")}
          >
            Hard
          </button>
        </div>
      ) : (
        // Puzzle Screen
        <>
          <Header puzzleIndex={puzzleIndex} />
          <div
            className={`flex flex-col items-center ${
              isCompletionPopupVisible || isHelpPopupVisible ? "filter opacity-50" : ""
            }`}
          >
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
                isPuzzleComplete={isPuzzleComplete} // Pass isPuzzleComplete to Grid
                puzzleIndex={puzzleIndex} // Pass puzzleIndex to Grid
                onResume={() => setIsRunning(true)}
                onMove={() => setMoveCount((prevCount) => prevCount + 1)} // Fixed
                onComplete={() => {
                  setIsRunning(false);
                  setIsPuzzleComplete(true);
                  setIsCompletionPopupVisible(true); // Show popup when puzzle is complete
                }}
              />
            </div>
          </div>
          {/* Popup for puzzle completion */}
          {isCompletionPopupVisible && (
            <Popup onClose={() => setIsCompletionPopupVisible(false)}>
              <p className="text-center text-2xl sm:text-4xl font-bold mb-1 sm:mb-4">Congratulations!</p>
              <p className="text-base sm:text-xl mb-1 sm:mb-4">
                You completed the puzzle in <span className="font-bold">{time}</span> seconds with{" "}
                <span className="font-bold">{moveCount}</span> moves.
              </p>
            </Popup>
          )}
          {/* Help popup */}
          {isHelpPopupVisible && (
            <Popup onClose={() => setIsHelpPopupVisible(false)}>
              <p className="text-2xl sm:text-4xl font-bold">How to play Sudory</p>
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
        </>
      )}
    </div>
  );
}
