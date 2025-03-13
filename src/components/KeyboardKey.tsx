
import { cn } from "@/lib/utils";

interface KeyboardKeyProps {
  children: React.ReactNode;
  width?: number; // width in relative units
  active?: boolean;
  className?: string;
}

const KeyboardKey = ({ children, width = 1, active = false, className }: KeyboardKeyProps) => {
  return (
    <div 
      className={cn(
        "key", 
        active && "active", 
        className
      )}
      style={{ width: `${width * 2}rem` }}
    >
      {children}
    </div>
  );
};

export default KeyboardKey;
