import { useGridLogic } from "../hooks/useGridLogic";
import Cell from "./Cell";
import ResumeButton from "./ResumeButton";

export default function GridContent({
  sudokuBoard,
  initialHiddenCells,
  isRunning,
  isPuzzleComplete,
  difficulty,
  onResume,
  onMove,
  onComplete,
}: {
  sudokuBoard: number[][];
  initialHiddenCells: Set<string>;
  isRunning: boolean;
  isPuzzleComplete: boolean;
  difficulty: string;
  onResume: () => void;
  onMove: () => void;
  onComplete: () => void;
}) {
  const {
    hiddenCells,
    revealedCells,
    isShaded,
    isRevealedCell,
    isSameValue,
    handleCellClick,
  } = useGridLogic(sudokuBoard, initialHiddenCells, isPuzzleComplete, difficulty, onMove, onComplete);

  return (
    <div className="relative">
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
                  value={0}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  hidden={true}
                  onClick={() => {}}
                />
              ))
            )}
      </div>

      {!isRunning && !isPuzzleComplete && <ResumeButton onResume={onResume} />}
    </div>
  );
}
