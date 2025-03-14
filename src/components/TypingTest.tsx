import { useEffect, useRef, useState } from "react";
import { useTypingTest } from "@/hooks/useTypingTest";
import { useTheme } from "@/hooks/useTheme";
import Stats from "./Stats";
import { cn } from "@/lib/utils";
import KeyboardKey from "./KeyboardKey";
import Header from "./Header";
import Results from "./Results";

const TypingTest = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    words,
    currentWordIndex,
    currentCharIndex,
    input,
    started,
    finished,
    errors,
    stats,
    options,
    activeKeys,
    handleInputChange,
    handleKeyDown,
    handleKeyUp,
    restartTest,
    setOptions,
  } = useTypingTest();
  const { font, setFont, theme, setTheme } = useTheme();
  const [showResults, setShowResults] = useState(false);
  const [finalStats, setFinalStats] = useState({
    wpm: 0,
    accuracy: 0,
    characters: 0,
    errors: 0,
  });
  const [wpmHistory, setWpmHistory] = useState<
    Array<{ time: number; wpm: number; accuracy: number }>
  >([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [wrongKeys, setWrongKeys] = useState<Set<string>>(new Set());
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});

  // Focus container on mount and when test restarts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
      setIsFocused(true);
    }
    // Hide welcome message after animation completes
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [finished]);

  // Effect to update cursor position when currentWordIndex or currentCharIndex changes
  useEffect(() => {
    const charKey = `${currentWordIndex}-${currentCharIndex}`;
    const charElement = charRefs.current[charKey];
    if (charElement) {
      const rect = charElement.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (containerRect) {
        // Adjust vertical position to align with the baseline
        const fontSize = parseFloat(
          window.getComputedStyle(charElement).fontSize
        );
        const y = rect.top - containerRect.top + (rect.height - fontSize) / 2;
        setCursorPosition({
          x: rect.left - containerRect.left,
          y: y,
        });
      }
    }
  }, [currentWordIndex, currentCharIndex, input]);

  // Handle keyboard input without a visible input element
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (finished) {
      // Allow Escape key to restart the test when finished
      if (e.key === "Escape") {
        handleRestart();
        return;
      }
    }
    if (finished) return;

    // Only process printable characters, space, and backspace
    if (
      (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) ||
      e.key === " " ||
      e.key === "Backspace"
    ) {
      // Create a synthetic input event
      let newValue = input;
      if (e.key === "Backspace") {
        newValue = input.slice(0, -1);
      } else {
        newValue = input + e.key;
      }

      // Check if the key is correct or wrong
      if (e.key.length === 1 || e.key === " ") {
        const currentWord = words[currentWordIndex];
        const expectedChar = currentWord[currentCharIndex] || " ";
        if (e.key !== expectedChar) {
          // Add to wrong keys
          setWrongKeys((prev) => new Set(prev).add(e.key.toLowerCase()));
          // Clear wrong key after a delay
          setTimeout(() => {
            setWrongKeys((prev) => {
              const newSet = new Set(prev);
              newSet.delete(e.key.toLowerCase());
              return newSet;
            });
          }, 500);
        }
      }

      // Simulate input change
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(syntheticEvent);
      e.preventDefault();
    }
  };

  // Determine which words to show (previous, current, and next few)
  const visibleWordCount = 14; // Show exactly 3 lines (5 words per line)
  const wordsPerLine = 7; // Number of words per line
  const startWordIndex = Math.max(
    0,
    currentWordIndex - (currentWordIndex % visibleWordCount)
  );
  const endWordIndex = Math.min(
    startWordIndex + visibleWordCount,
    options.mode === "words" ? options.wordCount : words.length
  );
  const visibleWords = words.slice(startWordIndex, endWordIndex);

  // Group words into lines
  const lines = [];
  for (let i = 0; i < visibleWords.length; i += wordsPerLine) {
    lines.push(visibleWords.slice(i, i + wordsPerLine));
  }

  const renderWord = (word: string, index: number) => {
    const actualIndex = index + startWordIndex;
    const isCurrentWord = actualIndex === currentWordIndex;
    const isErrorWord = errors.includes(actualIndex);
    const isCompletedWord = actualIndex < currentWordIndex;

    return (
      <div
        key={actualIndex}
        className={cn(
          "word inline-block transition-all duration-300 ease-out",
          isCurrentWord && "bg-primary/10 rounded scale-[1.02]",
          isErrorWord && "text-error/90",
          isCompletedWord && !isErrorWord && "text-primary/40"
        )}
      >
        {isCurrentWord
          ? word.split("").map((char, charIndex) => {
              const isCurrentChar = charIndex === currentCharIndex;
              const isTypedChar = charIndex < input.length;
              const isCorrectChar =
                charIndex < input.length && char === input[charIndex];
              const isIncorrectChar =
                charIndex < input.length && char !== input[charIndex];
              const charKey = `${actualIndex}-${charIndex}`;
              return (
                <span
                  key={charIndex}
                  ref={(el) => {
                    charRefs.current[charKey] = el;
                  }}
                  className={cn(
                    "char transition-all  duration-200 ease-out relative",
                    isCorrectChar && "text-primary/90",
                    isIncorrectChar && "text-error/90",
                    isCurrentChar && "text-primary"
                  )}
                >
                  {isTypedChar ? input[charIndex] : char}
                </span>
              );
            })
          : word.split("").map((char, charIndex) => (
              <span
                key={charIndex}
                className={cn(
                  "char transition-all duration-200 ease-out",
                  isCompletedWord && "opacity-40"
                )}
              >
                {char}
              </span>
            ))}{" "}
      </div>
    );
  };

  // Create keyboard rows
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const handleTestComplete = () => {
    setShowResults(true);
    setFinalStats({
      wpm: Math.round(
        stats.correctCharacters / 5 / (stats.secondsElapsed / 60)
      ),
      accuracy: Math.round(
        (stats.correctCharacters / stats.totalCharacters) * 100
      ),
      characters: stats.correctCharacters,
      errors: stats.errorCount,
    });
  };

  const handleRestart = () => {
    setShowResults(false);
    restartTest();
  };

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-background transition-colors duration-500",
        `font-${font}`
      )}
    >
      <div className="container pb-8 mx-auto px-4">
        <Header
          testMode={options.mode}
          onModeChange={(mode) => setOptions({ mode })}
          duration={options.duration}
          onDurationChange={(duration) => setOptions({ duration })}
          wordCount={options.wordCount}
          onWordCountChange={(wordCount) => setOptions({ wordCount })}
          font={font}
          onFontChange={setFont}
          theme={theme}
          onThemeChange={setTheme}
          className="py-2 md:py-3"
        />
      </div>

      <div className="flex-1  flex flex-col items-center justify-between px-4 transition-all duration-500">
        <div className="w-full h-max max-w-full flex flex-col gap-5 items-center mx-auto">
          <div className="flex justify-center items-center">
            <Stats
              wpm={stats.wpm}
              accuracy={stats.accuracy}
              time={options.mode === "time" ? stats.secondsElapsed : undefined}
              maxTime={options.mode === "time" ? options.duration : undefined}
              showRestart={finished}
              Result = {showResults}
              onRestart={handleRestart}
              className="animate-slide-down transition-all duration-500"
            />
            {showResults && (
              <Stats
                wpm={stats.wpm}
                accuracy={stats.accuracy}
                time={
                  options.mode === "time" ? stats.secondsElapsed : undefined
                }
                maxTime={options.mode === "time" ? options.duration : undefined}
                showRestart={finished}
                onRestart={handleRestart}
                className="animate-slide-down transition-all duration-500"
              />
            )}
          </div>

          {/*Main typing area*/}
          <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={(e) => {
              handleKeyDown(e as any);
              handleKeyPress(e);
              if (showWelcome) setShowWelcome(false);
            }}
            onKeyUp={(e) => handleKeyUp(e as any)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "relative focus:outline-none border-2 w-7xl cursor-text transition-all duration-500 shadow-lg rounded-xl overflow-hidden border-border/10",
              !finished && "cursor-text"
            )}
          >
            {showWelcome && !started && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/90 backdrop-blur-md rounded-xl welcome-animation">
                <div className="text-center space-y-6 p-10 max-w-2xl">
                  <h2 className="text-3xl font-bold typewriter-text">
                    Welcome to <span className="text-primary">Meow</span>
                    <span className="text-foreground/80">-Jerry</span>
                  </h2>
                  <p className="text-xl typewriter-text animation-delay-500">
                    Start typing to begin your test.
                  </p>
                </div>
              </div>
            )}

            {/* Typing area */}
            <div
              className={cn(
                "relative sm:p-10 md:py-5 rounded-lg",
                "animate-slide-up transition-all duration-500 ease-out",
                finished && "opacity-50",
                !started && "opacity-80",
                "bg-gradient-to-b from-background to-background/95"
              )}
              style={{ fontSize: "clamp(20px, 4vw, 28px)" }}
            >
              {/* Floating cursor that animates smoothly */}
              {!finished && started && (
                <span
                  ref={cursorRef}
                  className="absolute w-1 h-[10] bg-primary animate-accordion-down rounded-sm"
                  style={{
                    transform: `translate(${cursorPosition.x - 45}px, ${
                      cursorPosition.y - 25
                    }px)`,
                    transition:
                      "transform 150ms cubic-bezier(0.4, 0.0, 0.2, 1)",
                    height: "1.2em",
                  }}
                />
              )}
              <div className="transition-all duration-500 ease-linear text-center">
                {lines.map((line, lineIndex) => (
                  <div key={lineIndex} className="space-x-2 leading-relaxed">
                    {line.map((word, wordIndex) =>
                      renderWord(word, lineIndex * wordsPerLine + wordIndex)
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Restart button */}
          <div className="flex justify-center">
            <button
              onClick={handleRestart}
              className="px-5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors duration-200 flex items-center gap-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              Restart Test
            </button>
          </div>

          {/* Keyboard */}
          <div className="opacity-80 px-2 transition-all duration-500 overflow-x-auto">
            <div className="flex justify-center">
              <div className="inline-block bg-secondary/10 rounded-xl shadow-sm border border-border/5">
                {keyboardRows.map((row, index) => (
                  <div key={index} className="key-row justify-center">
                    {row.map((key) => (
                      <KeyboardKey
                        key={key}
                        active={activeKeys.has(key)}
                        className={wrongKeys.has(key) ? "wrong-key" : ""}
                      >
                        {key}
                      </KeyboardKey>
                    ))}
                  </div>
                ))}
                <div className="key-row justify-center mt-2">
                  <KeyboardKey
                    width={8}
                    active={activeKeys.has(" ")}
                    className={wrongKeys.has(" ") ? "wrong-key" : ""}
                  >
                    space
                  </KeyboardKey>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {showResults && (
        <Results
          wpm={finalStats.wpm}
          accuracy={finalStats.accuracy}
          characters={finalStats.characters}
          errors={finalStats.errors}
          time={options.duration}
          mode={options.mode}
          onRestart={handleRestart}
          wpmHistory={wpmHistory}
        />
      )} */}

      {/* Footer */}
      <div className="fixed w-full">
        <div className="flex items-center gap-4 fixed bottom-4 left-5 z-10">
          <span className="text-base font-medium">©2025 Meow-Jerry |</span>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
              title="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-1"
              title="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
              <span className="hidden sm:inline">Twitter</span>
            </a>
            <a
              href="mailto:contact@example.com"
              className="hover:text-primary transition-colors flex items-center gap-1"
              title="Contact"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span className="hidden sm:inline">Contact</span>
            </a>
          </div>
        </div>
        <div className="fixed bottom-4 right-4 z-10">
          <span className="px-4 py-2 bg-background/80 backdrop-blur-md rounded-lg text-sm text-muted-foreground border border-border/20 shadow-md">
            {finished ? (
              <>
                Press{" "}
                <kbd className="px-2 py-0.5 bg-primary/20 rounded font-semibold text-primary mx-1 border border-primary/30">
                  Esc
                </kbd>{" "}
                to restart test
              </>
            ) : (
              <>
                Press{" "}
                <kbd className="px-2 py-0.5 bg-primary/20 rounded font-semibold text-primary mx-1 border border-primary/30">
                  F11
                </kbd>{" "}
                for better experience with full screen mode
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

// Add CSS for typewriter animation
const styles = `
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  .typewriter-text {
    overflow: hidden;
    white-space: nowrap;
    animation: typewriter 1s steps(40) forwards;
    width: 0;
  }
  .animation-delay-500 {
    animation-delay: 0.5s;
  }
  .animation-delay-1000 {
    animation-delay: 1s;
  }
  .animation-delay-1500 {
    animation-delay: 0.5s;
  }
  .wrong-key {
    background-color: rgba(var(--error), 0.2) !important;
    border-color: rgba(var(--error), 0.4) !important;
    color: rgb(var(--error)) !important;
  }
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

export default TypingTest;
