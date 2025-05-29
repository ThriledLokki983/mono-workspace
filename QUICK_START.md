# 🚀 Quick Start Guide

## ✅ Current Status
Your monorepo is **fully configured** with:
- ✅ ESLint dependency constraints preventing cross-app imports
- ✅ GitHub Actions workflows with `FINEGRAIN_TOKEN` configuration
- ✅ Clean workspace structure (removed empty app folders)
- ✅ All CI checks passing

## 📋 Daily Commands

```bash
# Start development
yarn dev                 # Start test-app in dev mode

# Code quality
yarn lint               # Check all packages
yarn lint:fix           # Auto-fix linting issues
yarn format             # Format all code
yarn format:check       # Check formatting

# Build & test
yarn build              # Build all packages
yarn typecheck          # TypeScript validation
yarn test               # Run all tests
```

### 🔧 Common Tasks

#### Adding a new package

```bash
mkdir packages/my-package
cd packages/my-package
yarn init -y
# Add to workspace dependencies
```

#### Adding a new app

```bash
mkdir apps/my-app
cd apps/my-app
yarn create vite . --template react-ts
# Configure eslint.config.js following test-app pattern
```

#### Pre-commit workflow

```bash
yarn precommit          # Auto-fix lint + format
yarn ci                 # Full CI check locally
```

### 🔒 Dependency Rules

- ✅ **Apps can import**: packages/ui, packages/types, external packages
- ✅ **Packages can import**: other packages, external packages
- ❌ **Apps cannot import**: other apps
- ❌ **Packages cannot import**: apps

### 🎯 Release Process

**⚠️ First-time setup:** Add `FINEGRAIN_TOKEN` to repository secrets (see `.github/WORKFLOWS.md`)

```bash
# 1. Ensure clean state
yarn ci

# 2. Create release tag
git tag v1.0.0
git push origin v1.0.0

# 3. GitHub Actions handles the rest!
```

### 🛠️ Troubleshooting

```bash
# Clean everything
yarn reset              # Clean + reinstall

# Check specific package
yarn workspace package-name lint
yarn workspace package-name build

# Manual TypeScript build
yarn build:clean && yarn build
```

## 📚 More Info

- Full workflow details: `.github/WORKFLOWS.md`
- Architecture overview: `README.md`
