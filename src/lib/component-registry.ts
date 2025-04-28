/**
 * Component Registry
 *
 * This file contains mappings for all UI components in the system.
 * Each component has its implementation, example, metadata, and source code.
 */

import * as buttonModule from "@/components/ui/button";
import ButtonExample from "@/examples/button";
import { metadata as buttonMetadata } from "@/metadata/button";
import type { ComponentMetadata } from "@/types/component";

// Import raw source code using Vite's ?raw feature
// Note: This is needed in Vite to get the raw source as a string
import buttonSource from "@/components/ui/button.tsx?raw";

// Define the structure for a component entry in the registry
export interface ComponentEntry {
	// The component module itself
	component: Record<string, unknown>;
	// The example React component
	example: React.ComponentType;
	// Component metadata
	metadata: ComponentMetadata;
	// Source code as a string
	source: string;
}

// Component registry that brings everything together
export const componentRegistry: Record<string, ComponentEntry> = {
	button: {
		component: buttonModule,
		example: ButtonExample,
		metadata: buttonMetadata,
		source: buttonSource,
	},
	// Add other components following the same pattern
};

/**
 * Retrieves a component entry by name
 * @param name The component name
 * @returns The component entry or undefined if not found
 */
export function getComponentModule(name: string): ComponentEntry | undefined {
	const normalizedName = name.toLowerCase();
	return componentRegistry[normalizedName];
}

/**
 * Gets the source code for a component
 * @param name The component name
 * @returns The source code as a string or null if not found
 */
export function getComponentSource(name: string): string | null {
	const entry = getComponentModule(name);
	return entry?.source || null;
}
