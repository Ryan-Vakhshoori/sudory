export async function loadPuzzleFromCSV(difficulty: string, puzzleIndex: number) {
  const response = await fetch(`${difficulty.toLowerCase()}SudokuPuzzles.csv`);
  const csvText = await response.text();
  const dataRows = csvText.trim().split("\n");

  // Ensure the puzzleIndex is within bounds
  const validPuzzleIndex = puzzleIndex % dataRows.length; // Wrap around if needed
  const [, puzzle, solution] = dataRows[validPuzzleIndex].split(","); // Extract fields

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

  return { board, hiddenCells };
}