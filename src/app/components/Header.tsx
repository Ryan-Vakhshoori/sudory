export default function Header({ puzzleIndex }: { puzzleIndex: number }) {
  return (
    <div className="flex flex-row w-screen justify-start p-1 sm:p-2 md:p-3 lg:p-4 space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
      <p className="text-[26px] sm:text-[39px] md:text-[42px] lg:text-[44px] xl:text-[47px] 2xl:text-[49px] font-bold">Sudory</p>
      {puzzleIndex !== 0 && (
        <p className="text-[26px] sm:text-[39px] md:text-[42px] lg:text-[44px] xl:text-[47px] 2xl:text-[49px]">#{puzzleIndex}</p>
      )}
    </div>
  );
}