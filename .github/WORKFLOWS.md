# 🔄 Workflow Documentation

This document outlines the GitHub Actions workflows configured for the mono-workspace monorepo.

## 🚀 Available Workflows

### 1. **CI Workflow** (`ci.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

**Jobs:**

- **Install Dependencies** - Caches node_modules and Yarn dependencies
- **Lint Code** - Runs ESLint across all packages and apps
- **Format Check** - Verifies Prettier formatting compliance
- **Build TypeScript** - Compiles all TypeScript packages with project references
- **Type Check** - Validates TypeScript types without emitting files
- **Test** - Runs tests if available (gracefully handles missing test scripts)
- **Build Apps** - Builds production-ready applications (main/develop only)
- **CI Success** - Summary job that reports overall CI status

**Caching Strategy:**

- Yarn dependencies cached by `yarn.lock` hash
- `node_modules` cached by `yarn.lock` hash
- Build artifacts cached by commit SHA

### 2. **Release Workflow** (`release.yml`)

**Triggers:** Git tags (`v*`), Manual dispatch

**Jobs:**

- Builds all packages and applications
- Creates GitHub releases with automated changelog
- Uploads application builds as release assets

**Usage:**

```bash
# Create a release
git tag v1.0.0
git push origin v1.0.0

# Or use GitHub UI for manual dispatch
```

### 3. **Deploy Workflow** (`deploy.yml`)

**Triggers:** Push to `main`, Manual dispatch

**Jobs:**

- Deploys test-app to GitHub Pages (default)
- Alternative configurations for Vercel, Netlify included

**Setup:**

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Optionally add custom domain in CNAME

### 4. **Dependency Update Workflow** (`dependency-update.yml`)

**Triggers:** Weekly schedule (Mondays at 9 AM UTC), Manual dispatch

**Jobs:**

- Updates all dependencies to latest versions
- Updates Yarn to latest stable version
- Runs CI checks to verify updates don't break anything
- Creates automated Pull Request with changes

## 🛠️ Development Workflow

### Local Development

```bash
# Start development
yarn dev

# Run all checks (same as CI)
yarn ci

# Fix linting and formatting issues
yarn precommit

# Clean and reinstall everything
yarn reset
```

### Pre-commit Checklist

- [ ] `yarn lint` passes
- [ ] `yarn format:check` passes
- [ ] `yarn build` succeeds
- [ ] `yarn typecheck` passes

### Release Process

1. Ensure all changes are merged to `main`
2. Update version numbers if needed
3. Create and push a git tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. Release workflow will automatically create GitHub release

## 🔧 Configuration

### Required Secrets

For full functionality, add these to your repository secrets:

**Required:**

- `FINEGRAIN_TOKEN` - Fine-grained GitHub personal access token with repository permissions
  - Go to GitHub Settings > Developer settings > Personal access tokens > Fine-grained tokens
  - Create token with repository access and necessary permissions (Contents, Pull requests, etc.)
  - Add to repository secrets as `FINEGRAIN_TOKEN`

**Optional (for enhanced deployments):**

- `VERCEL_TOKEN` - For Vercel deployments
- `NETLIFY_AUTH_TOKEN` - For Netlify deployments
- `NETLIFY_SITE_ID` - For Netlify deployments

### Branch Protection Rules

Recommended settings for `main` branch:

- [x] Require status checks to pass before merging
  - [x] Lint Code
  - [x] Check Code Formatting
  - [x] Build TypeScript Projects
  - [x] TypeScript Type Check
- [x] Require pull request reviews before merging
- [x] Dismiss stale reviews when new commits are pushed
- [x] Require review from code owners
- [x] Restrict pushes that create merge conflicts

## 📊 Workflow Status

Monitor workflow status:

- **Actions Tab**: View all workflow runs
- **Pull Requests**: See checks status on PRs
- **Main Branch**: View latest CI status on repository home

### Troubleshooting Common Issues

**Cache Issues:**

```bash
# Clear GitHub Actions cache (in repository settings)
# Or increment cache keys in workflow files
```

**Build Failures:**

```bash
# Run locally first
yarn ci

# Check specific step logs in GitHub Actions
```

**Dependency Issues:**

```bash
# Reset local environment
yarn reset

# Check for dependency conflicts
yarn install --check-resolutions
```

## 🔄 Continuous Improvement

The workflows are designed to be:

- **Fast**: Aggressive caching and parallel execution
- **Reliable**: Graceful handling of missing scripts/files
- **Flexible**: Easy to extend for new packages/apps
- **Maintainable**: Clear job separation and documentation

Consider these enhancements as your project grows:

- Add integration tests
- Set up staging deployments
- Add security scanning
- Implement semantic versioning
- Add performance monitoring
- Set up automated changelogs
