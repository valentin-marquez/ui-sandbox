import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import * as React from "react";

export function ModeToggle() {
	const [isDark, setIsDark] = React.useState<boolean>(false);

	// Initialize the state based on current theme
	React.useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains("dark");
		setIsDark(isDarkMode);
	}, []);

	// Toggle theme function
	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);

		// Toggle dark class on document
		document.documentElement.classList.toggle("dark");

		// Save preference to localStorage
		localStorage.setItem("theme", newIsDark ? "dark" : "light");
	};

	return (
		<Button
			variant="outline"
			size="icon"
			className="rounded-full"
			onClick={toggleTheme}
			aria-label="Toggle theme"
		>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
