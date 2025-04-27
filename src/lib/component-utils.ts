import { componentRegistry } from './component-registry';
import type { ComponentMetadata } from '@/types/component';

export async function getComponentMetadata(name?: string) {
  // If a specific component name is provided
  if (name) {
    try {
      const module = componentRegistry[name.toLowerCase()];
      if (!module) {
        return null;
      }
      return module.metadata ? module.metadata() : null;
    } catch (error) {
      console.error(`Failed to load metadata for component ${name}:`, error);
      return null;
    }
  }
  
  // If no name is provided, return metadata for all components
  try {
    const allMetadata: ComponentMetadata[] = [];
    
    for (const [name, module] of Object.entries(componentRegistry)) {
      if (module.metadata) {
        const metadata = module.metadata();
        if (metadata) {
          allMetadata.push(metadata);
        }
      }
    }
    
    return allMetadata;
  } catch (error) {
    console.error("Failed to load metadata for components:", error);
    return [];
  }
}
