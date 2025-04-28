import { ModeToggle } from "@/components/theme/mode-toggle";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import type React from "react";
import { useEffect, useState } from "react";

interface HeaderProps {
	className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
	const { scrollY } = useScroll();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useMotionValueEvent(scrollY, "change", (latest) => {
		// Determine if we're scrolling up or down
		const isScrollingDown = latest > lastScrollY;
		const scrollDelta = Math.abs(latest - lastScrollY);

		// Update header visibility and compact state based on scroll
		if (latest > 50) {
			setIsScrolled(true);

			// Only hide header when scrolling down and after certain threshold
			if (isScrollingDown && scrollDelta > 10 && latest > 150) {
				setIsVisible(false);
			} else if (!isScrollingDown && scrollDelta > 10) {
				setIsVisible(true);
			}
		} else {
			setIsScrolled(false);
			setIsVisible(true);
		}

		setLastScrollY(latest);
	});

	// Menu items with animated underline
	const MenuItem = ({
		href,
		children,
	}: { href: string; children: React.ReactNode }) => {
		const [isHovered, setIsHovered] = useState(false);
		const [isActive, setIsActive] = useState(false);

		useEffect(() => {
			// Check if current page matches link
			const pathname = window.location.pathname;
			setIsActive(
				pathname === href || (href !== "/" && pathname.startsWith(href)),
			);
		}, [href]);

		return (
			<li className="relative">
				<a
					href={href}
					className={cn(
						"px-2 py-1 transition-colors hover:text-primary",
						isActive && "font-medium text-primary",
					)}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					{children}

					{/* Animated underline */}
					<motion.div
						className="absolute bottom-0 left-0 h-0.5 bg-primary"
						initial={{ width: isActive ? "100%" : "0%" }}
						animate={{ width: isHovered || isActive ? "100%" : "0%" }}
						transition={{
							duration: 0.2,
							ease: [0.43, 0.13, 0.23, 0.96],
						}}
					/>
				</a>
			</li>
		);
	};

	return (
		<motion.header
			className={cn(
				"container fixed top-0 right-0 left-0 z-50 mx-auto w-full rounded-b-lg border-2 border-border backdrop-blur-sm transition-all",
				isScrolled ? "border-b bg-background/90" : "bg-transparent",
				className,
			)}
			initial={{ y: 0 }}
			animate={{ y: isVisible ? 0 : -100 }}
			transition={{
				duration: 0.3,
				ease: [0.1, 0.9, 0.2, 1],
			}}
		>
			<div className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					<motion.a
						href="/"
						className="flex items-center gap-2 font-bold text-xl transition-colors hover:text-primary"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
					>
						<img src="/favicon.svg" alt="UI Sandbox Logo" className="size-6" />
						<span>UI Sandbox</span>
					</motion.a>

					<div className="flex items-center gap-6">
						<nav>
							<ul className="flex items-center gap-6">
								<MenuItem href="/">Home</MenuItem>
								<MenuItem href="/playground">Components</MenuItem>
							</ul>
						</nav>

						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<ModeToggle />
						</motion.div>
					</div>
				</div>
			</div>
		</motion.header>
	);
};

export default Header;
