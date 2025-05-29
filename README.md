# mono-workspace

A modern TypeScript monorepo with unified development tooling, shared component libraries, and TypeScript Project References for optimal build performance.

## 🚀 Quick Start

**New to this monorepo?** Check out [`QUICK_START.md`](./QUICK_START.md) for essential commands and workflow tips!

## ✨ Key Features

- 🏗️ **Yarn Workspaces**: Efficient dependency management and linking
- 🎯 **Unified Linting**: Shared ESLint + Prettier configuration across all packages
- ⚡ **Modern Stack**: React 19, TypeScript, Vite, ESLint 9
- 🔧 **VS Code Integration**: Auto-format and auto-fix on save
- 📦 **Shared Components**: Reusable UI components via `@mono/ui`
- 🚀 **Development Ready**: Hot reload, TypeScript checking, and instant feedback
- 📐 **Consistent Styling**: Unified code formatting rules across the entire codebase
- ⚡ **TypeScript Project References**: Faster builds with incremental compilation
- 🎯 **Shared Types**: Centralized type definitions with `@mono/types` package

## 📁 Repository Structure

```
mono-workspace/
├── apps/                           # Applications
│   └── test-app/                   # React app with Vite
│       ├── src/                    # React components and pages
│       ├── eslint.config.js        # App-specific ESLint config
│       ├── prettier.config.js     # Prettier configuration
│       ├── vite.config.ts         # Vite build configuration
│       ├── tsconfig.json          # TypeScript configuration with project references
│       └── package.json           # App dependencies and scripts
├── packages/                       # Shared packages
│   ├── types/                     # Shared TypeScript types and interfaces
│   │   ├── src/
│   │   │   ├── index.ts           # Common base types (ID, User, ApiResponse, etc.)
│   │   │   ├── app.ts             # App-specific types (AppState, AppConfig)
│   │   │   └── ui/                # UI component types (folder-based)
│   │   │       ├── index.ts       # UI types barrel export
│   │   │       └── button.ts      # Button component types
│   │   ├── tsconfig.json          # Types package TypeScript config
│   │   └── package.json           # Types package configuration
│   ├── ui/                        # Shared React UI components
│   │   ├── index.tsx              # Component exports
│   │   ├── eslint.config.js       # Package ESLint config
│   │   ├── tsconfig.json          # UI package TypeScript config
│   │   └── package.json           # Component library config
│   └── config/                    # Configuration packages
│       └── eslint-config-custom/  # Shared ESLint/Prettier config
│           ├── index.js           # Base config for Node.js
│           ├── react.js           # React-specific config
│           ├── prettier.config.js # Prettier rules
│           └── package.json       # Config package setup
├── .vscode/                       # VS Code workspace settings
│   ├── settings.json              # Auto-format and lint on save
│   └── extensions.json            # Recommended extensions
├── tsconfig.json                  # Root TypeScript config with project references
├── tsconfig.base.json             # Base TypeScript configuration
├── package.json                   # Workspace configuration
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Yarn** 4.9.1+ (specified in `packageManager`)

### Installation

```bash
# Clone the repository
git clone git@github.com:ThriledLokki983/mono-workspace.git
cd mono-workspace

# Install all dependencies
yarn install

# Build TypeScript projects (recommended first time)
yarn build

# Start the development server
yarn dev
```

## 🎯 TypeScript Project References

This monorepo uses TypeScript Project References for optimal build performance and better development experience.

### Key Benefits

- ⚡ **Faster Builds**: Incremental compilation with project references
- 🛡️ **Better Type Safety**: Shared types ensure consistency across packages
- 🔧 **Developer Experience**: IntelliSense and auto-completion work across packages
- 🧹 **Maintainability**: Centralized type definitions with minimal duplication
- 📈 **Scalability**: Easy to add new types and packages as needed

### Build Commands

```bash
# Build all TypeScript projects
yarn build

# Build with watch mode for development
yarn build:watch

# Clean all build artifacts and rebuild
yarn build:clean && yarn build
```

## 📦 Workspace Packages

### Applications (`apps/`)

#### `test-app`

- **Type**: React application
- **Framework**: Vite + React 19 + TypeScript
- **Features**: Modern React development with SWC
- **Usage**: `yarn workspace test-app dev`

### Shared Packages (`packages/`)

#### `@mono/types`

- **Type**: Shared TypeScript types and interfaces
- **Purpose**: Centralized type definitions for the entire monorepo
- **Structure**: Folder-based organization (`ui/button.ts`, `app.ts`, etc.)
- **Usage**: `import type { ButtonProps } from '@mono/types/ui'`

#### `@mono/ui`

- **Type**: React component library
- **Purpose**: Shared UI components across applications
- **Dependencies**: Uses types from `@mono/types`
- **Exports**: Button component (example)
- **Usage**: `import { Button } from '@mono/ui'`

#### `@mono/eslint-config-custom`

- **Type**: Configuration package
- **Purpose**: Unified ESLint and Prettier rules
- **Configs**: Base (Node.js) and React variants
- **Usage**: `import config from '@mono/eslint-config-custom'`

## 🛠️ Development Tools

### Unified ESLint + Prettier Configuration

All packages share consistent code quality and formatting rules through `@mono/eslint-config-custom`.

#### For React Applications:

```javascript
// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactConfig from "@mono/eslint-config-custom/react";

