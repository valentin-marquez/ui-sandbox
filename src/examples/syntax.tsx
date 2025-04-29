// Example of how to use the new tabbed syntax highlighting component

import { Syntax, SyntaxContainer } from "@/components/ui/syntax";
import React from "react";

const SyntaxExample = () => {
	// Example code snippets
	const buttonCode = `import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "disabled:opacity-50 disabled:pointer-events-none",
          // Variant styles
          variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === 'destructive' && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          variant === 'outline' && "border border-input hover:bg-accent hover:text-accent-foreground",
          // Size styles
          size === 'default' && "h-10 py-2 px-4",
          size === 'sm' && "h-9 px-3",
          size === 'lg' && "h-11 px-8",
          size === 'icon' && "h-10 w-10",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)`;

	const cardCode = `import React from 'react';
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

export { Card, CardHeader, CardTitle };`;

	const scriptCode = `// Simple JavaScript example
let hello = "hello brightness"
console.log(hello, "my old friend")

// Function to calculate fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

// Using the function
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci \${i}: \${fibonacci(i)}\`);
}`;

	return (
		<div className="space-y-8 p-4">
			<h1 className="text-2xl font-bold">Code Examples</h1>

			{/* Example 1: Single syntax block */}
			<div>
				<h2 className="text-xl font-semibold mb-2">Simple Code Block</h2>
				<Syntax filename="shiny.js">{scriptCode}</Syntax>
			</div>

			{/* Example 2: Multiple syntax blocks in tabs */}
			<div>
				<h2 className="mb-2 font-semibold text-xl">Component Library</h2>
				<SyntaxContainer defaultTab="button">
					<Syntax id="button" filename="button.tsx">
						{buttonCode}
					</Syntax>
					<Syntax id="card" filename="card.tsx">
						{cardCode}
					</Syntax>
				</SyntaxContainer>
			</div>
		</div>
	);
};

export default SyntaxExample;
