import { useEffect } from "react";

interface KeyboardShortcutsProps {
  onRestart: () => void;
  onTogglePause: () => void;
  onToggleAccessibility: () => void;
  onToggleTheme: () => void;
}

export const useKeyboardShortcuts = ({
  onRestart,
  onTogglePause,
  onToggleAccessibility,
  onToggleTheme
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle shortcuts if not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + R to restart
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        onRestart();
      }

      // Ctrl/Cmd + P to pause/resume
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        onTogglePause();
      }

      // Ctrl/Cmd + A to toggle accessibility
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        onToggleAccessibility();
      }

      // Ctrl/Cmd + T to toggle theme
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault();
        onToggleTheme();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onRestart, onTogglePause, onToggleAccessibility, onToggleTheme]);
}; 