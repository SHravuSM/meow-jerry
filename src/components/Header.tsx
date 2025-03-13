
import { cn } from "@/lib/utils";
import { TestMode, TestDuration, TestWordCount } from "@/utils/wordLists";
import ThemeSelector, { FontStyle, Theme } from "./ThemeSelector";

interface HeaderProps {
  testMode: TestMode;
  onModeChange: (mode: TestMode) => void;
  duration: TestDuration;
  onDurationChange: (duration: TestDuration) => void;
  wordCount: TestWordCount;
  onWordCountChange: (count: TestWordCount) => void;
  font: FontStyle;
  onFontChange: (font: FontStyle) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
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
  className
}: HeaderProps) => {
  return (
    <header className={cn("w-full px-8 py-6 animate-slide-down", className)}>
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-baseline gap-1">
            <h1 className="text-2xl font-semibold tracking-tight text-primary">type</h1>
            <span className="text-xl font-normal text-foreground/80">wild</span>
          </div>
          
          <ThemeSelector 
            currentFont={font}
            onFontChange={onFontChange}
            currentTheme={theme}
            onThemeChange={onThemeChange}
          />
          
          <div className="flex items-center gap-1">
            <a 
              href="https://github.com/yourusername/typewild" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm bg-secondary/80 rounded-md font-medium text-foreground/80 hover:bg-secondary transition-colors"
            >
              github
            </a>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="bg-secondary/50 p-1 rounded-md">
              <button
                onClick={() => onModeChange("time")}
                className={cn(
                  "px-4 py-1 rounded text-sm font-medium transition-colors",
                  testMode === "time" 
                    ? "bg-white text-foreground shadow-sm" 
                    : "text-foreground/70 hover:text-foreground/90"
                )}
              >
                time
              </button>
              <button
                onClick={() => onModeChange("words")}
                className={cn(
                  "px-4 py-1 rounded text-sm font-medium transition-colors",
                  testMode === "words" 
                    ? "bg-white text-foreground shadow-sm" 
                    : "text-foreground/70 hover:text-foreground/90"
                )}
              >
                words
              </button>
            </div>
          </div>
          
          {testMode === "time" && (
            <div className="bg-secondary/50 p-1 rounded-md">
              {[15, 30, 60, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => onDurationChange(time as TestDuration)}
                  className={cn(
                    "px-3 py-1 rounded text-sm font-medium transition-colors",
                    duration === time 
                      ? "bg-white text-foreground shadow-sm" 
                      : "text-foreground/70 hover:text-foreground/90"
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
          
          {testMode === "words" && (
            <div className="bg-secondary/50 p-1 rounded-md">
              {[10, 25, 50, 100].map((count) => (
                <button
                  key={count}
                  onClick={() => onWordCountChange(count as TestWordCount)}
                  className={cn(
                    "px-3 py-1 rounded text-sm font-medium transition-colors",
                    wordCount === count 
                      ? "bg-white text-foreground shadow-sm" 
                      : "text-foreground/70 hover:text-foreground/90"
                  )}
                >
                  {count}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
