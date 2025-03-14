import React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FontStyle = "inter" | "jetbrains-mono" | "roboto-mono" | "space-mono" | "ubuntu-mono" | "fira-code" | "source-code-pro" | "comic-sans";
export type Theme = "light" | "dark" | "sepia" | "nord" | "dracula" | "solarized" | "monokai" | "github";

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
          <SelectItem value="ubuntu-mono" className="font-['Ubuntu_Mono']">Ubuntu Mono</SelectItem>
          <SelectItem value="fira-code" className="font-['Fira_Code']">Fira Code</SelectItem>
          <SelectItem value="source-code-pro" className="font-['Source_Code_Pro']">Source Code Pro</SelectItem>
          <SelectItem value="comic-sans" className="font-['Comic_Sans_MS']">Comic Sans</SelectItem>
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
          <SelectItem value="nord">Nord</SelectItem>
          <SelectItem value="dracula">Dracula</SelectItem>
          <SelectItem value="solarized">Solarized</SelectItem>
          <SelectItem value="monokai">Monokai</SelectItem>
          <SelectItem value="github">GitHub</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSelector;
