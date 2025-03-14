import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsProps {
  wpm: number;
  accuracy: number;
  characters: number;
  errors: number;
  time: number;
  mode: "time" | "words";
  onRestart: () => void;
  wpmHistory: Array<{ time: number; wpm: number; accuracy: number }>;
  className?: string;
}

const Results = ({
  wpm,
  accuracy,
  characters,
  errors,
  time,
  mode,
  onRestart,
  wpmHistory,
  className
}: ResultsProps) => {
  // Use actual WPM history data instead of generating sample data
  const graphData = wpmHistory.length > 0 ? wpmHistory : [{
    time: 0,
    wpm: 0,
    accuracy: 0
  }];

  const peakWPM = Math.max(...graphData.map(d => d.wpm));
  const lowWPM = Math.min(...graphData.map(d => d.wpm));
  const avgWPM = Math.round(graphData.reduce((acc, d) => acc + d.wpm, 0) / graphData.length);
  const rawWPM = Math.round((characters / 5) / (time / 60));
  const netWPM = Math.round(rawWPM - (errors / (time / 60)));

  const stats = [
    { label: "wpm", value: wpm, subValue: `peak: ${peakWPM}` },
    { label: "accuracy", value: accuracy, subValue: `${characters} chars` },
    { label: "raw wpm", value: rawWPM, subValue: `net: ${netWPM}` },
    { label: "errors", value: errors, subValue: `${(errors / characters * 100).toFixed(1)}%` }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn("w-full max-w-3xl mx-auto space-y-8", className)}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label}
            className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm"
          >
            <div className="text-2xl font-semibold text-primary">
              {stat.value}
            </div>
            <div className="text-sm text-foreground/60">
              {stat.label}
            </div>
            <div className="text-xs text-foreground/40 mt-1">
              {stat.subValue}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-secondary/30 p-6 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-medium mb-4">Performance Graph</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <XAxis 
                dataKey="time" 
                stroke="#888888"
                tickFormatter={(value) => `${value}s`}
              />
              <YAxis 
                stroke="#888888"
                tickFormatter={(value) => `${value}wpm`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  border: 'none',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value}`, 'WPM']}
              />
              <Line 
                type="monotone" 
                dataKey="wpm" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-medium mb-2">Performance Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Peak WPM</span>
              <span className="text-foreground">{peakWPM}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Lowest WPM</span>
              <span className="text-foreground">{lowWPM}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Average WPM</span>
              <span className="text-foreground">{avgWPM}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Raw WPM</span>
              <span className="text-foreground">{rawWPM}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Net WPM</span>
              <span className="text-foreground">{netWPM}</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-medium mb-2">Accuracy Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/60">Characters Typed</span>
              <span className="text-foreground">{characters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Errors Made</span>
              <span className="text-foreground">{errors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Error Rate</span>
              <span className="text-foreground">{(errors / characters * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Accuracy</span>
              <span className="text-foreground">{accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          try again
        </button>
      </div> */}
    </motion.div>
  );
};

export default Results; 