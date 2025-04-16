"use client";

import { useGridLogic } from "../hooks/useGridLogic";
import Cell from "./Cell";

export default function Grid() {
  const sudokuBoard = [
    [4, 6, 3, 5, 9, 1, 7, 2, 8],
    [5, 8, 1, 6, 2, 7, 9, 3, 4],
    [7, 2, 9, 3, 8, 4, 6, 1, 5],
    [1, 5, 8, 7, 6, 9, 2, 4, 3],
    [3, 7, 2, 1, 4, 5, 8, 6, 9],
    [9, 4, 6, 2, 3, 8, 5, 7, 1],
    [8, 1, 5, 4, 7, 6, 3, 9, 2],
    [2, 9, 7, 8, 1, 3, 4, 5, 6],
    [6, 3, 4, 9, 5, 2, 1, 8, 7],
  ];

  const initialHiddenCells = new Set([
    "0-1", "0-5", "0-8",
      "1-0", "1-2", "1-4", "1-5", "1-6", "1-8",
      "2-1", "2-3", "2-4", "2-5", "2-6", "2-7",
      "3-3", "3-5", "3-6", "3-7", "3-8",
      "4-0", "4-3", "4-4", "4-5", "4-7",
      "5-0", "5-1", "5-2", "5-8",
      "6-0", "6-4", "6-5", "6-6", "6-7",
      "7-0", "7-1", "7-2", "7-4", "7-8",
      "8-0", "8-2", "8-3", "8-4", "8-6"
    ]);

  const {
    hiddenCells,
    revealedCells,
    isShaded,
    isRevealedCell,
    isSameValue,
    handleCellClick,
  } = useGridLogic(sudokuBoard, initialHiddenCells);

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
                ? "bg-red-200" // Highlight the second mismatched cell in red
                : isRevealedCell(rowIndex, colIndex)
                ? "bg-green-200" // Highlight revealed cells
                : isSameValue(rowIndex, colIndex)
                ? "bg-blue-200" // Highlight cells with the same value
                : isShaded(rowIndex, colIndex)
                ? "bg-gray-200" // Shade other cells
                : ""
            }
          />
        ))
      )}
    </div>
  );
}