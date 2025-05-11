"use client";

import { useState, useEffect } from "react";
import { loadPuzzleFromCSV } from "../utils/loadPuzzleFromCSV";
import GridContent from "./GridContent";

export default function Grid({
  isRunning,
  isPuzzleComplete,
  puzzleIndex,
  difficulty,
  onResume,
  onMove,
  onComplete,
}: {
  isRunning: boolean;
  isPuzzleComplete: boolean;
  puzzleIndex: number;
  difficulty: string;
  onResume: () => void;
  onMove: () => void;
  onComplete: () => void;
}) {
  const [sudokuBoard, setSudokuBoard] = useState<number[][]>([]);
  const [initialHiddenCells, setInitialHiddenCells] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedBoardData = localStorage.getItem(`${difficulty}-board-data`);
    if (savedBoardData) {
      const { sudokuBoard, initialHiddenCells } = JSON.parse(savedBoardData);
      setSudokuBoard(sudokuBoard);
      setInitialHiddenCells(new Set(initialHiddenCells));
      setIsLoading(false);
    } else {
      console.log("No saved puzzle found in localStorage.");
      // Load a new puzzle if none is saved
      setSudokuBoard([]);
      setInitialHiddenCells(new Set());
      setIsLoading(true);

      const loadPuzzle = async () => {
        const { board, hiddenCells } = await loadPuzzleFromCSV(difficulty, puzzleIndex);
        setSudokuBoard(board);
        setInitialHiddenCells(hiddenCells);
      };

      loadPuzzle();
    }
  }, [difficulty, puzzleIndex]);

  useEffect(() => {
    if (sudokuBoard.length > 0 && initialHiddenCells.size > 0) {
      const boardData = {
        sudokuBoard,
        initialHiddenCells: Array.from(initialHiddenCells),
      };
      localStorage.setItem(`${difficulty}-board-data`, JSON.stringify(boardData));
    }
  }, [sudokuBoard, initialHiddenCells, difficulty]);

  useEffect(() => {
    if (sudokuBoard.length > 0 && initialHiddenCells.size > 0) {
      setIsLoading(false);
    }
  }, [sudokuBoard, initialHiddenCells]);

  if (isLoading) return <div></div>;

  return (
    <GridContent
      sudokuBoard={sudokuBoard}
      initialHiddenCells={initialHiddenCells}
      isRunning={isRunning}
      isPuzzleComplete={isPuzzleComplete}
      difficulty={difficulty}
      onResume={onResume}
      onMove={onMove}
      onComplete={onComplete}
    />
  );
}

