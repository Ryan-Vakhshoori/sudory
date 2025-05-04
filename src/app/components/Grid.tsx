"use client";

import { useState, useEffect } from "react";
import { useGridLogic } from "../hooks/useGridLogic";
import { loadPuzzleFromCSV } from "../utils/loadPuzzleFromCSV";
import Cell from "./Cell";
import ResumeButton from "./ResumeButton";

export default function Grid({
  isRunning,
  isPuzzleComplete, // Added isPuzzleComplete prop
  onPuzzleLoad, // Added onPuzzleLoad prop
  onResume,
  onMove,
  onComplete,
}: {
  isRunning: boolean;
  isPuzzleComplete: boolean; // Added isPuzzleComplete prop
  onPuzzleLoad: (index: number) => void; // Added onPuzzleLoad prop
  onResume: () => void;
  onMove: () => void;
  onComplete: () => void;
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
  }, [onPuzzleLoad]);

  // Initialize the grid logic
  const {
    hiddenCells,
    revealedCells,
    isShaded,
    isRevealedCell,
    isSameValue,
    handleCellClick,
  } = useGridLogic(sudokuBoard, initialHiddenCells, isReady, isPuzzleComplete, onMove, onComplete);

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
      {!isRunning && !isPuzzleComplete && <ResumeButton onResume={onResume} />}
    </div>
  );
}