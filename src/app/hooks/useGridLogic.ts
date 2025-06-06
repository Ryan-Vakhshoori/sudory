import { useState, useEffect } from "react";

export function useGridLogic(
  sudokuBoard: number[][],
  initialHiddenCells: Set<string>,
  isPuzzleComplete: boolean,
  difficulty: string,
  onMove: () => void,
  onComplete: () => void,
) {
  const [hiddenCells, setHiddenCells] = useState(initialHiddenCells);
  const [revealedCells, setRevealedCells] = useState<
    { rowIndex: number; colIndex: number }[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedBoardState = localStorage.getItem(`${difficulty}-board-state`);
    if (savedBoardState) {
      const { hiddenCells, revealedCells } = JSON.parse(savedBoardState);
      if (revealedCells.length === 2) {
        const [firstCell, secondCell] = revealedCells;
        const firstValue = sudokuBoard[firstCell.rowIndex][firstCell.colIndex];
        const secondValue = sudokuBoard[secondCell.rowIndex][secondCell.colIndex];
        if (firstValue !== secondValue) {
          setHiddenCells((prev) => {
            const newHiddenCells = new Set(prev);
            newHiddenCells.add(`${firstCell.rowIndex}-${firstCell.colIndex}`);
            newHiddenCells.add(`${secondCell.rowIndex}-${secondCell.colIndex}`);
            return newHiddenCells;
          });
        } else {
          setHiddenCells(new Set(hiddenCells));
        }
        setRevealedCells([]);
      } else {
        setHiddenCells(new Set(hiddenCells));
        setRevealedCells(revealedCells);
      }
    } else {
      setHiddenCells(initialHiddenCells);
      setRevealedCells([]);
    }
    setIsLoading(false);
  }, [difficulty, initialHiddenCells, sudokuBoard]);

  useEffect(() => {
    if (isLoading) return;
    const boardState = {
      hiddenCells: Array.from(hiddenCells),
      revealedCells,
    };
    localStorage.setItem(`${difficulty}-board-state`, JSON.stringify(boardState));
  }, [hiddenCells, revealedCells, isLoading, difficulty]);

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
      (cell: { rowIndex: number; colIndex: number; }) => cell.rowIndex === rowIndex && cell.colIndex === colIndex
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
      onMove();
      setRevealedCells([{ rowIndex, colIndex }]);
      revealCell();
    }
  };

  useEffect(() => {
    if (hiddenCells.size === 0 && !isPuzzleComplete) {
      onComplete();
    }
  }, [hiddenCells, initialHiddenCells, onComplete, isPuzzleComplete]);

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