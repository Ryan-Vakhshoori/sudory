import Stopwatch from "./Stopwatch";
import MoveCounter from "./MoveCounter";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function GameBar({
  isRunning,
  time,
  isPuzzleComplete,
  moveCount,
  difficulty,
  setTime,
  setIsRunning,
  setIsHelpPopupVisible,
  onDifficultyChange,
}: {
  isRunning: boolean;
  time: number;
  isPuzzleComplete: boolean;
  moveCount: number;
  difficulty: string | null;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHelpPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onDifficultyChange: (level: string) => void;
}) {
  return (
    <div className="flex w-screen items-center justify-between p-1 sm:p-4 border-t border-b border-gray-300">
      {/* Left Spacer */}
      <div className="w-6 sm:w-12" />

      {/* Center content, responsive layout */}
      <div className="flex items-center justify-center space-x-5 sm:space-x-10 text-center">
        {/* Difficulty Selector */}
        <div className="relative">
          <select
            className="cursor-pointer appearance-none pr-8 pl-2 py-1 rounded"
            value={difficulty || ""}
            onChange={(e) => onDifficultyChange(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <Stopwatch
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          time={time}
          setTime={setTime}
          isPuzzleComplete={isPuzzleComplete}
        />
        <MoveCounter moveCount={moveCount} />
      </div>

      {/* Help button */}
      <button
        className="mr-2 sm:mr-3 md:mr-4 lg:mr-5 xl:mr-6 2xl:mr-7 cursor-pointer"
        onClick={() => {
          setIsHelpPopupVisible(true);
          setIsRunning(false);
        }}
      >
        <QuestionMarkCircleIcon className="h-6 w-6 text-stone-950 hover:text-stone-500" />
      </button>
    </div>
  );
}