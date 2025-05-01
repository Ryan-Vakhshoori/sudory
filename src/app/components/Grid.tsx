"use client";

import { useState, useEffect } from "react";
import { useGridLogic } from "../hooks/useGridLogic";
import { loadPuzzleFromCSV } from "../utils/loadPuzzleFromCSV";
import Cell from "./Cell";
import { PlayIcon } from "@heroicons/react/24/solid"; // Import Heroicons

export default function Grid({
  isRunning,
  onResume,
  onMove,
  onComplete,
  isPuzzleComplete, // Added isPuzzleComplete prop
  onPuzzleLoad, // Added onPuzzleLoad prop
}: {
  isRunning: boolean;
  onResume: () => void;
  onMove: () => void;
  onComplete: () => void;
  isPuzzleComplete: boolean; // Added isPuzzleComplete prop
  onPuzzleLoad: (index: number) => void; // Added onPuzzleLoad prop
}) {
  const [sudokuBoard, setSudokuBoard] = useState<number[][]>([]);
  const [initialHiddenCells, setInitialHiddenCells] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load the puzzle and solution from the CSV file
    const loadPuzzle = async () => {
      const { board, hiddenCells, puzzleIndex } = await loadPuzzleFromCSV("/filteredSudokuPuzzles.csv", "2025-04-20");
      setSudokuBoard(board);
      setInitialHiddenCells(hiddenCells);
      onPuzzleLoad(puzzleIndex); // Call the callback with the puzzle index
    };

    loadPuzzle();
  }, []);

  // Initialize the grid logic
  const {
    hiddenCells,
    revealedCells,
    isShaded,
    isRevealedCell,
    isSameValue,
    handleCellClick,
  } = useGridLogic(sudokuBoard, initialHiddenCells, onMove, onComplete, isReady, isPuzzleComplete);

  useEffect(() => {
    if (
      sudokuBoard.length > 0 &&
      hiddenCells.size === initialHiddenCells.size &&
      initialHiddenCells.size > 0
    ) {
      setIsReady(true);
    }
  }, [sudokuBoard, hiddenCells, initialHiddenCells]);

  if (!isReady) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="relative">
      {/* Grid */}
      <div className="grid grid-cols-9 border-4">
        {isRunning || isPuzzleComplete
          ? sudokuBoard.map((row, rowIndex) =>
              row.map((value, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={value}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  hidden={hiddenCells.has(`${rowIndex}-${colIndex}`)}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={
                    revealedCells.length === 2 &&
                    revealedCells[1].rowIndex === rowIndex &&
                    revealedCells[1].colIndex === colIndex &&
                    sudokuBoard[revealedCells[0].rowIndex][revealedCells[0].colIndex] !==
                      sudokuBoard[revealedCells[1].rowIndex][revealedCells[1].colIndex]
                      ? "bg-red-200"
                      : isRevealedCell(rowIndex, colIndex)
                      ? "bg-green-200"
                      : isSameValue(rowIndex, colIndex)
                      ? "bg-blue-200"
                      : isShaded(rowIndex, colIndex)
                      ? "bg-gray-200"
                      : ""
                  }
                />
              ))
            )
          : Array.from({ length: 9 }).map((_, rowIndex) =>
              Array.from({ length: 9 }).map((_, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={0} // Empty value
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  hidden={true} // All cells hidden
                  onClick={() => {}} // No-op function for empty grid
                />
              ))
            )}
      </div>

      {/* Overlay Resume Button */}
      {!isRunning && !isPuzzleComplete && (
        <div className="absolute inset-0 flex justify-center items-center">
          <button
            className="bg-blue-500 text-white h-11 w-11 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-full flex justify-center items-center"
            onClick={onResume}
          >
            <PlayIcon className="h-5.5 w-5.5 sm:h-8 sm:w-8 md:h-10 md:w-10" />
          </button>
        </div>
      )}
    </div>
  );
}