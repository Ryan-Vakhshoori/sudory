function Cell({
  value,
  rowIndex,
  colIndex,
}: {
  value: number;
  rowIndex: number;
  colIndex: number;
}) {
  // Determine if the cell is on a subgrid boundary
  const isBottomSubgridBorder = rowIndex === 2 || rowIndex == 5;
  const isRightSubgridBorder = colIndex === 2 || colIndex == 5;
  const isBottomGridBorder = rowIndex === 8; // Last row
  const isRightGridBorder = colIndex === 8; // Last column

  const borderClasses = `
    ${isBottomGridBorder ? "" : isBottomSubgridBorder ? "border-b-4" : "border-b"}
    ${isRightGridBorder ? "" : isRightSubgridBorder ? "border-r-4" : "border-r"}
  `;

  return (
    <div
      className={`flex justify-center items-center h-18 w-18 ${borderClasses} border-gray-400`}
    >
      {value}
    </div>
  );
}

function Grid() {
  const sudokuBoard = [
    [9, 1, 3, 5, 6, 4, 7, 8, 2],
    [4, 6, 5, 8, 2, 7, 3, 1, 9],
    [8, 2, 7, 1, 3, 9, 5, 4, 6],
    [7, 5, 8, 3, 1, 2, 6, 9, 4],
    [2, 3, 9, 4, 8, 6, 1, 5, 7],
    [6, 4, 1, 7, 9, 5, 2, 3, 8],
    [5, 9, 2, 6, 4, 3, 8, 7, 1],
    [3, 8, 4, 2, 7, 1, 9, 6, 5],
    [1, 7, 6, 9, 5, 8, 4, 2, 3],
  ];

  return (
    <div className="grid grid-cols-9 border-4">
      {sudokuBoard.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            value={value}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />
        ))
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Grid />
    </div>
  );
}
