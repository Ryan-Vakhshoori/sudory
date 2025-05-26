import Popup from "./Popup";
import Histogram from "./Histogram";
import { formatTime } from "../utils/formatTime";
import React from "react";

interface CompletionPopupProps {
  onClose: () => void;
  difficulty: string;
  time: number;
  moveCount: number;
  stats: { times: number[]; moveCounts: number[] } | null;
  histogramType: "time" | "moves";
  setHistogramType: (type: "time" | "moves") => void;
  countdown: string;
  handleDifficultySelect: (level: string) => void;
}

export default function CompletionPopup({
  onClose,
  difficulty,
  time,
  moveCount,
  stats,
  histogramType,
  setHistogramType,
  countdown,
  handleDifficultySelect,
}: CompletionPopupProps) {
  if (!stats || stats.times.length === 0) return null;

  // Calculate percentiles
  const faster = stats.times.filter((t) => t > time && t !== time).length;
  const moreEfficient = stats.moveCounts.filter((m) => m > moveCount && m !== moveCount).length;
  const total = stats.times.filter((t) => t !== time).length;
  const timePercent = total > 0 ? Math.round((faster / total) * 100) : 0;
  const movesTotal = stats.moveCounts.filter((m) => m !== moveCount).length;
  const movesPercent = movesTotal > 0 ? Math.round((moreEfficient / movesTotal) * 100) : 0;

  // Find incomplete puzzles
  const incompletes = ["easy", "medium", "hard"].filter((level) => {
    if (level === difficulty) return false;
    const completed = localStorage.getItem(`${level}-game-state`);
    if (!completed) return true;
    try {
      const { isPuzzleComplete } = JSON.parse(completed);
      return !isPuzzleComplete;
    } catch {
      return true;
    }
  });

  return (
    <Popup onClose={onClose}>
      <p className="text-center text-2xl sm:text-4xl font-bold mb-1 sm:mb-4">Congratulations!</p>
      <p className="text-center text-base sm:text-xl mb-4">
        You finished {difficulty === "easy" ? "an" : "a"} <span className="font-bold">{difficulty}</span> puzzle in{" "}
        <span className="font-bold">{formatTime(time)}</span> with <span className="font-bold">{moveCount}</span> moves.
      </p>
      <div className="text-base sm:text-xl mb-4 text-center">
        {/* Small screens: text and bars */}
        <div className="sm:hidden mb-4">
          <div className="mb-2">
            <p>
              <span className="font-bold">{formatTime(time)}</span> beats <span className="font-bold">{timePercent}%</span> of players
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1 mb-3">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>
          <div>
            <p>
              {moveCount} moves beats <span className="font-bold">{movesPercent}%</span> of players
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${movesPercent}%` }}
              />
            </div>
          </div>
        </div>
        {/* sm+ screens: buttons and histogram */}
        <div className="gap-2 mb-2 hidden sm:flex w-full">
          <button
            className={`flex-1 cursor-pointer hover:text-black text-left rounded-md px-4 py-2 ${histogramType === "time" ? "bg-gray-100 text-black" : "bg-white text-gray-300"}`}
            onClick={() => setHistogramType("time")}
          >
            Time
            <br />
            <span className="font-bold">{formatTime(time)}</span> | Beats <span className="font-bold">{timePercent}%</span>
          </button>
          <button
            className={`flex-1 cursor-pointer hover:text-black text-left rounded-md px-4 py-2 ${histogramType === "moves" ? "bg-gray-100 text-black" : "bg-white text-gray-300"}`}
            onClick={() => setHistogramType("moves")}
          >
            Moves
            <br />
            <span className="font-bold">{moveCount}</span> | Beats <span className="font-bold">{movesPercent}%</span>
          </button>
        </div>
        <div className="hidden sm:block w-full">
          {histogramType === "time" ? (
            <Histogram data={stats.times} label="Completion Time" type="time" highlightValue={time} />
          ) : (
            <Histogram data={stats.moveCounts} label="Move Count" type="moves" highlightValue={moveCount} />
          )}
        </div>
      </div>
      <div>
        {incompletes.length === 0 ? (
          <p className="text-center text-base sm:text-xl">
            New puzzles in <span className="font-bold">{countdown}</span>.
          </p>
        ) : (
          <>
            <p className="text-center text-base sm:text-xl mb-1 sm:mb-4">Play another puzzle:</p>
            <div className="flex justify-center gap-3">
              {incompletes.map((level) => (
                <button
                  key={level}
                  className="bg-black text-white font-bold py-2.5 px-5 rounded-full cursor-pointer hover:bg-gray-500"
                  onClick={() => {
                    onClose();
                    handleDifficultySelect(level);
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </Popup>
  );
}