import Grid from "./components/Grid";
import Stopwatch from "./components/Stopwatch";

export default function Home() {
  return (
    <div className="relative h-screen">
      {/* Stopwatch positioned above the grid */}
      <div className="absolute top-4 w-full flex justify-center">
        <Stopwatch />
      </div>
      {/* Grid centered horizontally and vertically */}
      <div className="flex justify-center items-center h-full">
        <Grid />
      </div>
    </div>
  );
}
