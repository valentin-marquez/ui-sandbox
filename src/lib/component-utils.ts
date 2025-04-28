import type { ComponentMetadata } from "@/types/component";
import { componentRegistry } from "./component-registry";

export async function getComponentMetadata(name?: string) {
	// If a specific component name is provided
	if (name) {
		try {
			const entry = componentRegistry[name.toLowerCase()];
			return entry?.metadata || null;
		} catch (error) {
			console.error(`Failed to load metadata for component ${name}:`, error);
			return null;
		}
	}

	// If no name is provided, return metadata for all components
	try {
		const allMetadata: ComponentMetadata[] = [];

		for (const entry of Object.values(componentRegistry)) {
			if (entry.metadata) {
				allMetadata.push(entry.metadata);
			}
		}

		return allMetadata;
	} catch (error) {
		console.error("Failed to load metadata for components:", error);
		return [];
	}
}

/**
 * Gets the source code for a component
 * @param name The component name
 */
export async function getComponentSource(name: string): Promise<string | null> {
	try {
		const entry = componentRegistry[name.toLowerCase()];
		return entry?.source || null;
	} catch (error) {
		console.error(`Failed to load source for component ${name}:`, error);
		return null;
	}
}
