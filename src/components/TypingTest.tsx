import { useEffect, useRef } from "react";
import { useTypingTest } from "@/hooks/useTypingTest";
import Stats from "./Stats";
import { cn } from "@/lib/utils";
import KeyboardKey from "./KeyboardKey";
import Header from "./Header";

const TypingTest = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
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
    setOptions
  } = useTypingTest();

  // Focus input on mount and when test restarts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [finished]);

  // Scroll words container to keep current word visible
  useEffect(() => {
    if (wordsRef.current && started) {
      const wordElements = wordsRef.current.querySelectorAll(".word");
      if (wordElements[currentWordIndex]) {
        const container = wordsRef.current;
        const word = wordElements[currentWordIndex];
        const containerRect = container.getBoundingClientRect();
        const wordRect = word.getBoundingClientRect();
        
        // If the word is below the visible area or above it, scroll to make it visible
        if (wordRect.bottom > containerRect.bottom || wordRect.top < containerRect.top) {
          word.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }
  }, [currentWordIndex, started]);

  const renderWord = (word: string, index: number) => {
    const isCurrentWord = index === currentWordIndex;
    const isErrorWord = errors.includes(index);
    const isCompletedWord = index < currentWordIndex;
    
    return (
      <div 
        key={index}
        className={cn(
          "word inline-block",
          isCurrentWord && "bg-secondary/50 rounded",
          isErrorWord && "text-error/80",
          isCompletedWord && !isErrorWord && "text-primary/80"
        )}
      >
        {word.split("").map((char, charIndex) => {
          const isCurrentChar = isCurrentWord && charIndex === currentCharIndex;
          const isTypedChar = isCurrentWord && charIndex < input.length;
          const isCorrectChar = isCurrentWord && charIndex < input.length && char === input[charIndex];
          const isIncorrectChar = isCurrentWord && charIndex < input.length && char !== input[charIndex];
          
          return (
            <span
              key={charIndex}
              className={cn(
                "char",
                isCorrectChar && "correct",
                isIncorrectChar && "incorrect",
                isCurrentChar && "current"
              )}
            >
              {char}
              {isCurrentChar && <span className="caret" />}
            </span>
          );
        })}
        {" "}
      </div>
    );
  };

  // Create keyboard rows
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]
  ];

  const renderKeyboard = () => {
    return (
      <div className="mt-6 opacity-80">
        {keyboardRows.map((row, index) => (
          <div key={index} className="key-row justify-center">
            {row.map((key) => (
              <KeyboardKey
                key={key}
                active={activeKeys.has(key)}
              >
                {key}
              </KeyboardKey>
            ))}
          </div>
        ))}
        <div className="key-row justify-center">
          <KeyboardKey width={6} active={activeKeys.has(" ")}>
            space
          </KeyboardKey>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        testMode={options.mode}
        onModeChange={(mode) => setOptions({ mode })}
        duration={options.duration}
        onDurationChange={(duration) => setOptions({ duration })}
        wordCount={options.wordCount}
        onWordCountChange={(wordCount) => setOptions({ wordCount })}
      />
      
      <div 
        className="flex-1 flex flex-col items-center justify-center px-4 py-8"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="w-full max-w-3xl">
          <Stats 
            wpm={stats.wpm}
            accuracy={stats.accuracy}
            time={options.mode === "time" ? stats.secondsElapsed : undefined}
            maxTime={options.mode === "time" ? options.duration : undefined}
            showRestart={finished}
            onRestart={restartTest}
            className="mb-8 animate-slide-down"
          />
          
          <div 
            ref={wordsRef}
            className={cn(
              "relative font-mono text-lg leading-8 max-h-[150px] overflow-y-auto p-4 mb-8 rounded-lg bg-white/50 backdrop-blur-sm border border-secondary shadow-sm animate-slide-up",
              finished && "opacity-50"
            )}
            style={{ overscrollBehavior: "contain" }}
          >
            {words.slice(0, options.mode === "words" ? options.wordCount : undefined).map(renderWord)}
          </div>
          
          <div className="relative animate-slide-up">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              disabled={finished}
              className="w-full px-4 py-3 rounded-lg bg-white/80 backdrop-blur-sm border border-secondary shadow-sm font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 placeholder-muted-foreground/50"
              placeholder={finished ? "Test completed!" : "Start typing..."}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
          
          {renderKeyboard()}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
