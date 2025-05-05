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
}: {
  isRunning: boolean;
  time: number;
  isPuzzleComplete: boolean;
  moveCount: number;
  difficulty: string | null;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHelpPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex w-screen items-center justify-between p-1 sm:p-4 border-t border-b border-gray-300">
      {/* Left Spacer */}
      <div className="flex-1"></div>
      {/* Centered Stopwatch and MoveCounter */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-5">
        <p>{difficulty}</p>
        <Stopwatch
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          time={time}
          setTime={setTime}
          isPuzzleComplete={isPuzzleComplete}
        />
        <MoveCounter moveCount={moveCount} />
      </div>
      {/* Question Mark Icon on the Right */}
      <button
        className="flex justify-end mr-2 sm:mr-3 md:mr-4 lg:mr-5 xl:mr-6 2xl:mr-7 cursor-pointer"
        onClick={() => {
          setIsHelpPopupVisible(true);
          setIsRunning(false); // Pause the game when help is shown
        }}
      >
        <QuestionMarkCircleIcon className="h-6 w-6 text-stone-950 hover:text-stone-500" />
      </button>
    </div>
  );
}