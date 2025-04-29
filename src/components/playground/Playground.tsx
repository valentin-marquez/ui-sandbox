import { Button } from "@/components/ui/button";
import { Syntax, SyntaxContainer } from "@/components/ui/syntax"; // Import the Syntax component
import { getComponentModule } from "@/lib/component-registry";
import type { ComponentMetadata } from "@/types/component";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";

interface PlaygroundProps {
	componentName: string;
}

const Playground: React.FC<PlaygroundProps> = ({ componentName }) => {
	const [Example, setExample] = useState<React.ComponentType | null>(null);
	const [metadata, setMetadata] = useState<ComponentMetadata | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [source, setSource] = useState<string | null>(null);
	const [showCode, setShowCode] = useState(false); // Renombramos el estado para claridad

	useEffect(() => {
		const loadComponent = async () => {
			try {
				const entry = getComponentModule(componentName);

				if (!entry) {
					setError(`Component not found: ${componentName}`);
					return;
				}

				const ExampleComponent = entry.example;
				const componentMetadata = entry.metadata;
				const sourceCode = entry.source;

				if (ExampleComponent) {
					setExample(() => ExampleComponent);
					setMetadata(componentMetadata);
					setSource(sourceCode);
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

	const handleToggle = () => {
		setShowCode(!showCode);
	};

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
			<div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl border-2 border-border bg-background shadow-lg">
				{metadata && (
					<div className="border-border border-b-2 bg-muted/30 px-8 py-6">
						<div className="mb-4 flex items-center justify-between gap-4">
							<h1 className="font-bold text-2xl">{metadata.name}</h1>

							<div className="flex items-center gap-4">
								{/* Nuevo switch animado */}
								<motion.div className="flex items-center gap-2">
									<span
										className={`font-medium text-sm transition-opacity ${showCode ? "opacity-50" : "opacity-100"}`}
									>
										No
									</span>

									<button
										type="button"
										onClick={handleToggle}
										className="relative h-8 w-14 cursor-pointer rounded-full border border-border bg-card transition-colors hover:bg-muted"
										role="switch"
										aria-checked={showCode}
									>
										<motion.div
											className="absolute top-1 h-6 w-6 rounded-full shadow-sm"
											initial={false}
											animate={{
												x: showCode ? 26 : 4,
												backgroundColor: "var(--primary)",
											}}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 30,
											}}
										/>
									</button>

									<span
										className={`font-medium text-sm transition-opacity ${showCode ? "opacity-100" : "opacity-50"}`}
									>
										Code
									</span>
								</motion.div>

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

				<div className="relative overflow-hidden p-2 backdrop-blur-sm">
					<AnimatePresence mode="sync">
						<motion.div
							key={showCode ? "code" : "component"}
							initial={false}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{
								type: "spring",
								stiffness: 400,
								damping: 30,
								duration: 0.3,
							}}
							className="w-full"
						>
							{showCode ? (
								<motion.div
									className="rounded-xl p-1"
									initial={{ scaleY: 0.8 }}
									animate={{ scaleY: 1 }}
								>
									{source ? (
										<SyntaxContainer defaultTab={componentName}>
											<Syntax
												id={componentName}
												filename={`${componentName}.tsx`}
												showLineNumbers={true}
											>
												{source}
											</Syntax>
										</SyntaxContainer>
									) : (
										<div className="p-4 text-center text-muted-foreground">
											Source code not available
										</div>
									)}
								</motion.div>
							) : (
								<motion.div
									className="rounded-lg bg-background p-6 shadow-sm"
									transition={{ type: "spring", stiffness: 300 }}
								>
									<Example />
								</motion.div>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default Playground;
