# Project Memory: Workout Next

## Context
- **Type:** Next.js 16 PWA with React 19.
- **Deployment:** Configured for GitHub Pages via GitHub Actions (repo: `workout-next`).

## Key Configurations
### Turbopack Fix
- Next.js 16 enables Turbopack by default. Because `@ducanh2912/next-pwa` modifies the Webpack config, an explicit `turbopack: {}` key is required in `next.config.ts`.

### Timer Fix (Dark Mode)
- **Problem:** SVGs sometimes struggle to resolve CSS variables for stroke colors in all environments.
- **Solution:** Moved timer styling to explicit `.timer-track` and `.timer-progress` classes in `globals.css` with `@media (prefers-color-scheme: dark)` overrides for maximum robustness.

### GitHub Pages Deployment
- **Static Export:** Enabled via `output: 'export'`.
- **Base Path:** Set to `/workout-next` in production to match GitHub Pages subpath.
- **Manifest:** `public/manifest.json` uses relative paths (`./`) for compatibility.
- **CI/CD:** Managed via `.github/workflows/deploy.yml`.
