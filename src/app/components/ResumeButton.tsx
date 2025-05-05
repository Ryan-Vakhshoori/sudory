import { PlayIcon } from "@heroicons/react/24/solid";

export default function ResumeButton({ onResume }: { onResume: () => void }) {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <button
        className="bg-blue-500 hover:bg-blue-400 text-white size-11 sm:size-16 md:size-17 lg:size-18 xl:size-19 2xl:size-20 rounded-full flex justify-center items-center cursor-pointer"
        onClick={onResume}
      >
        <PlayIcon className="h-5.5 w-5.5 sm:h-8 sm:w-8 md:h-10 md:w-10" />
      </button>
    </div>
  );
}