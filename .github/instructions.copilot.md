# Monorepo Configuration Instructions

## AI Agent Guidelines

### Workspace Configuration Rules:

## Use Yarn for all package management (v4+)

## Always, think first, make a plan, run it by me first before implementing

1. **Documentation**: Maintain only one README.md at the root level - never create additional .md files
2. **TypeScript**: Use TypeScript Project References for all package dependencies
3. **Shared Configuration**: All packages inherit from centralized configs in `packages/config/`
4. **Dependency Constraints**: Apps cannot import from each other, packages cannot import from apps
5. **Build System**: Use composite TypeScript builds for optimal performance
6. **GITHUB_TOKEN** is a reserved name in github - always use FINEGRAIN_TOKEN instead

### Package Structure:

- `packages/config/` - Shared ESLint, TypeScript, and build configurations
- `packages/types/` - Shared TypeScript types with folder-based organization
- `packages/ui/` - Reusable UI components using shared types
- `apps/` - Independent applications that consume packages

### Key Configuration Files:

- Root `tsconfig.json` - Project references configuration
- Root `tsconfig.base.json` - Base TypeScript settings for all packages
- `packages/config/eslint-config-custom/` - Centralized linting with dependency constraints
