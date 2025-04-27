import { getComponentModule } from "./component-registry";

export async function getComponentMetadata(name: string) {
	try {
		const module = getComponentModule(name);
		if (!module) {
			return null;
		}
		return module.metadata ? module.metadata() : null;
	} catch (error) {
		console.error(`Failed to load metadata for component ${name}:`, error);
		return null;
	}
}
