# mono-workspace

A modern TypeScript monorepo with unified development tooling, shared component libraries, and TypeScript Project References for optimal build performance.

## 🚀 Quick Start

**New to this monorepo?** Check out [`QUICK_START.md`](./QUICK_START.md) for essential commands and workflow tips!

## ✨ Key Features

- 🏗️ **Yarn Workspaces**: Efficient dependency management and linking
- 🎯 **Unified Linting**: Shared ESLint + Prettier configuration across all packages
- ⚡ **Modern Stack**: React 19, TypeScript, Vite, ESLint 9
- 🔧 **VS Code Integration**: Auto-format and auto-fix on save
- 📦 **Shared Components**: Reusable UI components via `@mono/components` with React Aria
- ♿ **Accessibility First**: Components built with React Aria for WCAG 2.1 AA compliance
- 🚀 **Development Ready**: Hot reload, TypeScript checking, and instant feedback
- 📐 **Consistent Styling**: Unified code formatting rules across the entire codebase
- ⚡ **TypeScript Project References**: Faster builds with incremental compilation
- 🎯 **Shared Types**: Centralized type definitions with `@mono/types` package

## 📁 Repository Structure

```
mono-workspace/
├── apps/                           # Applications
│   ├── be/                         # Backend applications
│   └── fe/                         # Frontend applications
│       ├── faithcircle/            # Faith Circle application
│       └── test-app/               # React test app with Vite
│           ├── src/                # React components and pages
│           │   ├── AccessibilityDemo.tsx  # React Aria accessibility demo
│           │   ├── App.tsx         # Main application component
│           │   ├── App.module.scss # Application styling
│           │   ├── main.tsx        # Application entry point
│           │   ├── TestComponent.tsx  # Component examples
│           │   └── assets/         # Static assets
│           ├── public/             # Public assets
│           ├── eslint.config.js    # App-specific ESLint config
│           ├── prettier.config.js  # Prettier configuration
│           ├── vite.config.ts      # Vite build configuration with monorepo aliases
│           ├── tsconfig.json       # TypeScript configuration with project references
│           └── package.json        # App dependencies and scripts
├── packages/                       # Shared packages
│   ├── types/                      # Shared TypeScript types and interfaces
│   │   ├── src/
│   │   │   ├── index.ts            # Common base types (ID, User, ApiResponse, etc.)
│   │   │   ├── app.ts              # Application-level types
│   │   │   ├── ui.ts               # Legacy UI types
│   │   │   ├── app/                # App-specific types
│   │   │   │   ├── app.ts          # AppState, AppConfig, LoadingState
│   │   │   │   └── index.ts        # App types barrel export
│   │   │   ├── fe/                 # Frontend types (folder-based organization)
│   │   │   │   ├── index.ts        # Frontend types barrel export
│   │   │   │   ├── base/           # Base frontend types
│   │   │   │   │   ├── base.ts     # Environment, ThemeMode, etc.
│   │   │   │   │   └── index.ts    # Base types export
│   │   │   │   ├── ui/             # UI component types
│   │   │   │   │   ├── index.ts    # UI types barrel export
│   │   │   │   │   ├── button.ts   # Button component types
│   │   │   │   │   ├── link.ts     # Link component types
│   │   │   │   │   └── header.ts   # Header component types
│   │   │   │   └── api/            # API-related types
│   │   │   │       ├── index.ts    # API types export
│   │   │   │       ├── api-endpoints.ts
│   │   │   │       └── api-response.ts
│   │   │   ├── be/                 # Backend types (if needed)
│   │   │   └── ui/                 # Legacy UI types location
│   │   │       ├── button.ts       # Legacy button types
│   │   │       └── index.ts        # Legacy types export
│   │   ├── tsconfig.json           # Types package TypeScript config
│   │   └── package.json            # Types package configuration
│   ├── fe-config/                  # Frontend build configuration package
│   │   ├── src/                    # Configuration source files
│   │   │   ├── index.ts            # Main exports (query client, router utils)
│   │   │   ├── vite.ts             # Vite configuration factory with monorepo aliases
│   │   │   ├── query-client.ts     # React Query client setup
│   │   │   └── router.tsx          # Router configuration utilities
│   │   ├── dist/                   # Compiled configuration files
│   │   │   ├── vite.js             # Compiled Vite config (used by apps)
│   │   │   ├── query-client.js     # Compiled query client
│   │   │   └── router.js           # Compiled router utilities
│   │   ├── eslint.config.js        # Package ESLint config
│   │   ├── tsconfig.json           # TypeScript config with composite: true
│   │   └── package.json            # Frontend config package setup
│   ├── components/                 # Shared React UI components (published as @mono/components)
│   │   ├── index.tsx               # Main component exports entry point
│   │   ├── REACT_ARIA_INTEGRATION.md  # React Aria implementation guide
│   │   ├── src/                    # Component source files
│   │   │   ├── ui/                 # UI components
│   │   │   │   ├── index.ts        # Component exports barrel
│   │   │   │   ├── button/         # Button component with React Aria
│   │   │   │   │   ├── Button.tsx  # Button implementation
│   │   │   │   │   ├── Button.module.scss      # Button styling with design tokens
│   │   │   │   │   ├── ButtonFixed.module.scss # Alternative button styles
│   │   │   │   │   └── index.tsx   # Button barrel export
│   │   │   │   ├── link/           # Link component with React Aria
│   │   │   │   │   ├── Link.tsx    # Link implementation
│   │   │   │   │   └── Link.module.scss        # Link styling with variants
│   │   │   │   └── header/         # Header component with navigation
│   │   │   │       ├── Header.tsx  # Header implementation
│   │   │   │       ├── Header.module.scss      # Header styling
│   │   │   │       └── index.ts    # Header barrel export
│   │   │   ├── global.d.ts         # CSS module type declarations
│   │   │   └── utils/              # Component utilities
│   │   ├── eslint.config.js        # Package ESLint config
│   │   ├── tsconfig.json           # Components package TypeScript config
│   │   └── package.json            # Component library config with React Aria deps
│   ├── styles/                     # Premium SCSS design system (published as @mono/styles)
│   │   ├── src/                    # SCSS source files
│   │   │   ├── base-styles.scss    # Main entry point for complete design system
│   │   │   ├── foundations/        # Design tokens and variables
│   │   │   │   ├── _index.scss     # Foundations barrel export
│   │   │   │   ├── _open-props.scss # Open Props integration
│   │   │   │   ├── _colors.scss    # Premium earthy-cosmic color palette
│   │   │   │   ├── _typography.scss # Font scales and hierarchy
│   │   │   │   ├── _spacing.scss   # Spacing scale and utilities
│   │   │   │   ├── _breakpoints.scss # Responsive breakpoint system
│   │   │   │   ├── _elevation.scss  # Shadow and depth system
│   │   │   │   └── _transitions.scss # Animation and transition tokens
│   │   │   ├── components/         # Component-specific styles
│   │   │   │   ├── _index.scss     # Components barrel export
│   │   │   │   ├── _buttons.scss   # Button component styles
│   │   │   │   ├── _cards.scss     # Card component styles
│   │   │   │   ├── _forms.scss     # Form component styles
│   │   │   │   ├── _modals.scss    # Modal component styles
│   │   │   │   └── _navigation.scss # Navigation component styles
│   │   │   ├── layouts/            # Layout and grid systems
│   │   │   │   ├── _index.scss     # Layouts barrel export
│   │   │   │   ├── _containers.scss # Container layouts
│   │   │   │   ├── _grid.scss      # CSS Grid system
│   │   │   │   └── _positioning.scss # Positioning utilities
│   │   │   └── utilities/          # Utility classes
│   │   │       ├── _index.scss     # Utilities barrel export
│   │   │       ├── _colors.scss    # Color utilities
│   │   │       ├── _spacing.scss   # Spacing utilities
│   │   │       ├── _typography.scss # Typography utilities
│   │   │       ├── _display.scss   # Display utilities
│   │   │       ├── _backgrounds.scss # Background utilities
│   │   │       └── _responsive.scss  # Responsive utilities
│   │   ├── README.md               # Styles documentation and usage guide
│   │   ├── eslint.config.js        # Package ESLint config
│   │   ├── tsconfig.json           # TypeScript config for styles
│   │   └── package.json            # Styles package configuration
│   └── config/                     # Configuration packages
│       └── eslint-config-custom/   # Shared ESLint/Prettier config
│           ├── index.js            # Base config for Node.js
│           ├── react.js            # React-specific config
│           ├── prettier.config.js  # Prettier rules
│           ├── README.md           # Configuration documentation
│           ├── tsconfig.json       # TypeScript config for config package
│           └── package.json        # Config package setup
├── .vscode/                        # VS Code workspace settings
│   ├── settings.json               # Auto-format and lint on save
│   └── extensions.json             # Recommended extensions
├── QUICK_START.md                  # Quick start guide for developers
├── TYPESCRIPT_SETUP.md             # TypeScript configuration documentation
├── tsconfig.json                   # Root TypeScript config with project references
├── tsconfig.base.json              # Base TypeScript configuration
├── package.json                    # Workspace configuration
└── README.md                       # This file
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

This monorepo uses TypeScript Project References for optimal build performance and better development experience. **Recently enhanced** with proper dependency resolution and build order.

### Key Benefits

- ⚡ **Faster Builds**: Incremental compilation with project references
- 🛡️ **Better Type Safety**: Shared types ensure consistency across packages
- 🔧 **Developer Experience**: IntelliSense and auto-completion work across packages
- 🧹 **Maintainability**: Centralized type definitions with minimal duplication
- 📈 **Scalability**: Easy to add new types and packages as needed
- 🔗 **Proper Dependencies**: Build order ensures packages are compiled before apps that use them

### Project Reference Architecture

**Root TypeScript Configuration (`tsconfig.json`):**

```json
{
  "references": [
    { "path": "packages/types" },
    { "path": "packages/fe-config" }, // Build before apps
    { "path": "packages/components" },
    { "path": "packages/styles" },
    { "path": "apps/fe/test-app" } // Built after dependencies
  ]
}
```

**App TypeScript Configuration (e.g., `test-app/tsconfig.json`):**

```json
{
  "references": [
    { "path": "../../../packages/types" },
    { "path": "../../../packages/fe-config" }, // Critical for Vite config imports
    { "path": "../../../packages/components" }
  ]
}
```

### Build Commands

```bash
# Build all TypeScript projects in correct dependency order
yarn build

