
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
      style={{ 
        width: `${width * 2}rem`,
        transition: "all 0.18s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {children}
    </div>
  );
};

export default KeyboardKey;
