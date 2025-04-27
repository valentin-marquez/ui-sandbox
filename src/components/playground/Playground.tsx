import { DotPattern } from "@/components/ui/dot-pattern";
import { getComponentModule } from "@/lib/component-registry";
import type { ComponentMetadata } from "@/types/component";
import type React from "react";
import { useEffect, useState } from "react";

interface PlaygroundProps {
	componentName: string;
}

const Playground: React.FC<PlaygroundProps> = ({ componentName }) => {
	const [Example, setExample] = useState<React.ComponentType | null>(null);
	const [metadata, setMetadata] = useState<ComponentMetadata | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadComponent = async () => {
			try {
				const module = getComponentModule(componentName);

				if (!module) {
					setError(`Component not found: ${componentName}`);
					return;
				}

				const ExampleComponent = module.example;
				const componentMetadata = module.metadata ? module.metadata() : null;

				if (ExampleComponent) {
					setExample(() => ExampleComponent);
					setMetadata(componentMetadata);
					setError(null);
				} else {
					setError(`Example not found for component: ${componentName}`);
				}
			} catch (err) {
				console.error("Failed to load component:", err);
				setError(`Could not load component: ${componentName}`);
			}
		};

		if (componentName) {
			loadComponent();
		}
	}, [componentName]);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-destructive">
				<p className="mb-2 font-medium text-lg">Error Loading Component</p>
				<p>{error}</p>
			</div>
		);
	}

	if (!Example) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="animate-pulse text-muted-foreground">
					Loading component...
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden p-8">
			{/* Dot pattern background */}

			<DotPattern dotColor="var(--border)" />
			<div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl bg-background shadow-lg">
				{metadata && (
					<div className="border-border border-b bg-muted/30 px-8 py-6">
						<div className="mb-4 flex items-center justify-between">
							<h1 className="font-bold text-2xl">{metadata.name}</h1>
							<span
								className={`rounded-full px-3 py-1 text-sm ${
									metadata.status === "completed"
										? "bg-primary/20 text-primary"
										: metadata.status === "in-progress"
											? "bg-chart-4/20 text-chart-4"
											: "bg-muted text-muted-foreground"
								}`}
							>
								{metadata.status}
							</span>
						</div>
						<p className="text-muted-foreground">{metadata.description}</p>
						{metadata.author && (
							<p className="mt-2 text-muted-foreground text-sm">
								By {metadata.author} • Last updated:{" "}
								{metadata.lastUpdated || "unknown"}
							</p>
						)}
					</div>
				)}

				<div className="flex items-center justify-center p-8 backdrop-blur-sm">
					<div className="w-full py-4">
						<Example />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Playground;