# Build with watch mode for development
yarn build:watch

# Clean all build artifacts and rebuild
yarn build:clean && yarn build
```

### Dependency Resolution Fix

**Problem Solved**: Previously, apps couldn't import from `@mono/fe-config` because TypeScript project references weren't properly configured.

**Solution Applied**:

1. ✅ Added `fe-config` to root TypeScript project references
2. ✅ Added `fe-config` reference to app-level TypeScript configurations
3. ✅ Ensured proper build order: `types` → `fe-config` → `components` → `apps`

This ensures that when an app imports `@mono/fe-config/vite`, the compiled JavaScript is available.

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

#### `@mono/fe-config`

- **Type**: Frontend build configuration package
- **Purpose**: Shared Vite configuration, React Query setup, and routing utilities
- **Features**: Pre-configured Vite setup with monorepo aliases, React Query client, router utilities
- **Dependencies**: Uses types from `@mono/types`, integrates with workspace architecture
- **Exports**: Vite config factory, query client setup, router utilities
- **Usage**: `import { createViteConfig } from '@mono/fe-config/vite'`

#### `@mono/components`

- **Type**: React component library with React Aria integration
- **Purpose**: Accessible, reusable UI components across applications
- **Features**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- **Dependencies**: Uses types from `@mono/types`, built with React Aria Components
- **Exports**: Button, Link, Header components with full accessibility features
- **Usage**: `import { Button } from '@mono/components'`

#### `@mono/styles`

- **Type**: Premium SCSS design system package
- **Purpose**: Centralized styling foundation with design tokens and component styles
- **Features**: Earthy-cosmic color palette, responsive utilities, Open Props integration
- **Structure**: Organized SCSS with foundations, components, layouts, and utilities
- **Exports**: Complete design system via `base-styles.scss` entry point
- **Usage**: `@import '@mono/styles/src/base-styles.scss';`

#### `@mono/eslint-config-custom`

- **Type**: Configuration package
- **Purpose**: Unified ESLint and Prettier rules
- **Configs**: Base (Node.js) and React variants
- **Usage**: `import config from '@mono/eslint-config-custom'`

## 🛠️ Development Tools

### Shared Dependencies Architecture

This monorepo uses a **shared dependencies approach** where build tools and development dependencies are installed at the root level, with individual packages accessing them through clean, scalable scripts.

#### **Key Benefits**

- 🔧 **Centralized Tool Management**: All build tools (`vite`, `tsc`, `eslint`) installed once at root level
- 📦 **Reduced Bundle Size**: No duplicate dependencies across packages
- ⚡ **Faster Installs**: Shared dependencies mean faster `yarn install`
- 🧹 **Easier Maintenance**: Update tools once at root, applies everywhere
- 📈 **Scalable Pattern**: Easy to add new apps without configuration changes

#### **How It Works**

**Root Level Dependencies:**

```json
{
  "devDependencies": {
    "typescript-eslint": "^8.17.0",
    "vite": "^6.3.5",
    "typescript": "^5.7.3",
    "@eslint/js": "^9.27.0"
  }
}
```

**Package Level Scripts (using `npx` for binary resolution):**

```json
{
  "scripts": {
    "start": "npx vite --port=3000",
    "build": "npx tsc -b && npx vite build",
    "lint": "npx eslint .",
    "format": "npx prettier --write ."
  }
}
```

**Workspace Orchestration:**

```bash
# Root level commands that delegate to packages
yarn workspace test-app build    # Finds and uses root-level vite
yarn workspace @mono/fe-config build  # Uses root-level tsc
yarn lint  # Runs across all packages with shared eslint
```

#### **Adding New Apps**

Thanks to this architecture, adding new apps is incredibly simple:

1. **Create app directory**: `mkdir apps/fe/new-app`
2. **Add package.json with clean scripts**:
   ```json
   {
     "scripts": {
       "start": "npx vite --port=3001",
       "build": "npx tsc -b && npx vite build",
       "lint": "npx eslint ."
     }
   }
   ```
3. **No tool installation needed**: All build tools automatically available via `npx`
4. **Run from root**: `yarn workspace new-app start`

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
  },
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
  },
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
yarn workspace @mono/components lint          # Lint UI components
yarn workspace @mono/components format        # Format UI components

# Styles Package
yarn workspace @mono/styles lint              # Lint SCSS and config files
yarn workspace @mono/styles format            # Format SCSS and config files

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
├── @mono/fe-config (Frontend Configuration)
├── @mono/components (UI Components)
├── @mono/styles (Design System)
├── @mono/eslint-config-custom (Linting)
├── React 19
└── Vite (from root)

@mono/fe-config (Frontend Config)
├── @mono/types (Shared Types)
├── @mono/eslint-config-custom (Linting)
├── React Query
├── React Router
└── Vite (peer dependency)

@mono/components (UI Components)
├── @mono/types (Shared Types)
├── @mono/styles (Design System)
├── @mono/eslint-config-custom (Linting)
├── React
└── TypeScript

@mono/styles (Design System)
├── @mono/eslint-config-custom (Linting)
├── Open Props
└── SCSS

@mono/types (Shared Types)
├── @mono/eslint-config-custom (Linting)
└── TypeScript

@mono/eslint-config-custom (Config)
├── ESLint 9 (from root)
├── Prettier 3 (from root)
├── TypeScript ESLint (from root)
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

## ♿ React Aria Integration

The component library is built with [React Aria Components](https://react-spectrum.adobe.com/react-aria/) for world-class accessibility and user experience.

### Accessibility Features

- 🎹 **Keyboard Navigation**: Full keyboard support (Tab, Shift+Tab, Enter, Space)
- 👀 **Focus Management**: Visible focus indicators and proper focus flow
- 📢 **Screen Reader Support**: Comprehensive ARIA attributes and announcements
- 🔧 **Loading States**: Proper `aria-busy` and loading state handling
- 🚫 **Disabled States**: Correct `aria-disabled` and keyboard interaction management
- 🔗 **External Links**: Automatic external link indicators and proper announcements
- 📱 **Touch-Friendly**: Optimized touch targets for mobile devices
- 🎨 **High Contrast**: Support for high contrast and reduced motion preferences

### Available Components

#### Button Component

```tsx
import { Button } from '@mono/components';

