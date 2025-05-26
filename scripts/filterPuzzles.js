const fs = require("fs");
const path = require("path");

// File paths
const inputFilePath = path.join(__dirname, "../src/app/data/sudoku-3m.csv");
const outputFilePathEasy = path.join(__dirname, "../public/easySudokuPuzzles.csv");
const outputFilePathMedium = path.join(__dirname, "../public/mediumSudokuPuzzles.csv");
const outputFilePathHard = path.join(__dirname, "../public/hardSudokuPuzzles.csv");

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

// Sort the filtered rows by difficulty (assumed to be in the third column)
const sortedRows = filteredRows.sort((a, b) => {
  const difficultyA = parseFloat(a.split(",")[4]); // Difficulty is in the third column
  const difficultyB = parseFloat(b.split(",")[4]);
  return difficultyA - difficultyB;
});

// Divide the rows into three groups
const totalRows = sortedRows.length;
const easyRows = sortedRows.slice(0, Math.floor(totalRows / 3));
const mediumRows = sortedRows.slice(Math.floor(totalRows / 3), Math.floor((2 * totalRows) / 3));
const hardRows = sortedRows.slice(Math.floor((2 * totalRows) / 3));

// Write the groups to separate CSV files
fs.writeFileSync(outputFilePathEasy, [header, ...easyRows].join("\n"), "utf-8");
fs.writeFileSync(outputFilePathMedium, [header, ...mediumRows].join("\n"), "utf-8");
fs.writeFileSync(outputFilePathHard, [header, ...hardRows].join("\n"), "utf-8");