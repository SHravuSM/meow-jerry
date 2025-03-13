
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface StatsProps {
  wpm: number;
  accuracy: number;
  showRestart?: boolean;
  onRestart?: () => void;
  time?: number;
  maxTime?: number;
  className?: string;
}

const Stats = ({ 
  wpm, 
  accuracy, 
  showRestart = false, 
  onRestart,
  time,
  maxTime,
  className 
}: StatsProps) => {
  const prevWpm = useRef(wpm);
  const wpmRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (wpm > prevWpm.current && wpmRef.current) {
      wpmRef.current.classList.add("text-primary");
      const timeout = setTimeout(() => {
        wpmRef.current?.classList.remove("text-primary");
      }, 300);
      return () => clearTimeout(timeout);
    }
    prevWpm.current = wpm;
  }, [wpm]);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="flex items-center justify-between gap-8">
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider text-muted-foreground">WPM</div>
          <div ref={wpmRef} className="text-4xl font-mono font-semibold transition-colors">
            {wpm}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-sm uppercase tracking-wider text-muted-foreground">Accuracy</div>
          <div className="text-4xl font-mono font-semibold">
            {accuracy}%
          </div>
        </div>
        
        {time !== undefined && maxTime !== undefined && (
          <div className="text-center">
            <div className="text-sm uppercase tracking-wider text-muted-foreground">Time</div>
            <div className="text-4xl font-mono font-semibold">
              {time}s
            </div>
            <div className="w-full h-1 bg-secondary mt-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${(time / maxTime) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {showRestart && (
        <button
          onClick={onRestart}
          className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors animate-scale"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Stats;
