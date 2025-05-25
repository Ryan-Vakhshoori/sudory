import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import React from "react";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function getBinWidthAndCount(data: number[]) {
  // For very small datasets, use a fixed number of bins (e.g., 3)
  if (data.length < 6) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const uniqueCount = new Set(data).size;
    const binCount = Math.min(3, data.length, uniqueCount); // Don't use more bins than unique data points
    const binWidth = Math.max(1, Math.ceil((max - min + 1) / binCount));
    return { binWidth, binCount };
  }
  // Calculate IQR
  const sorted = [...data].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  // Freedman–Diaconis rule
  const binWidth = iqr === 0 ? 1 : (2 * iqr) / Math.cbrt(data.length);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binCount = Math.max(1, Math.ceil((max - min) / binWidth) + 1);
  return { binWidth: Math.max(1, Math.round(binWidth)), binCount };
}

export default function Histogram({
  data,
  label,
  type = "time",
  highlightValue, // Add this prop: the value to highlight (e.g., current submission)
}: {
  data: number[];
  label: string;
  type?: "time" | "moves";
  highlightValue?: number;
}) {
  const min = Math.min(...data);

  // Use Freedman–Diaconis rule for bin width and count
  const { binWidth, binCount } = getBinWidthAndCount(data);

  function makeBins(data: number[], binSize: number, binCount: number) {
    const bins = Array(binCount).fill(0);
    data.forEach((val) => {
      const idx = Math.min(Math.floor((val - min) / binSize), binCount - 1);
      bins[idx]++;
    });
    return bins;
  }

  const bins = makeBins(data, binWidth, binCount);
  const total = data.length || 1; // Prevent division by zero
  const percentBins = bins.map((count) => Math.round((count / total) * 100));

  // Helper to format seconds as mm:ss
  const formatTime = (seconds: number) => {
    const minVal = Math.floor(seconds / 60);
    const secVal = seconds % 60;
    return `${minVal}:${secVal.toString().padStart(2, "0")}`;
  };

  // Label generator based on type
  const getLabel = (i: number) => {
    const start = min + i * binWidth;
    const end = min + (i + 1) * binWidth - 1;
    if (binWidth === 1) {
      // Show just the value, not a range
      return type === "time" ? formatTime(start) : `${start}`;
    }
    if (type === "time") {
      return `${formatTime(start)}-${formatTime(end)}`;
    } else {
      return `${start}-${end}`;
    }
  };

  // Find the bin index for the highlighted value
  let highlightBin = -1;
  if (typeof highlightValue === "number" && !isNaN(highlightValue)) {
    highlightBin = Math.min(
      Math.floor((highlightValue - min) / binWidth),
      binCount - 1
    );
  }

  // Set bar colors, highlighting the relevant bin
  const barColors = Array.from({ length: binCount }, (_, i) =>
    i === highlightBin ? "#f59e42" : "#2b7fff"
  );

  return (
    <div>
      <Bar
        data={{
          labels: Array.from({ length: binCount }, (_, i) => getLabel(i)),
          datasets: [
            {
              label: `${label} (%)`,
              data: percentBins,
              backgroundColor: barColors,
              borderRadius: Math.max(4, Math.min(12, Math.round(binWidth * 1.5))),
            },
          ],
        }}
        options={{
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: false,
              callbacks: {
                title: (items) => {
                  const index = items[0].dataIndex;
                  return getLabel(index);
                },
                label: (context) => `${context.parsed.y}%`,
              },
            },
          },
          scales: { 
            x: { 
              title: { display: false },
              ticks: {
                callback: function(value, index) {
                  return getLabel(index);
                }
              }
            }, 
            y: { 
              title: { display: false },
              ticks: { callback: (value) => `${value}%` },
              max: 100,
            } 
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
        height={200}
      />
    </div>
  );
}