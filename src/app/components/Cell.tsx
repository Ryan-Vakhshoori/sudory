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
          size-10 sm:size-15 md:size-16 lg:size-17 xl:size-18 2xl:size-19 ${borderClasses} border-gray-400 ${className}`}
        onClick={onClick}
      >
        <p className="text-[26px] sm:text-[39px] md:text-[42px] lg:text-[44px] xl:text-[47px] 2xl:text-[49px] font-bold">{hidden ? "" : value}</p>
      </div>
    );
  }