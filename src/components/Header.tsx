import { cn } from "@/lib/utils";
import {
  TestMode,
  TestDuration,
  TestWordCount,
  TestOptions,
} from "@/utils/wordLists";
import ThemeSelector, { FontStyle, Theme } from "./ThemeSelector";

interface HeaderProps {
  testMode: TestOptions["mode"];
  onModeChange: (mode: TestOptions["mode"]) => void;
  duration: number;
  onDurationChange: (duration: number) => void;
  wordCount: number;
  onWordCountChange: (wordCount: number) => void;
  font: string;
  onFontChange: (font: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  className?: string;
}

const Header = ({
  testMode,
  onModeChange,
  duration,
  onDurationChange,
  wordCount,
  onWordCountChange,
  font,
  onFontChange,
  theme,
  onThemeChange,
  className,
}: HeaderProps) => {
  return (
    <header className={cn("w-full px-8 py-8 animate-slide-down backdrop-blur-sm bg-background/80 border-b border-border/10 sticky top-0 z-50", className)}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-0">
          <div className="flex items-baseline gap-1">
            <h1 className="text-4xl font-bold tracking-tight text-primary">meow</h1>
            <span className="text-3xl font-normal text-foreground/80"> -jerry</span>
          </div>
          
          <div className="flex items-center">
            <ThemeSelector 
              currentFont={font}
              onFontChange={onFontChange}
              currentTheme={theme}
              onThemeChange={onThemeChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap mt-14 gap-4 justify-center">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="bg-secondary/30 p-1.5 rounded-lg backdrop-blur-sm shadow-sm">
              <button
                onClick={() => onModeChange("time")}
                className={cn(
                  "px-5 py-2 rounded-md text-sm font-medium transition-all",
                  testMode === "time"
                    ? "bg-primary/20 text-primary shadow-sm" 
                    : "text-foreground/60 hover:text-foreground/90 hover:bg-secondary/50"
                )}
              >
                time
              </button>
              <button
                onClick={() => onModeChange("words")}
                className={cn(
                  "px-5 py-2 rounded-md text-sm font-medium transition-all",
                  testMode === "words"
                    ? "bg-primary/20 text-primary shadow-sm" 
                    : "text-foreground/60 hover:text-foreground/90 hover:bg-secondary/50"
                )}
              >
                words
              </button>
            </div>

            {testMode === "time" ? (
              <div className="bg-secondary/30 p-1.5 rounded-lg backdrop-blur-sm shadow-sm">
                {[15, 30, 60, 120].map((time) => (
                  <button
                    key={time}
                    onClick={() => onDurationChange(time as TestDuration)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all",
                      duration === time 
                        ? "bg-primary/20 text-primary shadow-sm" 
                        : "text-foreground/60 hover:text-foreground/90 hover:bg-secondary/50"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-secondary/30 p-1.5 rounded-lg backdrop-blur-sm shadow-sm">
                {[10, 25, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => onWordCountChange(count as TestWordCount)}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all",
                      wordCount === count 
                        ? "bg-primary/20 text-primary shadow-sm" 
                        : "text-foreground/60 hover:text-foreground/90 hover:bg-secondary/50"
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
