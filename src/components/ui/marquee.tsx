import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
	/**
	 * The content to be displayed in the marquee
	 */
	children: React.ReactNode;
	/**
	 * Direction of the marquee animation
	 * @default "left"
	 */
	direction?: "left" | "right";
	/**
	 * Speed of the marquee animation (in seconds for one complete cycle)
	 * @default 20
	 */
	speed?: number;
	/**
	 * Gap between repeated content
	 * @default "1rem"
	 */
	gap?: string;
	/**
	 * Whether to pause the animation on hover
	 * @default false
	 */
	pauseOnHover?: boolean;
	/**
	 * Number of times to repeat the content
	 * @default 3
	 */
	repeat?: number;
}

export function Marquee({
	children,
	direction = "left",
	speed = 20,
	gap = "1rem",
	pauseOnHover = false,
	repeat = 3,
	className,
	...props
}: MarqueeProps) {
	// Using CSS variables for animation configuration
	const containerStyles = {
		"--gap": gap,
		"--duration": `${speed}s`,
	} as React.CSSProperties;

	return (
		<div
			className={cn("relative w-full overflow-hidden", className)}
			style={containerStyles}
			{...props}
		>
			<div
				className={cn(
					"group flex w-full",
					pauseOnHover && "hover:[&>*]:[animation-play-state:paused]",
				)}
			>
				{/* Create multiple instances of the content with proper animation */}
				{Array(repeat)
					.fill(0)
					.map((_, i) => (
						<div
							key={`marquee-${direction}-${i}`}
							className={cn(
								"flex shrink-0 items-center gap-[var(--gap)]",
								direction === "left"
									? "animate-[marquee-left_var(--duration)_linear_infinite]"
									: "animate-[marquee-right_var(--duration)_linear_infinite]",
							)}
						>
							{Array.isArray(children) ? children : [children]}
						</div>
					))}
			</div>
		</div>
	);
}
