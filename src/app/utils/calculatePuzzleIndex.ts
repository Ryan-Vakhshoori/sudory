export function calculatePuzzleIndex(startDate: string) {
  const start = new Date(startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceStart;
}