export default tseslint.config(
  { ignores: ["dist"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...reactConfig,
  }
);
```

#### For Node.js Packages:

```javascript
// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import baseConfig from "@mono/eslint-config-custom";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...baseConfig,
  }
);
```

#### Prettier Integration:

```javascript
// prettier.config.js
export { default } from "@mono/eslint-config-custom/prettier.config.js";
```

### VS Code Integration

The workspace is pre-configured for optimal development experience:

- **Auto-format on save** with Prettier
- **Auto-fix ESLint issues** on save
- **Consistent formatting** across all files
- **Working directories** configured for each package

**Recommended Extensions:**

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier - Code formatter (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- TypeScript and JavaScript Language Features (`ms-vscode.vscode-typescript-next`)

> Extensions are automatically suggested when you open the workspace. Install them for the best development experience.

## 📦 Shared Types (`@mono/types`)

The `@mono/types` package provides centralized TypeScript type definitions using a folder-based organization approach.

### Current Type Definitions

#### Base Types (`src/index.ts`)

- `ID`, `BaseEntity`, `User` - Basic entity types
- `ApiResponse<T>`, `ApiError` - API response types
- `Environment`, `ThemeMode` - Configuration types
- `DeepPartial<T>` - Utility type

#### App Types (`src/app.ts`)

- `AppState` - Application state interface
- `AppConfig` - Application configuration
- `LoadingState`, `AsyncState<T>` - Loading state management

#### UI Types (`src/ui/button.ts`)

- `BaseComponentProps` - Common component props
- `ButtonVariant`, `ButtonSize` - Button styling types
- `ButtonProps` - Complete button component interface

### Usage Examples

#### Importing Types in UI Components

```typescript
import type { ButtonProps } from "@mono/types/ui";
```

#### Importing Types in Apps

```typescript
import type { AppState, User } from "@mono/types";
import type { ButtonProps } from "@mono/types/ui";
```

### Adding New Types

#### For UI Components

1. Create new file: `packages/types/src/ui/[component].ts`
2. Export from `packages/types/src/ui/index.ts`
3. Use in packages: `import type { ComponentProps } from '@mono/types/ui'`

#### For App-Specific Types

1. Add to `packages/types/src/app.ts` or create new app-specific file
2. Export from main index if needed
3. Use in apps: `import type { TypeName } from '@mono/types'`

## 📜 Available Scripts

### Workspace-level Commands

```bash
# Install all dependencies
yarn install

# Build all TypeScript projects
yarn build

# Build with watch mode
yarn build:watch

# Clean and rebuild
yarn build:clean && yarn build

# Start development server
yarn dev

# Run linting across all packages
yarn lint

# Auto-fix linting issues
yarn lint:fix

# Format all packages
yarn format

# Check formatting across all packages
yarn format:check
```

### Package-specific Commands

```bash
# Development
yarn workspace test-app dev          # Start React app dev server
yarn workspace test-app build        # Build React app for production
yarn workspace test-app preview      # Preview production build

# Code Quality
yarn workspace test-app lint          # Check for linting issues
yarn workspace test-app lint:fix      # Auto-fix linting issues
yarn workspace test-app format        # Format code with Prettier
yarn workspace test-app format:check  # Check code formatting

# UI Package
yarn workspace @mono/ui lint          # Lint UI components
yarn workspace @mono/ui format        # Format UI components

# Configuration Package
yarn workspace @mono/eslint-config-custom lint    # Lint config files
yarn workspace @mono/eslint-config-custom format  # Format config files
```

## 🏗️ Architecture

### Monorepo Benefits

- **Shared Dependencies**: Common tools and configurations
- **Cross-package Imports**: Direct imports between packages
- **Unified CI/CD**: Single repository for all projects
- **Consistent Standards**: Shared linting and formatting rules

### Package Dependencies

```
test-app (React App)
├── @mono/types (Shared Types)
├── @mono/ui (UI Components)
├── @mono/eslint-config-custom (Linting)
├── React 19
└── Vite

