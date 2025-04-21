"use client";

import { useState, useEffect } from "react";
import { useGridLogic } from "../hooks/useGridLogic";
import { loadPuzzleFromCSV } from "../utils/loadPuzzleFromCSV";
import Cell from "./Cell";

export default function Grid() {
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
    <div className="grid grid-cols-9 border-4">
      {sudokuBoard.map((row, rowIndex) =>
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
      )}
    </div>
  );
}