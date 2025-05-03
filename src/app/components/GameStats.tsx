import Stopwatch from "./Stopwatch";
import MoveCounter from "./MoveCounter";

export default function GameStats({
  isRunning,
  time,
  isPuzzleComplete,
  moveCount,
  setTime,
  onToggle,
}: {
  isRunning: boolean;
  time: number;
  isPuzzleComplete: boolean;
  moveCount: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  onToggle: () => void;
}) {
  return (
    <div className="flex w-screen justify-center space-x-4 p-1 sm:p-4 border-t border-b border-gray-300">
      <Stopwatch
        isRunning={isRunning}
        onToggle={onToggle}
        time={time}
        setTime={setTime}
        isPuzzleComplete={isPuzzleComplete}
      />
      <MoveCounter moveCount={moveCount} />
    </div>
  );
}