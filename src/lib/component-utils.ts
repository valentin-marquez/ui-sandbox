import type { ComponentMetadata } from '@/types/component';

/**
 * Get metadata for all available UI components
 */
export async function getComponentMetadata(): Promise<ComponentMetadata[]> {
  const components: ComponentMetadata[] = [];
  
  // In a real implementation, you'd dynamically discover components
  // For now, we'll manually list them
  try {
    // Import button component metadata
    const buttonModule = await import('@/components/ui/button');
    if (buttonModule.metadata) {
      components.push(buttonModule.metadata());
    }
    
    // Add more component imports here as you create them
    // Example:
    // const cardModule = await import('@/components/ui/card');
    // if (cardModule.metadata) {
    //   components.push(cardModule.metadata());
    // }
    
  } catch (error) {
    console.error("Error loading component metadata:", error);
  }
  
  return components;
}

/**
 * Get metadata for a specific component
 */
export async function getComponentMetadataByName(name: string): Promise<ComponentMetadata | null> {
  try {
    const moduleName = name.toLowerCase();
    const module = await import(`@/components/ui/${moduleName}`);
    return module.metadata ? module.metadata() : null;
  } catch (error) {
    console.error(`Error loading metadata for component ${name}:`, error);
    return null;
  }
}
