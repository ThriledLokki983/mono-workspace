# Backend Framework Implementation Guide

## 🚀 Quick Start: Phase 1 Implementation

This guide walks you through implementing Phase 1 of the backend transformation plan, creating a working example of the new framework.

## 📦 Step 1: Install Dependencies

First, install the new backend packages:

```bash
# From the workspace root
npm install

# Install workspace dependencies for the new packages
cd packages/be-core && npm install
cd ../be-types && npm install
```

## 🔧 Step 2: Build the Packages

```bash
# Build the shared packages
cd packages/be-types && npm run build
cd ../be-core && npm run build
```

## 📝 Step 3: Create Your First App Using the New Framework

Create a simple example service to demonstrate the new framework:

### 3.1 Create the App Directory

```bash
mkdir -p apps/be/example-service/src
cd apps/be/example-service
```

### 3.2 Create package.json

```json
{
  "name": "example-service",
  "version": "0.1.0",
  "description": "Example service using the new backend framework",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "test": "jest"
  },
  "dependencies": {
    "@mono-workspace/be-core": "workspace:*",
    "@mono-workspace/be-types": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "ts-node": "^10.9.0",
    "@types/node": "^20.0.0"
  }
}
```

### 3.3 Create TypeScript Configuration

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": [
    { "path": "../../../packages/be-core" },
    { "path": "../../../packages/be-types" }
  ]
}
```

### 3.4 Create Your App

```typescript
// apps/be/example-service/src/index.ts
import { BaseApp } from "@mono-workspace/be-core";
import { AppConfig } from "@mono-workspace/be-types";
import { ExamplePlugin } from "./plugins/ExamplePlugin";

const config: AppConfig = {
  name: "example-service",
  port: 3001,
  environment: (process.env.NODE_ENV as any) || "development",
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  logging: {
    level: "info",
    dir: "./logs",
  },
};

const app = new BaseApp(config).use(new ExamplePlugin());

app.start().catch(console.error);
```

### 3.5 Create an Example Plugin

```typescript
// apps/be/example-service/src/plugins/ExamplePlugin.ts
import { Router, Express } from "express";
import { BasePlugin } from "@mono-workspace/be-core";
import { ApiResponse } from "@mono-workspace/be-core";

export class ExamplePlugin extends BasePlugin {
  readonly name = "example";
  readonly version = "1.0.0";

  protected setup(): void {
    // Plugin setup logic
    console.log("Setting up Example Plugin");
  }

  protected registerRoutes(app: Express): void {
    const router = Router();

    // Health check endpoint
    router.get("/health", (req, res) => {
      ApiResponse.success(res, "Service is healthy", {
        service: "example-service",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      });
    });

    // Example API endpoints
    router.get("/users", (req, res) => {
      ApiResponse.success(res, "Users retrieved successfully", [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
      ]);
    });

    router.post("/users", (req, res) => {
      const { name, email } = req.body;

      if (!name || !email) {
        return ApiResponse.badRequest(res, "Name and email are required");
      }

      ApiResponse.created(res, "User created successfully", {
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        createdAt: new Date().toISOString(),
      });
    });

    // Mount the routes
    app.use("/api", router);
  }
}
```

## 🧪 Step 4: Test Your App

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

Your service should start on port 3001. You can test the endpoints:

```bash
# Health check
curl http://localhost:3001/api/health

# Get users
curl http://localhost:3001/api/users

# Create user
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com"}'
```

## 🔄 Step 5: Migrate faithcircle-be (Gradual Approach)

Instead of a complete rewrite, we'll gradually migrate faithcircle-be:

### 5.1 Update Dependencies

First, add the new framework packages to faithcircle-be:

```json
// apps/be/faithcircle-be/package.json (add to dependencies)
{
  "dependencies": {
    "@mono-workspace/be-core": "workspace:*",
    "@mono-workspace/be-types": "workspace:*"
    // ... existing dependencies
  }
}
```

### 5.2 Create a Compatibility Layer

```typescript
// apps/be/faithcircle-be/src/compat/LegacyAppWrapper.ts
import { BaseApp } from "@mono-workspace/be-core";
import { AppConfig } from "@mono-workspace/be-types";
import { Express } from "express";

