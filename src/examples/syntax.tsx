import { Syntax, SyntaxContainer } from "@/components/ui/syntax";
import React from "react";

const SyntaxExample = () => {
	const codeExamples = {
		button: {
			filename: "button.tsx",
			code: `import React from 'react';
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
      variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90",
      variant === 'destructive' && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      variant === 'outline' && "border border-input hover:bg-accent hover:text-accent-foreground",
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
)`,
		},
		card: {
			filename: "card.tsx",
			code: `import React from 'react';
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

export { Card, CardHeader, CardTitle };`,
		},
		script: {
			filename: "shiny.js",
			code: `let hello = "hello brightness"
console.log(hello, "my old friend")

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci \${i}: \${fibonacci(i)}\`);
}`,
		},
	};

	return (
		<div className="space-y-8 p-4">
			<h1 className="text-2xl font-bold">Code Examples</h1>

			<div>
				<h2 className="text-xl font-semibold mb-2">Simple Code Block</h2>
				<Syntax filename={codeExamples.script.filename}>
					{codeExamples.script.code}
				</Syntax>
			</div>

			<div>
				<h2 className="mb-2 font-semibold text-xl">Component Library</h2>
				<SyntaxContainer defaultTab="button">
					{Object.entries(codeExamples).map(([id, { filename, code }]) => (
						<Syntax key={id} id={id} filename={filename}>
							{code}
						</Syntax>
					))}
				</SyntaxContainer>
			</div>
		</div>
	);
};

export default SyntaxExample;
