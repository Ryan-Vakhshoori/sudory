import Popup from "./Popup";

export default function HelpPopup({ onClose }: { onClose: () => void }) {
  return (
    <Popup onClose={onClose}>
      <p className="text-2xl sm:text-4xl font-bold">How to play Sudory</p>
      <p className="text-lg sm:text-2xl mb-1 sm:mb-4">
        Reveal all hidden tiles and complete the Sudoku board.
      </p>
      <ul className="list-disc list-inside text-base sm:text-xl mb-1 sm:mb-4">
        <li>Some numbers are already revealed — these numbers cannot be changed.</li>
        <li>Tap two hidden tiles to reveal their numbers.</li>
        <li>If the numbers match, they stay revealed.</li>
        <li>If they don&apos;t match, the tiles are hidden again after a short delay.</li>
        <li>Follow classic Sudoku rules: 1-9 in every row, column, and 3x3 grid.</li>
      </ul>
    </Popup>
  );
}