export class LegacyAppWrapper {
  private baseApp: BaseApp;

  constructor(config: AppConfig) {
    this.baseApp = new BaseApp(config);
  }

  /**
   * Get the Express app to add legacy routes
   */
  getExpressApp(): Express {
    return this.baseApp.getApp();
  }

  /**
   * Start the application
   */
  async start(): Promise<void> {
    return this.baseApp.start();
  }

  /**
   * Add legacy middleware and routes
   */
  addLegacyRoutes(setupFunction: (app: Express) => void): this {
    setupFunction(this.baseApp.getApp());
    return this;
  }
}
```

### 5.3 Gradually Migrate App.ts

```typescript
// apps/be/faithcircle-be/src/app.ts (modified)
import "reflect-metadata";
import { LegacyAppWrapper } from "./compat/LegacyAppWrapper";
import { AppConfig } from "@mono-workspace/be-types";
import { Routes } from "@interfaces/routes.interface";
import { ErrorMiddleware } from "@middlewares/error.middleware";
// ... other imports

const config: AppConfig = {
  name: "faithcircle-be",
  port: parseInt(process.env.PORT || "5555"),
  environment: (process.env.NODE_ENV as any) || "development",
  cors: {
    origin: process.env.ORIGIN,
    credentials: true,
  },
  logging: {
    level: "info",
    dir: "./logs",
  },
};

export class App {
  private wrapper: LegacyAppWrapper;
  private app: express.Application;

  constructor(routes: Routes[]) {
    this.wrapper = new LegacyAppWrapper(config);
    this.app = this.wrapper.getExpressApp();

    // Add existing functionality gradually
    this.initializeLegacyRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  // ... rest of the existing methods with minimal changes

  public async listen() {
    await this.connectDatabase();
    return this.wrapper.start();
  }
}
```

## 📋 Next Steps Checklist

### Phase 1 Complete ✅

- [x] Created `@mono-workspace/be-core` package
- [x] Created `@mono-workspace/be-types` package
- [x] Implemented BaseApp class with plugin architecture
- [x] Created example service
- [x] Provided migration strategy for faithcircle-be

### Phase 2: Enhanced Features

- [ ] Create `@mono-workspace/be-database` package
- [ ] Create `@mono-workspace/be-auth` package
- [ ] Add database connection management
- [ ] Add JWT authentication plugin
- [ ] Create migration utilities

### Phase 3: Developer Experience

- [ ] Create `@mono-workspace/be-cli` package
- [ ] Build app generation CLI tool
- [ ] Create shared testing utilities
- [ ] Add comprehensive documentation

## 🎯 Benefits Already Achieved

1. **Rapid Development**: New services can be created in minutes
2. **Consistency**: All apps use the same base framework
3. **Plugin Architecture**: Easy to extend and customize
4. **Modern Patterns**: Clean separation of concerns
5. **Type Safety**: Full TypeScript support
6. **Backward Compatibility**: Legacy apps can migrate gradually

## 🔧 Troubleshooting

### Common Issues

1. **TypeScript Reference Errors**: Ensure packages are built before using them
2. **Import Errors**: Check that workspace dependencies are properly installed
3. **Port Conflicts**: Make sure each service uses a unique port

### Debug Commands

```bash
# Check workspace status
npm run build --workspaces

# Verify package linking
npm ls @mono-workspace/be-core

# Check TypeScript references
npx tsc --build --verbose
```

---

**This implementation provides a solid foundation for the backend framework while maintaining compatibility with existing applications. Each phase builds upon the previous one, ensuring a smooth transition process.**
