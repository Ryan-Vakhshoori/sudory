export function calculatePercentiles(
  stats: { times: number[]; moveCounts: number[] },
  time: number,
  moveCount: number
) {
  const faster = stats.times.filter((t) => t > time && t !== time).length;
  const moreEfficient = stats.moveCounts.filter((m) => m > moveCount && m !== moveCount).length;
  const total = stats.times.filter((t) => t !== time).length;
  const timePercent = total > 0 ? Math.round((faster / total) * 100) : 0;
  const movesTotal = stats.moveCounts.filter((m) => m !== moveCount).length;
  const movesPercent = movesTotal > 0 ? Math.round((moreEfficient / movesTotal) * 100) : 0;
  return { timePercent, movesPercent };
}