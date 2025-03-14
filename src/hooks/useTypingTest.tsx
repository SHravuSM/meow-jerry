import { useState, useEffect, useCallback, useRef } from "react";
import { generateRandomWords, TestOptions, defaultTestOptions } from "../utils/wordLists";

interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  correctWords: number;
  incorrectWords: number;
  secondsElapsed: number;
}

interface TypingTestHook {
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  input: string;
  started: boolean;
  finished: boolean;
  errors: number[];
  stats: TypingStats;
  options: TestOptions;
  activeKeys: Set<string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  restartTest: () => void;
  setOptions: (options: Partial<TestOptions>) => void;
}

export const useTypingTest = (): TypingTestHook => {
  const [words, setWords] = useState<string[]>([]);
  const [options, setTestOptions] = useState<TestOptions>(defaultTestOptions);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [errors, setErrors] = useState<number[]>([]);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const batchSize = 50; // Number of words to generate at a time
  const initialParagraphSize = 20; // Initial paragraph size (about 3 lines)
  const paragraphSize = 50; // Size for subsequent paragraphs

  // Generate initial words for the test
  useEffect(() => {
    // Generate initial smaller paragraph of words
    setWords(generateRandomWords(initialParagraphSize));
  }, [options]);

  // Generate more words as needed
  useEffect(() => {
    // If we're approaching the end of our current paragraph, generate a new one
    if (currentWordIndex >= words.length - 10 && !finished) {
      setWords(prevWords => [...prevWords, ...generateRandomWords(paragraphSize)]);
    }
  }, [currentWordIndex, words.length, finished]);

  // Timer logic
  useEffect(() => {
    if (started && !finished && startTime) {
      timerRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setSecondsElapsed(elapsedSeconds);
        
        if (options.mode === "time" && elapsedSeconds >= options.duration) {
          setFinished(true);
          if (timerRef.current) clearInterval(timerRef.current);
        }
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished, startTime, options]);

  // Handle typing input
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    
    const value = e.target.value;
    
    if (!started && value.length > 0) {
      setStarted(true);
      setStartTime(Date.now());
    }
    
    // Space was pressed, move to next word
    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const currentWord = words[currentWordIndex];
      
      // Check if the word was typed correctly
      if (typedWord === currentWord) {
        setCorrectWords(prev => prev + 1);
      } else {
        setIncorrectWords(prev => prev + 1);
        setErrors(prev => [...prev, currentWordIndex]);
      }
      
      setInput("");
      setCurrentCharIndex(0);
      
      // End test if we've reached the end of words in words mode
      if (options.mode === "words" && currentWordIndex + 1 >= options.wordCount) {
        setFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCurrentWordIndex(prevIndex => prevIndex + 1);
      }
    } else {
      // Update character tracking
      const currentWord = words[currentWordIndex];
      for (let i = 0; i < value.length; i++) {
        if (i < currentWord.length) {
          if (value[i] === currentWord[i]) {
            if (i >= currentCharIndex) {
              setCorrectChars(prev => prev + 1);
            }
          } else {
            if (i >= currentCharIndex) {
              setIncorrectChars(prev => prev + 1);
            }
          }
        }
      }
      
      setInput(value);
      setCurrentCharIndex(value.length);
    }
  }, [currentWordIndex, words, currentCharIndex, finished, started, options]);

  // Track active keys for virtual keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    setActiveKeys(prev => new Set(prev).add(e.key));
  }, []);

  const handleKeyUp = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.key);
      return newSet;
    });
  }, []);

  // Restart the test
  const restartTest = useCallback(() => {
    // Generate initial smaller paragraph of words
    setWords(generateRandomWords(initialParagraphSize));
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCorrectWords(0);
    setIncorrectWords(0);
    setInput("");
    setStarted(false);
    setFinished(false);
    setStartTime(null);
    setSecondsElapsed(0);
    setErrors([]);
    setActiveKeys(new Set());
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Update options
  const setOptions = useCallback((newOptions: Partial<TestOptions>) => {
    setTestOptions(prev => ({ ...prev, ...newOptions }));
    restartTest();
  }, [restartTest]);

  // Calculate WPM and accuracy
  const calculateWPM = (chars: number, seconds: number): number => {
    if (seconds === 0) return 0;
    // Standard formula: (characters / 5) / time in minutes
    return Math.round((chars / 5) / (seconds / 60));
  };

  const calculateAccuracy = (correct: number, incorrect: number): number => {
    if (correct + incorrect === 0) return 100;
    return Math.round((correct / (correct + incorrect)) * 100);
  };

  const wpm = calculateWPM(correctChars, secondsElapsed);
  const accuracy = calculateAccuracy(correctChars, incorrectChars);

  const stats: TypingStats = {
    wpm,
    accuracy,
    correctChars,
    incorrectChars,
    correctWords,
    incorrectWords,
    secondsElapsed
  };

  return {
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
  };
};
