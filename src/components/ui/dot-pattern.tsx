import * as React from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  spacing?: number;
  dotColor?: string;
}

export function DotPattern({
  className,
  size = 2,
  spacing = 20,
  dotColor = "currentColor",
  ...props
}: DotPatternProps) {
  return (
    <div
      className={cn("absolute inset-0 -z-10 opacity-[0.2]", className)}
      {...props}
      style={{
        backgroundImage: `radial-gradient(${dotColor} ${size}px, transparent ${size}px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        ...props.style,
      }}
    />
  );
}
