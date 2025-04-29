"use client";

import { useState, useEffect } from "react";
import { useGridLogic } from "../hooks/useGridLogic";
import { loadPuzzleFromCSV } from "../utils/loadPuzzleFromCSV";
import Cell from "./Cell";
import { PlayIcon } from "@heroicons/react/24/solid"; // Import Heroicons

export default function Grid({ isRunning, onResume }: { isRunning: boolean; onResume: () => void }) {
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

  const {
    hiddenCells,
    revealedCells,
    isShaded,
    isRevealedCell,
    isSameValue,
    handleCellClick,
  } = useGridLogic(sudokuBoard, initialHiddenCells);

  if (sudokuBoard.length === 0 || hiddenCells.size === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      {/* Grid */}
      <div className="grid grid-cols-9 border-4">
        {isRunning
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
    </div>
  );
}