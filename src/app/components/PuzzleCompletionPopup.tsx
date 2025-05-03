import { XMarkIcon } from "@heroicons/react/24/solid";

export default function PuzzleCompletionPopup({
  time,
  moveCount,
  onClose,
}: {
  time: number;
  moveCount: number;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      onClick={onClose} // Close popup when clicking on the overlay
    >
      <div
        className="relative bg-white p-2 sm:p-8 shadow-sm sm:shadow-md text-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <XMarkIcon className="size-6" />
        </button>
        <h2 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-4">Congratulations!</h2>
        <p className="text-base sm:text-xl mb-1 sm:mb-4">
          You completed the puzzle in <span className="font-bold">{time}</span> seconds with <span className="font-bold">{moveCount}</span> moves.
        </p>
      </div>
    </div>
  );
}