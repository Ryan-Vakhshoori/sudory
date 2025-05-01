export default function Cell({
    value,
    rowIndex,
    colIndex,
    hidden,
    onClick,
    className,
  }: {
    value: number;
    rowIndex: number;
    colIndex: number;
    hidden: boolean;
    onClick: () => void;
    className?: string;
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
        className={`flex justify-center items-center aspect-square
          h-10 w-10 sm:h-15 sm:w-15 md:h-19 md:w-19 ${borderClasses} border-gray-400 ${className}`}
        onClick={onClick}
      >
        <p className="text-2xl sm:text-4xl md:text-5xl font-bold">{hidden ? "" : value}</p>
      </div>
    );
  }