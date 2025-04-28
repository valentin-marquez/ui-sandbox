/**
 * Component Registry
 *
 * This file contains mappings for all UI components in the system.
 * Each component has its implementation, example, metadata, and source code.
 */

// Button component imports
import * as buttonModule from "@/components/ui/button";
import buttonSource from "@/components/ui/button.tsx?raw";
import buttonExample from "@/examples/button";
import { metadata as buttonMetadata } from "@/metadata/button";

// Syntax component imports
import * as syntaxModule from "@/components/ui/syntax";
import syntaxSource from "@/components/ui/syntax.tsx?raw";
import syntaxExample from "@/examples/syntax";
import { metadata as syntaxMetadata } from "@/metadata/syntax";

// Types
import type { ComponentMetadata } from "@/types/component";

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
		example: buttonExample,
		metadata: buttonMetadata,
		source: buttonSource,
	},
	syntax: {
		component: syntaxModule,
		example: syntaxExample,
		metadata: syntaxMetadata,
		source: syntaxSource,
	},
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
