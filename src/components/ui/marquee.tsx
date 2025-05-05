import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

// Speed durations in milliseconds
const speedValues = {
	fast: "10s",
	normal: "15s",
	slow: "30s",
};

const marquee = cva("flex items-center whitespace-nowrap w-max", {
	variants: {
		gap: {
			sm: "gap-2 pl-2",
			md: "gap-4 pl-4",
			lg: "gap-6 pl-6",
		},
	},
	defaultVariants: {
		gap: "md",
	},
});

type MarqueeProps = HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof marquee> & {
		speed?: "fast" | "normal" | "slow";
		direction?: "left" | "right";
		gap?: "sm" | "md" | "lg";
	};

const Marquee = ({
	className,
	gap = "md",
	speed = "normal",
	direction = "left",
	children,
	...props
}: MarqueeProps) => {
	const animationDuration = speedValues[speed];
	const animationDirection = direction === "left" ? "" : "reverse";

	return (
		<div className="overflow-clip">
			<div
				className={cn(
					marquee({ gap }),
					`animate-[marquee_${animationDuration}_linear_infinite_${animationDirection}]`,
					"transform-gpu",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>
	);
};

Marquee.displayName = "Marquee";

export { Marquee };
