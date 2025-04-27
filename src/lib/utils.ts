import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple class names into a single string
 * Uses clsx for conditional classes and twMerge for Tailwind class deduplication
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}