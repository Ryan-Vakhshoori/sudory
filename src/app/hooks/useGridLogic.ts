import { useState, useEffect } from "react";

export function useGridLogic(
  sudokuBoard: number[][],
  initialHiddenCells: Set<string>
) {
  const [hiddenCells, setHiddenCells] = useState(initialHiddenCells);

  // Update hiddenCells whenever initialHiddenCells changes
  useEffect(() => {
    setHiddenCells(initialHiddenCells);
  }, [initialHiddenCells]);

  const [revealedCells, setRevealedCells] = useState<
    { rowIndex: number; colIndex: number }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const isShaded = (rowIndex: number, colIndex: number) => {
    if (revealedCells.length !== 1) return false;

    const { rowIndex: revealedRow, colIndex: revealedCol } = revealedCells[0];
    const sameRow = rowIndex === revealedRow;
    const sameCol = colIndex === revealedCol;
    const sameSubgrid =
      Math.floor(rowIndex / 3) === Math.floor(revealedRow / 3) &&
      Math.floor(colIndex / 3) === Math.floor(revealedCol / 3);

    const cellKey = `${rowIndex}-${colIndex}`;
    const isHidden = hiddenCells.has(cellKey);

    return isHidden && (sameRow || sameCol || sameSubgrid);
  };

  const isRevealedCell = (rowIndex: number, colIndex: number) => {
    return revealedCells.some(
      (cell) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
    );
  };

  const isSameValue = (rowIndex: number, colIndex: number) => {
    if (revealedCells.length !== 1) return false;

    const { rowIndex: revealedRow, colIndex: revealedCol } = revealedCells[0];
    const revealedValue = sudokuBoard[revealedRow][revealedCol];
    const cellKey = `${rowIndex}-${colIndex}`;

    return (
      !hiddenCells.has(cellKey) &&
      sudokuBoard[rowIndex][colIndex] === revealedValue &&
      !isRevealedCell(rowIndex, colIndex)
    );
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (isProcessing) return;

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

      setRevealedCells((prev) => [...prev, { rowIndex, colIndex }]);
      setIsProcessing(true);

      if (firstValue === secondValue) {
        revealCell();
        setTimeout(() => {
          setRevealedCells([]);
          setIsProcessing(false);
        }, 1000);
      } else {
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
      setRevealedCells([{ rowIndex, colIndex }]);
      revealCell();
    }
  };

  return {
    hiddenCells,
    revealedCells,
    isProcessing,
    isShaded,
    isRevealedCell,
    isSameValue,
    handleCellClick,
  };
}