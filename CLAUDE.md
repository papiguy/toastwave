# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Toastywave is a lightweight (~3KB) React toast notification library with zero CSS dependencies. It provides deduplication, countdown timers, theming, container scoping, and promise-based toasts.

## Commands

```bash
# Development - builds library and starts playground
bun run dev

# Build library only
bun run build

# Watch mode for library development
bun run watch

# Start playground only (requires build first)
bun run playground

# Install playground dependencies (first time setup)
bun run playground:install
```

## Architecture

### Library Structure

The entire library is in a single file (`src/index.jsx`) with the following organization:

1. **Internal State** (lines 9-13): Global variables for toast ID counter, Toaster callback, and active toast tracking
2. **Action Presets** (lines 17-54): Factory pattern for reusable action buttons (undo, retry, etc.)
3. **Public API** (lines 56-106): `toast()` function and shorthand methods (success, error, warning, info, loading, promise, dismiss)
4. **Themes** (lines 108-164): Built-in dark/light themes and theme resolution
5. **Icons** (lines 166-222): SVG icon components and accent color mapping
6. **ToastItem Component** (lines 232-446): Individual toast rendering with animations, countdown, and actions
7. **Toaster Component** (lines 448-517): Container that manages toast state and positioning

### Key Design Decisions

- **Single global callback**: Only one `<Toaster />` can be active at a time. The library uses a module-level `_addToast` callback that the Toaster sets on mount.
- **Deduplication via Map**: Active toasts are tracked by deduplication key (default: `${type}::${message}`). Duplicate calls return the existing toast ID.
- **CSS-in-JS**: All styles are inline. No external CSS required.
- **Phase-based animations**: Toasts use enter/visible/exit phases with CSS transitions.

### Build System

- **Bundler**: Rollup with Babel (ES6+ and JSX transpilation)
- **Output**: CJS (`dist/index.cjs.js`) and ESM (`dist/index.esm.js`) with source maps
- **TypeScript**: Definitions in `src/index.d.ts`, copied to `dist/` on build

### Playground

The `playground/` directory contains a Vite-based demo app showcasing all features. It uses a path alias to import directly from `dist/index.esm.js`.

## Key Files

- `src/index.jsx` - Main library implementation
- `src/index.d.ts` - TypeScript type definitions
- `rollup.config.mjs` - Build configuration
- `playground/src/App.jsx` - Feature demo application

## Testing Changes

After modifying `src/index.jsx`:
1. Run `bun run build` to rebuild
2. The playground will hot-reload automatically if running

## API Summary

```jsx
// Basic usage
toast('Message');
toast.success('Success!');
toast.error('Error!');
toast.warning('Warning!');
toast.info('Info!');
toast.loading('Loading...');

// With options
toast.success('Deleted', {
  description: 'Item moved to trash',
  action: { preset: 'undo', onAction: () => restore() },
  duration: 8000,
  showCountdown: false,
});

// Promise toast
toast.promise(fetchData(), {
  loading: 'Loading...',
  success: 'Done!',
  error: 'Failed',
});

// Dismiss programmatically
const id = toast.loading('Processing...');
toast.dismiss(id);

// Register custom action preset
registerActionPreset('retry', (onRetry) => ({
  label: 'Retry',
  onClick: onRetry,
}));
```