<Button
  variant="primary" | "secondary" | "outline" | "ghost" | "danger"
  size="small" | "medium" | "large"
  loading={boolean}
  isDisabled={boolean}
  leftIcon={ReactNode}
  rightIcon={ReactNode}
  fullWidth={boolean}
  onPress={() => {}}  // Enhanced press handling
>
  Button Text
</Button>
```

#### Link Component

```tsx
import { Link } from '@mono/components';

<Link
  href="https://example.com"
  variant="primary" | "secondary" | "muted" | "danger"
  size="small" | "medium" | "large"
  external={boolean}    // Auto adds target="_blank"
  underline={boolean}   // Always show underline
  isDisabled={boolean}
>
  Link Text
</Link>
```

### Design System Integration

Components use the `@mono/styles` design system with luxury styling and Open Props integration:

```scss
// Import the complete design system
@import "@mono/styles/src/base-styles.scss";

// Or import specific parts
@import "@mono/styles/src/foundations/colors";
@import "@mono/styles/src/components/buttons";
@import "@mono/styles/src/utilities/spacing";
```

**Available Design Tokens:**

```scss
// Colors (Earthy-Cosmic Palette)
--color-brand-primary, --color-brand-light, --color-brand-dark
--color-accent-primary, --color-text-primary, --color-error
--color-focus  // For focus indicators

