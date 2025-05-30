import "reflect-metadata";
import express, { Express, RequestHandler } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import morgan from "morgan";
import { Logger } from "./logging/Logger";
import { Plugin } from "./plugins/Plugin";
import { AppConfig, RateLimitConfig } from "@mono-workspace/be-types";

export class BaseApp {
  private app: Express;
  private plugins: Plugin[] = [];
  private logger: Logger;

  constructor(private config: AppConfig) {
    this.app = express();
    this.logger = Logger.create(config.logging || {});
    this.initializeCore();
  }

  /**
   * Add a plugin to the application
   */
  use(plugin: Plugin): this {
    this.plugins.push(plugin);
    return this;
  }

  /**
   * Get the Express application instance
   */
  getApp(): Express {
    return this.app;
  }

  /**
   * Start the application server
   */
  async start(): Promise<void> {
    try {
      await this.initializePlugins();
      await this.listen();
    } catch (error) {
      this.logger.error(error as Error, { context: "BaseApp.start" });
      process.exit(1);
    }
  }

  /**
   * Initialize core middleware that should always be present
   */
  private initializeCore(): void {
    // Security middleware
    this.app.use(helmet() as unknown as RequestHandler);
    this.app.use(hpp() as unknown as RequestHandler);

    // Performance middleware
    this.app.use(compression() as unknown as RequestHandler);

    // CORS configuration
    if (this.config.cors) {
      this.app.use(cors(this.config.cors));
    }

    // Rate limiting
    if (this.config.rateLimit) {
      this.app.use(this.createRateLimit(this.config.rateLimit));
    }

    // Logging
    if (this.config.logging?.httpLogging !== false) {
      this.app.use(
        morgan("combined", {
          stream: { write: (message) => this.logger.info(message.trim()) },
        })
      );
    }

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  /**
   * Initialize all registered plugins
   */
  private async initializePlugins(): Promise<void> {
    // Sort plugins by priority if they have dependencies
    const sortedPlugins = this.sortPluginsByDependencies();

    for (const plugin of sortedPlugins) {
      try {
        this.logger.info(
          `Initializing plugin: ${plugin.name}@${plugin.version}`
        );
        await plugin.register(this.app, this.config);
        this.logger.info(`Plugin initialized successfully: ${plugin.name}`);
      } catch (error) {
        this.logger.error(error as Error, {
          context: "BaseApp.initializePlugins",
          plugin: plugin.name,
        });
        throw new Error(`Failed to initialize plugin: ${plugin.name}`);
      }
    }
  }

  /**
   * Sort plugins based on their dependencies
   */
  private sortPluginsByDependencies(): Plugin[] {
    // Simple topological sort for plugin dependencies
    const sorted: Plugin[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (plugin: Plugin) => {
      if (visiting.has(plugin.name)) {
        throw new Error(
          `Circular dependency detected in plugin: ${plugin.name}`
        );
      }
      if (visited.has(plugin.name)) {
        return;
      }

      visiting.add(plugin.name);

      // Visit dependencies first
      if (plugin.dependencies) {
        for (const depName of plugin.dependencies) {
          const depPlugin = this.plugins.find((p) => p.name === depName);
          if (depPlugin) {
            visit(depPlugin);
          }
        }
      }

      visiting.delete(plugin.name);
      visited.add(plugin.name);
      sorted.push(plugin);
    };

    for (const plugin of this.plugins) {
      visit(plugin);
    }

    return sorted;
  }

  /**
   * Create rate limiting middleware
   */
  private createRateLimit(config: RateLimitConfig): RequestHandler {
    return rateLimit({
      windowMs: config.windowMs || 15 * 60 * 1000, // 15 minutes
      max: config.max || 100, // limit each IP to 100 requests per windowMs
      message: config.message || "Too many requests from this IP",
      standardHeaders: true,
      legacyHeaders: false,
      ...config,
    });
  }

  /**
   * Start listening on the configured port
   */
  private async listen(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.config.port, () => {
        this.logger.info(
          `🚀 ${this.config.name} listening on port ${this.config.port}`
        );
        this.logger.info(`Environment: ${this.config.environment}`);
        resolve();
      });
    });
  }
}
