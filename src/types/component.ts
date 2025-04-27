export type ComponentStatus = 'completed' | 'in-progress' | 'planned';

export interface ComponentMetadata {
  name: string;
  description: string;
  status: ComponentStatus;
  author?: string;
  lastUpdated?: string;
}
