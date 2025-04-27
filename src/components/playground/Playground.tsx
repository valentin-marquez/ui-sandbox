import React, { Suspense, useEffect, useState } from 'react';
import type { ComponentMetadata } from '@/types/component';
import { DotPattern } from '@/components/ui/dot-pattern';

interface PlaygroundProps {
  componentName: string;
}

const Playground: React.FC<PlaygroundProps> = ({ componentName }) => {
  const [Example, setExample] = useState<React.ComponentType | null>(null);
  const [metadata, setMetadata] = useState<ComponentMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Convert componentName to lowercase for the import path
        const moduleName = componentName.toLowerCase();
        // Dynamic import for the component module
        const module = await import(`../../components/ui/${moduleName}`);
        
        // Get the example function from the module
        const ExampleComponent = module.example;
        const componentMetadata = module.metadata ? module.metadata() : null;
        
        if (ExampleComponent) {
          setExample(() => ExampleComponent);
          setMetadata(componentMetadata);
          setError(null);
        } else {
          setError(`Example not found for component: ${componentName}`);
        }
      } catch (err) {
        console.error("Failed to load component:", err);
        setError(`Could not load component: ${componentName}`);
      }
    };

    if (componentName) {
      loadComponent();
    }
  }, [componentName]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-destructive">
        <p className="text-lg font-medium mb-2">Error Loading Component</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!Example) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-muted-foreground">Loading component...</div>
      </div>
    );
  }

  return (
    <div className="relative p-8 min-h-[600px] flex flex-col items-center overflow-hidden">
      {/* Dot pattern background */}
      
      <DotPattern dotColor="var(--border)" />
      <div className="relative w-full max-w-3xl mx-auto bg-background shadow-lg rounded-xl overflow-hidden">
        {metadata && (
          <div className="px-8 py-6 border-b border-border bg-muted/30">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">{metadata.name}</h1>
              <span className={`text-sm px-3 py-1 rounded-full ${
                metadata.status === 'completed' ? 'bg-primary/20 text-primary' :
                metadata.status === 'in-progress' ? 'bg-chart-4/20 text-chart-4' :
                'bg-muted text-muted-foreground'
              }`}>
                {metadata.status}
              </span>
            </div>
            <p className="text-muted-foreground">{metadata.description}</p>
            {metadata.author && (
              <p className="text-sm text-muted-foreground mt-2">
                By {metadata.author} • Last updated: {metadata.lastUpdated || 'unknown'}
              </p>
            )}
          </div>
        )}
        
        <div className="p-8 backdrop-blur-sm flex items-center justify-center">
          <div className="w-full py-4">
            <Example />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
