"use client";

import { useState } from "react";

function Cell({
  value,
  rowIndex,
  colIndex,
  hidden,
  onClick,
  className,
}: {
  value: number;
  rowIndex: number;
  colIndex: number;
  hidden: boolean;
  onClick: () => void;
  className?: string;
}) {
  // Determine if the cell is on a subgrid boundary
  const isBottomSubgridBorder = rowIndex === 2 || rowIndex == 5;
  const isRightSubgridBorder = colIndex === 2 || colIndex == 5;
  const isBottomGridBorder = rowIndex === 8; // Last row
  const isRightGridBorder = colIndex === 8; // Last column

  const borderClasses = `
    ${isBottomGridBorder ? "" : isBottomSubgridBorder ? "border-b-4" : "border-b"}
    ${isRightGridBorder ? "" : isRightSubgridBorder ? "border-r-4" : "border-r"}
  `;

  return (
    <div
      className={`flex justify-center items-center h-18 w-18 ${borderClasses} border-gray-400 ${className}`}
      onClick={onClick}
    >
      {hidden ? "" : value}
    </div>
  );
}

function Grid() {
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

  const [hiddenCells, setHiddenCells] = useState(
    new Set([
      "0-1", "0-5", "0-8",
      "1-0", "1-2", "1-4", "1-5", "1-6", "1-8",
      "2-1", "2-3", "2-4", "2-5", "2-6", "2-7",
      "3-3", "3-5", "3-6", "3-7", "3-8",
      "4-0", "4-3", "4-4", "4-5", "4-7",
      "5-0", "5-1", "5-2", "5-8",
      "6-0", "6-4", "6-5", "6-6", "6-7",
      "7-0", "7-1", "7-2", "7-4", "7-8",
      "8-0", "8-2", "8-3", "8-4", "8-6"
    ])
  );

  const [revealedCells, setRevealedCells] = useState<
    { rowIndex: number; colIndex: number }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const isShaded = (rowIndex: number, colIndex: number) => {
    if (revealedCells.length !== 1) return false; // Disable shading if no cell or two cells are revealed

    const { rowIndex: revealedRow, colIndex: revealedCol } = revealedCells[0];

    // Check if the cell is in the same row, column, or subgrid
    const sameRow = rowIndex === revealedRow;
    const sameCol = colIndex === revealedCol;
    const sameSubgrid =
      Math.floor(rowIndex / 3) === Math.floor(revealedRow / 3) &&
      Math.floor(colIndex / 3) === Math.floor(revealedCol / 3);

    // Do not shade cells that are already revealed
    const cellKey = `${rowIndex}-${colIndex}`;
    const isHidden = hiddenCells.has(cellKey);

    return isHidden && (sameRow || sameCol || sameSubgrid);
  };

  const isRevealedCell = (rowIndex: number, colIndex: number) => {
    // Check if the cell matches any of the revealed cells
    return revealedCells.some(
      (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
  };

  const isSameValue = (rowIndex: number, colIndex: number) => {
    if (revealedCells.length !== 1) return false; // Highlight only when one cell is revealed

    const { rowIndex: revealedRow, colIndex: revealedCol } = revealedCells[0];
    const revealedValue = sudokuBoard[revealedRow][revealedCol];
    const cellKey = `${rowIndex}-${colIndex}`;

    // Only highlight cells with the same value if they are not hidden and not part of a matched pair
    return (
      !hiddenCells.has(cellKey) &&
      sudokuBoard[rowIndex][colIndex] === revealedValue &&
      !isRevealedCell(rowIndex, colIndex)
    );
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isProcessing) return; // Prevent multiple clicks during processing

    const cellKey = `${rowIndex}-${colIndex}`;

    if (!hiddenCells.has(cellKey)) return;

    const revealCell = () => {
      setHiddenCells((prev) => {
        const newHiddenCells = new Set(prev);
        newHiddenCells.delete(cellKey);
        return newHiddenCells;
      });
    };

    if (revealedCells.length === 1) {
      const [firstCell] = revealedCells;
      const firstValue = sudokuBoard[firstCell.rowIndex][firstCell.colIndex];
      const secondValue = sudokuBoard[rowIndex][colIndex];

      // Add the second revealed cell
      setRevealedCells((prev) => [...prev, { rowIndex, colIndex }]);
      setIsProcessing(true);

      if (firstValue === secondValue) {
        // Match: Keep both cells revealed and remove shading
        revealCell();
        setTimeout(() => {
          setRevealedCells([]);
          setIsProcessing(false);
        }, 1000);
      } else {
        // No match: Hide both cells after a delay
        revealCell();
        setTimeout(() => {
          setHiddenCells((prev) => {
            const newHiddenCells = new Set(prev);
            newHiddenCells.add(cellKey);
            newHiddenCells.add(`${firstCell.rowIndex}-${firstCell.colIndex}`);
            return newHiddenCells;
          });
          setRevealedCells([]);
          setIsProcessing(false);
        }, 1000);
      }
    } else {
      // First cell revealed
      setRevealedCells([{ rowIndex, colIndex }]);
      revealCell();
    }
  };

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
              isRevealedCell(rowIndex, colIndex)
                ? "bg-blue-200" // Highlight revealed cells
                : isSameValue(rowIndex, colIndex)
                ? "bg-green-200" // Highlight cells with the same value
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

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Grid />
    </div>
  );
}
