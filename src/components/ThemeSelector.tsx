
import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FontStyle = "inter" | "jetbrains-mono" | "roboto-mono" | "space-mono";
export type Theme = "light" | "dark" | "sepia";

interface ThemeSelectorProps {
  currentFont: FontStyle;
  onFontChange: (font: FontStyle) => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

const ThemeSelector = ({
  currentFont,
  onFontChange,
  currentTheme,
  onThemeChange,
  className,
}: ThemeSelectorProps) => {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-2", className)}>
      <Select
        value={currentFont}
        onValueChange={(value) => onFontChange(value as FontStyle)}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="inter" className="font-sans">Inter</SelectItem>
          <SelectItem value="jetbrains-mono" className="font-mono">JetBrains Mono</SelectItem>
          <SelectItem value="roboto-mono" className="font-['Roboto_Mono']">Roboto Mono</SelectItem>
          <SelectItem value="space-mono" className="font-['Space_Mono']">Space Mono</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={currentTheme}
        onValueChange={(value) => onThemeChange(value as Theme)}
      >
        <SelectTrigger className="w-32 h-8 text-xs">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="sepia">Sepia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSelector;
