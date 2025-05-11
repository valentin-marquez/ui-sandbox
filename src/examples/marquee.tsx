import { Marquee } from "@/components/ui/marquee";

export default function MarqueeExample() {
	return (
		<div className="space-y-8">
			{/* Example with pauseOnHover */}
			<div>
				<h3 className="mb-2 font-medium text-lg">
					Pause on Hover (Right Direction)
				</h3>
				<Marquee direction="right" speed={30} pauseOnHover>
					{Array(10)
						.fill(0)
						.map((_, i) => (
							<span
								key={`item-right-${Math.random().toString(36).substr(2, 9)}`}
								className="mx-2 rounded-md bg-primary/10 px-4 py-2"
							>
								Item {i + 1}
							</span>
						))}
				</Marquee>
			</div>

			{/* Example without pauseOnHover */}
			<div>
				<h3 className="mb-2 font-medium text-lg">
					No Pause on Hover (Left Direction)
				</h3>
				<Marquee direction="left" speed={10}>
					{Array(10)
						.fill(0)
						.map((_, i) => (
							<span
								key={`item-left-${Math.random().toString(36).substr(2, 9)}`}
								className="mx-2 rounded-md bg-secondary/10 px-4 py-2"
							>
								Item {i + 1}
							</span>
						))}
				</Marquee>
			</div>
		</div>
	);
}
