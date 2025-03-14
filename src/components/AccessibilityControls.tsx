import { useState } from "react";
import { cn } from "@/lib/utils";

interface AccessibilityControlsProps {
  onFontSizeChange: (size: number) => void;
  onHighContrastToggle: (enabled: boolean) => void;
  className?: string;
}

const AccessibilityControls = ({
  onFontSizeChange,
  onHighContrastToggle,
  className
}: AccessibilityControlsProps) => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    onFontSizeChange(newSize);
  };

  const handleHighContrastToggle = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    onHighContrastToggle(newValue);
  };

  return (
    <div className={cn("flex items-center gap-4 p-4 bg-background/50 rounded-lg", className)}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleFontSizeChange(-1)}
          className="p-2 rounded hover:bg-primary/10 transition-colors"
          aria-label="Decrease font size"
        >
          A-
        </button>
        <span className="text-sm">{fontSize}px</span>
        <button
          onClick={() => handleFontSizeChange(1)}
          className="p-2 rounded hover:bg-primary/10 transition-colors"
          aria-label="Increase font size"
        >
          A+
        </button>
      </div>
      
      <button
        onClick={handleHighContrastToggle}
        className={cn(
          "p-2 rounded transition-colors",
          highContrast ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
        )}
        aria-label="Toggle high contrast mode"
      >
        {highContrast ? "High Contrast On" : "High Contrast Off"}
      </button>
    </div>
  );
};

export default AccessibilityControls; 