"use client";

import { useState, useEffect } from "react";
import { useGridLogic } from "../hooks/useGridLogic";
import Cell from "./Cell";

export default function Grid() {
  const [sudokuBoard, setSudokuBoard] = useState<number[][]>([]);
  const [initialHiddenCells, setInitialHiddenCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load the puzzle and solution from the CSV file
    const loadPuzzle = async () => {
      const response = await fetch("/filteredSudokuPuzzles.csv"); // Correct fetch path
      const csvText = await response.text();
      const rows = csvText.trim().split("\n");
      const [header, ...dataRows] = rows;

      // Parse the first puzzle and solution (you can randomize or select a specific one)
      const [id, puzzle, solution] = dataRows[0].split(","); // Extract fields
      const board: number[][] = [];
      const hiddenCells = new Set<string>();

      // Use the solution to populate the sudokuBoard
      for (let row = 0; row < 9; row++) {
        const rowValues: number[] = [];
        for (let col = 0; col < 9; col++) {
          const solutionChar = solution[row * 9 + col];
          const puzzleChar = puzzle[row * 9 + col];

          rowValues.push(parseInt(solutionChar, 10)); // Use solution for the board

          // Use the puzzle to determine hidden cells
          if (puzzleChar === ".") {
            hiddenCells.add(`${row}-${col}`);
          }
        }
        board.push(rowValues);
      }
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

  if (sudokuBoard.length === 0) {
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