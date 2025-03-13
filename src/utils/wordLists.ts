
// Common English words for typing tests
export const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", 
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", 
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", 
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", 
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", 
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", 
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", 
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", 
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", 
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "am", "are", "was", "were", "been", "being", "do", "does", "did", 
  "has", "had", "having", "going", "came", "gone", "seen", "heard", "felt", "found",
  "made", "said", "told", "thought", "tried", "meant", "took", "put", "saw", "went",
  "met", "held", "left", "gave", "got", "ran", "sat", "stood", "fell", "flew"
];

// Generate a random set of words
export const generateRandomWords = (count: number): string[] => {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * commonWords.length);
    words.push(commonWords[randomIndex]);
  }
  return words;
};

// Different test options
export type TestDuration = 15 | 30 | 60 | 120;
export type TestMode = "time" | "words";
export type TestWordCount = 10 | 25 | 50 | 100;

// Options for the typing test
export interface TestOptions {
  mode: TestMode;
  duration: TestDuration;
  wordCount: TestWordCount;
}

export const defaultTestOptions: TestOptions = {
  mode: "time",
  duration: 30,
  wordCount: 25
};
