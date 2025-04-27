import { cn } from "@/lib/utils";
import type * as React from "react";

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
			className={cn("-z-10 absolute inset-0 opacity-45", className)}
			{...props}
			style={{
				backgroundImage: `radial-gradient(${dotColor} ${size}px, transparent ${size}px)`,
				backgroundSize: `${spacing}px ${spacing}px`,
				...props.style,
			}}
		/>
	);
}
