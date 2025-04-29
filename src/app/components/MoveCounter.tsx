export default function MoveCounter({ moveCount }: { moveCount: number }) {
  return (
    <div className="flex items-center space-x-1">
      <p>Moves: {moveCount}</p>
    </div>
  );
}