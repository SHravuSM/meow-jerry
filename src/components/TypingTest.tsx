
import { useEffect, useRef } from "react";
import { useTypingTest } from "@/hooks/useTypingTest";
import Stats from "./Stats";
import { cn } from "@/lib/utils";
import KeyboardKey from "./KeyboardKey";
import Header from "./Header";

const TypingTest = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Focus container on mount and when test restarts
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
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

  // Handle keyboard input without a visible input element
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      
      // Simulate input change
      const syntheticEvent = {
        target: { value: newValue }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(syntheticEvent);
      e.preventDefault();
    }
  };

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
        {isCurrentWord ? (
          // Current word - show characters with input overlay
          word.split("").map((char, charIndex) => {
            const isCurrentChar = charIndex === currentCharIndex;
            const isTypedChar = charIndex < input.length;
            const isCorrectChar = charIndex < input.length && char === input[charIndex];
            const isIncorrectChar = charIndex < input.length && char !== input[charIndex];
            
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
                {isTypedChar ? input[charIndex] : char}
                {isCurrentChar && (
                  <span 
                    className="caret" 
                    style={{
                      left: isTypedChar ? '100%' : '0',
                      transform: `translateX(${isTypedChar ? '0' : '0'})`,
                      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                )}
              </span>
            );
          })
        ) : (
          // Not current word - show original characters
          word.split("").map((char, charIndex) => (
            <span key={charIndex} className="char">
              {char}
            </span>
          ))
        )}
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
        onClick={() => containerRef.current?.focus()}
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
            ref={containerRef}
            tabIndex={0}
            onKeyDown={(e) => {
              handleKeyDown(e as any);
              handleKeyPress(e);
            }}
            onKeyUp={(e) => handleKeyUp(e as any)}
            className={cn(
              "relative focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-lg",
              !finished && "cursor-text"
            )}
          >
            <div 
              ref={wordsRef}
              className={cn(
                "relative font-mono text-lg leading-8 max-h-[150px] overflow-y-auto p-4 mb-8 rounded-lg bg-white/50 backdrop-blur-sm border border-secondary shadow-sm animate-slide-up",
                finished && "opacity-50"
              )}
              style={{ overscrollBehavior: "contain" }}
            >
              {words.slice(0, options.mode === "words" ? options.wordCount : undefined).map(renderWord)}
              
              {/* Typing indicator when no text has been entered */}
              {!started && !finished && (
                <div className="absolute bottom-4 left-4 text-muted-foreground/70 pointer-events-none animate-pulse-smooth">
                  Click here and start typing...
                </div>
              )}
            </div>
          </div>
          
          {renderKeyboard()}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;