// Spacing & Typography
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg
--font-family-primary, --font-weight-medium, --line-height-normal

// Effects
--radius-sm, --radius-md, --transition-fast, --shadow-md
```

### Testing Accessibility

The test application includes an interactive accessibility demo showcasing:

- Keyboard navigation patterns
- Focus management examples
- Screen reader compatibility
- Touch target verification
- Loading and disabled state handling

**Learn More**: See [`packages/components/REACT_ARIA_INTEGRATION.md`](./packages/components/REACT_ARIA_INTEGRATION.md) for detailed implementation guide.

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
yarn add @mono/components

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
4. **Cross-package**: Import UI components from `@mono/components`
5. **Building**: TypeScript project references enable incremental builds
6. **Consistency**: Shared rules ensure uniform code style

## 📝 Contributing

1. Follow the established ESLint and Prettier configurations
2. Use TypeScript for all new code
3. Import shared types from `@mono/types` instead of duplicating
4. Add shared components to `@mono/components` with React Aria integration
5. Ensure components meet WCAG 2.1 AA accessibility standards
6. Use existing design tokens from the Open Props system
7. Update type definitions when adding new interfaces
8. Test changes across affected packages
9. Verify keyboard navigation and screen reader compatibility
10. Ensure all linting and formatting checks pass
11. Run `yarn build` to verify TypeScript compilation

## 🔍 Troubleshooting

### Build Issues with Shared Dependencies

#### "Cannot find module" errors in CI/CD

**Problem**: CI environments may not have built packages in the correct order.

**Solution**: Ensure TypeScript project references are properly configured and run root build first:

```bash
# In CI/CD pipeline - build all packages first
yarn build

# Then build specific apps
yarn workspace test-app build
```

#### "command not found: vite" or similar tool errors

**Problem**: Package scripts can't find shared binaries.

**Solution**: Use `npx` prefix in package.json scripts:

```json
{
  "scripts": {
    "start": "npx vite --port=3000", // ✅ Uses root-level vite
    "build": "npx tsc -b && npx vite build"
  }
}
```

### TypeScript Issues

```bash
# Build all projects with clean slate (includes fe-config)
yarn build:clean && yarn build

# Check TypeScript configuration
npx tsc --showConfig

# Verify project references include fe-config
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
# Reinstall all dependencies (includes shared root dependencies)
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
import { SomeComponent } from "@mono/components";
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
