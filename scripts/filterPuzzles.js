const fs = require("fs");
const path = require("path");

// File paths
const inputFilePath = path.join(__dirname, "../src/app/data/sudoku-3m.csv");
const outputFilePath = path.join(__dirname, "../src/app/data/filteredSudokuPuzzles.csv");

// Read the CSV file
const csvContent = fs.readFileSync(inputFilePath, "utf-8");

// Split into rows
const rows = csvContent.trim().split("\n");

// Extract the header and data rows
const [header, ...dataRows] = rows;

// Function to check if each number appears an odd number of times
const hasOddOccurrences = (puzzle) => {
  const counts = Array(10).fill(0); // Array to count occurrences of digits 1–9

  for (const char of puzzle) {
    const num = parseInt(char, 10);
    if (num >= 1 && num <= 9) {
      counts[num]++;
    }
  }

  // Check if all counts (1–9) are odd
  return counts.slice(1).every((count) => count % 2 === 1);
};

// Filter rows based on the puzzle column
const filteredRows = dataRows.filter((row) => {
  const columns = row.split(","); // Split the row into columns
  const puzzle = columns[1]; // The puzzle is in the second column
  return hasOddOccurrences(puzzle);
});

// Write the filtered rows to a new CSV file
fs.writeFileSync(outputFilePath, [header, ...filteredRows].join("\n"), "utf-8");

console.log(`Filtered puzzles saved to ${outputFilePath}`);