@mono/ui (UI Components)
├── @mono/types (Shared Types)
├── @mono/eslint-config-custom (Linting)
├── React
└── TypeScript

@mono/types (Shared Types)
├── @mono/eslint-config-custom (Linting)
└── TypeScript

@mono/eslint-config-custom (Config)
├── ESLint 9
├── Prettier 3
├── TypeScript ESLint
└── React-specific plugins
```

## 🔧 Code Quality Features

- ✅ **TypeScript Support**: Full type checking and IntelliSense
- ✅ **Project References**: Incremental builds and faster compilation
- ✅ **Shared Types**: Centralized type definitions across packages
- ✅ **ESLint Integration**: Code quality and error detection
- ✅ **Prettier Formatting**: Consistent code style
- ✅ **Auto-fixing**: Automatic code corrections on save
- ✅ **Import Sorting**: Organized import statements
- ✅ **React Rules**: React-specific linting (hooks, JSX)
- ✅ **Unused Variables**: Detection with underscore prefix pattern

## 🚦 Adding New Packages

### Create a New App

```bash
# Create new app directory
mkdir apps/my-new-app
cd apps/my-new-app

# Initialize package.json
yarn init

# Add shared dependencies
yarn add -D @mono/eslint-config-custom @mono/types eslint prettier typescript
yarn add @mono/ui

# Create TypeScript configuration with project references
# (Follow examples from test-app)
```

### Create a New Package

```bash
# Create new package directory
mkdir packages/my-new-package
cd packages/my-new-package

# Initialize package.json with @mono scope
yarn init --scope=@mono

# Add shared tooling and types
yarn add -D @mono/eslint-config-custom @mono/types eslint prettier typescript
```

## 🔄 Workflow

1. **Development**: Use VS Code with auto-format on save
2. **Type Safety**: Import shared types from `@mono/types`
3. **Code Quality**: ESLint catches issues, Prettier formats code
4. **Cross-package**: Import UI components from `@mono/ui`
5. **Building**: TypeScript project references enable incremental builds
6. **Consistency**: Shared rules ensure uniform code style

## 📝 Contributing

1. Follow the established ESLint and Prettier configurations
2. Use TypeScript for all new code
3. Import shared types from `@mono/types` instead of duplicating
4. Add shared components to `@mono/ui`
5. Update type definitions when adding new interfaces
6. Test changes across affected packages
7. Ensure all linting and formatting checks pass
8. Run `yarn build` to verify TypeScript compilation

## 🔍 Troubleshooting

### TypeScript Issues

```bash
# Build all projects with clean slate
yarn build:clean && yarn build

# Check TypeScript configuration
npx tsc --showConfig

# Verify project references
npx tsc -b --listFiles
```

### ESLint Issues

```bash
# Clear ESLint cache
yarn workspace <package-name> run lint --cache-location node_modules/.cache/eslint/

# Check ESLint configuration
yarn workspace <package-name> run lint --print-config src/index.ts
```

### Yarn Workspace Issues

```bash
# Reinstall all dependencies
yarn install --force

# Check workspace dependencies
yarn workspaces list

# Clear Yarn cache
yarn cache clean
```

### VS Code Issues

- Restart TypeScript server: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- Reload window: `Cmd+Shift+P` → "Developer: Reload Window"
- Check ESLint output: `View` → `Output` → Select "ESLint" from dropdown

---

**Author**: Gideon Nimoh  
**License**: MIT  
**Package Manager**: Yarn 4.9.1

### Dependency Constraints

The ESLint configuration enforces strict architectural rules to maintain a clean monorepo structure:

#### **Apps Cannot Import from Other Apps**

```typescript
// ❌ This will trigger an ESLint error
import { SomeComponent } from "../../faithcirce/components/SomeComponent";

// ✅ Use shared packages instead
import { SomeComponent } from "@mono/ui";
```

#### **Packages Cannot Import from Apps**

```typescript
// ❌ This will trigger an ESLint error in any package
import { AppSpecificFunction } from "../../apps/test-app/utils";

// ✅ Keep packages independent - move shared code to packages
import { SharedFunction } from "@mono/types";
```

#### **Enforced Rules**

- `apps/faithcirce` ↛ `apps/huishelder`, `apps/test-app`
- `apps/huishelder` ↛ `apps/faithcirce`, `apps/test-app`
- `apps/test-app` ↛ `apps/faithcirce`, `apps/huishelder`
- `packages/**` ↛ `apps/**`

These constraints ensure:

- **Clear separation of concerns** between applications
- **Reusable packages** that don't depend on specific apps
- **Scalable architecture** as the monorepo grows
- **Easier testing and deployment** with independent applications
