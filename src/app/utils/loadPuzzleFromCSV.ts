export async function loadPuzzleFromCSV(filePath: string) {
  const response = await fetch(filePath);
  const csvText = await response.text();
  const rows = csvText.trim().split("\n");
  const [header, ...dataRows] = rows;

  // Parse the first puzzle and solution (you can randomize or select a specific one)
  const [id, puzzle, solution] = dataRows[0].split(","); // Extract fields
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