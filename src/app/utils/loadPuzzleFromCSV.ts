export async function loadPuzzleFromCSV(filePath: string, startDate: string) {
  const response = await fetch(filePath);
  const csvText = await response.text();
  const rows = csvText.trim().split("\n");
  const dataRows = rows.slice(1);

  // Calculate the number of days since the start date
  const start = new Date(startDate);
  const today = new Date();
  const daysSinceStart = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  // Use the daysSinceStart to select a puzzle
  const puzzleIndex = daysSinceStart % dataRows.length; // Wrap around if needed
  const [, puzzle, solution] = dataRows[puzzleIndex].split(","); // Extract fields

  const board: number[][] = [];
  const hiddenCells = new Set<string>();

  // Use the solution to populate the sudokuBoard
  for (let row = 0; row < 9; row++) {
    const rowValues: number[] = [];
    for (let col = 0; col < 9; col++) {
      const solutionChar = solution[row * 9 + col];
      const puzzleChar = puzzle[row * 9 + col];

      rowValues.push(parseInt(solutionChar, 10)); // Use solution for the board

      // Use the puzzle to determine hidden cells
      if (puzzleChar === ".") {
        hiddenCells.add(`${row}-${col}`);
      }
    }
    board.push(rowValues);
  }

  return { board, hiddenCells, puzzleIndex };
}