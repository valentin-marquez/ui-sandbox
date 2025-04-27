/**
 * Component Registry
 *
 * This file contains mappings for all UI components in the system.
 * Instead of using dynamic imports with variable paths, we explicitly
 * import each component module and store it in a mapping.
 */

// Import all component modules here
import * as buttonModule from "@/components/ui/button";
// Add other components as needed:
// import * as cardModule from '@/components/ui/card';
// import * as dialogModule from '@/components/ui/dialog';
// etc.

// Type for component modules
export type ComponentModule = typeof buttonModule;

// Component registry mapping
export const componentRegistry: Record<string, ComponentModule> = {
	button: buttonModule,
	// Add other components as they're created:
	// 'card': cardModule,
	// 'dialog': dialogModule,
	// etc.
};

/**
 * Retrieves a component module by name
 * @param name The component name
 * @returns The component module or undefined if not found
 */
export function getComponentModule(name: string): ComponentModule | undefined {
	const normalizedName = name.toLowerCase();
	return componentRegistry[normalizedName];
}
