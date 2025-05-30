import { Express } from "express";

// Plugin interface
export interface Plugin {
  name: string;
  version: string;
  dependencies?: string[];
  register(app: Express, config: any): Promise<void> | void;
}

// Plugin metadata
export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
  dependencies?: string[];
  peerDependencies?: string[];
  repository?: string;
  license?: string;
}

// Plugin configuration
export interface PluginConfig {
  enabled?: boolean;
  config?: any;
  loadOrder?: number;
}

// Plugin registry
export interface PluginRegistry {
  plugins: Map<string, Plugin>;
  register(plugin: Plugin): void;
  unregister(name: string): void;
  get(name: string): Plugin | undefined;
  list(): Plugin[];
}
