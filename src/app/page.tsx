"use client";

import { useState, useEffect } from "react";
import Grid from "./components/Grid";
import Popup from "./components/Popup";
import Header from "./components/Header";
import GameBar from "./components/GameBar";
import { formatTime } from "./utils/formatTime";

export default function Home() {
  const [isRunning, setIsRunning] = useState(true);
  const [moveCount, setMoveCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [isCompletionPopupVisible, setIsCompletionPopupVisible] = useState(false);
  const [isHelpPopupVisible, setIsHelpPopupVisible] = useState(false);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load state from localStorage on the client side
  useEffect(() => {
    const savedPuzzleIndex = localStorage.getItem("puzzle-index");
    const startDate = "2025-04-20";
    const index = calculatePuzzleIndex(startDate);
    if (savedPuzzleIndex && Number(JSON.parse(savedPuzzleIndex)) !== index) {
      localStorage.clear();
      localStorage.setItem("puzzle-index", JSON.stringify(index));
      setDifficulty(null);
      setIsRunning(true);
      setMoveCount(0);
      setTime(0);
      setIsPuzzleComplete(false);
      setIsCompletionPopupVisible(false);
      setIsHelpPopupVisible(false);
    } else if (!savedPuzzleIndex) {
      localStorage.setItem("puzzle-index", JSON.stringify(index));
    }
    setPuzzleIndex(index);

    const savedDifficulty = localStorage.getItem("difficulty");
    if (savedDifficulty) {
      setDifficulty(JSON.parse(savedDifficulty));
      const savedState = localStorage.getItem(`${JSON.parse(savedDifficulty)}-game-state`);
      if (savedState) {
        const { isRunning, moveCount, time, isPuzzleComplete } = JSON.parse(savedState);
        setIsRunning(isRunning);
        setMoveCount(moveCount);
        setTime(time);
        setIsPuzzleComplete(isPuzzleComplete);
      }
    }

    setIsLoading(false); // Set loading to false after retrieving data
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (difficulty) {
      localStorage.setItem(
        `${difficulty}-game-state`,
        JSON.stringify({
          isRunning,
          moveCount,
          time,
          isPuzzleComplete,
        }),
      );
    }
  }, [isRunning, moveCount, time, isPuzzleComplete, difficulty]);

  // Function to calculate puzzleIndex
  const calculatePuzzleIndex = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceStart;
  };

  const handleDifficultySelect = (level: string) => {
    if (difficulty !== level) {
      setDifficulty(level);
      localStorage.setItem("difficulty", JSON.stringify(level));
      const savedState = localStorage.getItem(`${level}-game-state`);
      if (savedState) {
        const { isRunning, moveCount, time, isPuzzleComplete } = JSON.parse(savedState);
        setIsRunning(isRunning);
        setMoveCount(moveCount);
        setTime(time);
        setIsPuzzleComplete(isPuzzleComplete);
      } else {
        setIsRunning(true);
        setMoveCount(0);
        setTime(0);
        setIsPuzzleComplete(false);
      }
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col items-center">
      {!difficulty ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex flex-row space-x-4 mb-4">
            <p className="text-[49px] font-bold">Sudory</p>
            {puzzleIndex !== 0 && <p className="text-[49px]">#{puzzleIndex}</p>}
          </div>
          <p className="mb-5">Choose Your Puzzle:</p>
          <div className="flex flex-col space-y-2">
            <button
              className="bg-stone-950 text-white font-bold py-2.5 w-38 rounded-full cursor-pointer hover:bg-stone-500"
              onClick={() => handleDifficultySelect("Easy")}
            >
              Easy
            </button>
            <button
              className="bg-stone-950 text-white font-bold py-2.5 w-37 rounded-full cursor-pointer hover:bg-stone-500"
              onClick={() => handleDifficultySelect("Medium")}
            >
              Medium
            </button>
            <button
              className="bg-stone-950 text-white font-bold py-2.5 w-37 rounded-full cursor-pointer hover:bg-stone-500"
              onClick={() => handleDifficultySelect("Hard")}
            >
              Hard
            </button>
          </div>
        </div>
      ) : (
        <>
          <Header puzzleIndex={puzzleIndex} />
          <div
            className={`flex flex-col items-center ${
              isCompletionPopupVisible || isHelpPopupVisible ? "filter opacity-50" : ""
            }`}
          >
            <GameBar
              isRunning={isRunning}
              time={time}
              isPuzzleComplete={isPuzzleComplete}
              moveCount={moveCount}
              difficulty={difficulty}
              setTime={setTime}
              setIsRunning={setIsRunning}
              setIsHelpPopupVisible={setIsHelpPopupVisible}
              onDifficultyChange={(newDifficulty) => {
                handleDifficultySelect(newDifficulty);
              }}
            />
            <div className="m-2 sm:m-3 md:m-4 lg:m-5 xl:m-6 2xl:m-7">
              <Grid
                key={difficulty}
                isRunning={isRunning}
                isPuzzleComplete={isPuzzleComplete}
                puzzleIndex={puzzleIndex}
                difficulty={difficulty}
                onResume={() => setIsRunning(true)}
                onMove={() => setMoveCount((prevCount) => prevCount + 1)}
                onComplete={() => {
                  setIsRunning(false);
                  setIsPuzzleComplete(true);
                  setIsCompletionPopupVisible(true);
                }}
              />
            </div>
          </div>
          {isCompletionPopupVisible && (
            <Popup onClose={() => setIsCompletionPopupVisible(false)}>
              <p className="text-center text-2xl sm:text-4xl font-bold mb-1 sm:mb-4">Congratulations!</p>
              <p className="text-base sm:text-xl mb-1 sm:mb-4">
                You finished {difficulty?.toLowerCase() === "easy" ? "an" : "a"} <span className="font-bold">{difficulty?.toLowerCase()}</span> puzzle in{" "}
                <span className="font-bold">{formatTime(time)}</span> with <span className="font-bold">{moveCount}</span> moves.
              </p>
            </Popup>
          )}
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
