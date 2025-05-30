import { Express } from "express";

export interface Plugin {
  /** Unique name of the plugin */
  name: string;

  /** Version of the plugin */
  version: string;

  /** Plugin dependencies that must be loaded before this plugin */
  dependencies?: string[];

  /** Register the plugin with the Express app */
  register(app: Express, config: any): Promise<void> | void;
}

export abstract class BasePlugin implements Plugin {
  abstract readonly name: string;
  abstract readonly version: string;

  dependencies?: string[];

  async register(app: Express, config: any): Promise<void> {
    await this.setup(config);
    this.registerMiddleware(app);
    this.registerRoutes(app);
    this.registerErrorHandlers(app);
  }

  /**
   * Setup the plugin with configuration
   */
  protected abstract setup(config: any): Promise<void> | void;

  /**
   * Register middleware for this plugin
   */
  protected registerMiddleware(_app: Express): void {
    // Override in subclasses if needed
    console.log(`Registering middleware for plugin: ${this.name}`);
  }

  /**
   * Register routes for this plugin
   */
  protected registerRoutes(_app: Express): void {
    // Override in subclasses if needed
    console.log(`Registering routes for plugin: ${this.name}`);
  }

  /**
   * Register error handlers for this plugin
   */
  protected registerErrorHandlers(_app: Express): void {
    // Override in subclasses if needed
    console.log(`Registering error handlers for plugin: ${this.name}`);
  }
}
