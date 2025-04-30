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
  time,
  moves,
  isPuzzleComplete, // Added isPuzzleComplete prop
}: {
  isRunning: boolean;
  onResume: () => void;
  onMove: () => void;
  onComplete: () => void;
  time: number;
  moves: number;
  isPuzzleComplete: boolean; // Added isPuzzleComplete prop
}) {
  const [sudokuBoard, setSudokuBoard] = useState<number[][]>([]);
  const [initialHiddenCells, setInitialHiddenCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load the puzzle and solution from the CSV file
    const loadPuzzle = async () => {
      const { board, hiddenCells } = await loadPuzzleFromCSV("/filteredSudokuPuzzles.csv", "2025-04-20");
      setSudokuBoard(board);
      setInitialHiddenCells(hiddenCells);
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
  } = useGridLogic(sudokuBoard, initialHiddenCells, onMove, onComplete);

  if (sudokuBoard.length === 0 || hiddenCells.size === 0) {
    return <div>Loading...</div>;
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
      {!isRunning && (
        <div className="absolute inset-0 flex justify-center items-center">
          <button
            className="bg-blue-500 text-white h-20 w-20 rounded-full text-lg font-bold flex justify-center items-center"
            onClick={onResume}
          >
            <PlayIcon className="h-10 w-10" />
          </button>
        </div>
      )}
      {/* Completion Popup */}
      {isPuzzleComplete && (
        <div className="absolute inset-0 flex justify-center items-center bg-opacity-100">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
            <p>You finished the puzzle in {time} seconds with {moves} moves.</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => window.location.reload()} // Reload the page to reset
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}