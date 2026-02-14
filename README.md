# 🌊 Toastwave

Lightweight React toast notifications with zero CSS dependencies.

- **~3KB** gzipped
- **Deduplication** — identical messages won't stack
- **Countdown timer** with configurable text, pause-on-hover, and "click to stop"
- **Action buttons** — only when you explicitly pass them
- **Theming** — dark, light, or fully custom theme objects
- **Container scoping** — render at window level or inside any element
- **Promise toasts** — loading → success/error transitions
- **TypeScript** — full type definitions included

## Install

```bash
npm install toastwave
# or
yarn add toastwave
# or
pnpm add toastwave
```

## Quick Start

```jsx
import { toast, Toaster } from 'toastwave';

function App() {
  return (
    <div>
      <Toaster position="bottom-right" theme="dark" />
      <button onClick={() => toast.success('Saved!')}>
        Save
      </button>
    </div>
  );
}
```

## API Reference

### `toast(message, options?)`

Show a toast notification. Returns a numeric toast ID.

```js
toast('Hello world');
toast('Custom duration', { duration: 8000 });
```

#### Shorthand Methods

```js
toast.success('Changes saved');
toast.error('Something went wrong');
toast.warning('Are you sure?');
toast.info('New version available');
toast.loading('Uploading...'); // duration: Infinity
```

#### Options

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `string` | `"default"` | `"default"` `"success"` `"error"` `"warning"` `"info"` `"loading"` |
| `description` | `string` | — | Secondary text below the title |
| `duration` | `number` | `5000` | Auto-dismiss in ms. Use `Infinity` to persist. |
| `action` | `object` | — | `{ label: string, onClick: () => void }` |
| `dedupeKey` | `string` | `${type}::${message}` | Custom key for deduplication |
| `showCountdown` | `boolean` | `true` | Show/hide the countdown footer |
| `countdownText` | `string` | `"This message will close in {seconds} second{s}."` | Countdown template. `{seconds}` = number, `{s}` = plural suffix |
| `pausedText` | `string` | `"Timer paused"` | Text when hovering (timer paused) |
| `stopText` | `string` | `"Click to stop."` | Clickable text to permanently stop timer |

### Action Buttons

Action buttons **only appear when you pass them**. No action = no button.

```js
// No button
toast.success('Saved');

// With undo button
toast.success('Message archived', {
  description: 'Moved to trash.',
  action: {
    label: 'Undo',
    onClick: () => {
      restoreMessage();
      toast.info('Message restored');
    },
  },
});

// With custom action
toast.error('Upload failed', {
  action: {
    label: 'Retry',
    onClick: () => retryUpload(),
  },
});
```

### Promise Toasts

```js
toast.promise(
  fetch('/api/deploy'),
  {
    loading: 'Deploying...',
    success: 'Deployed successfully!',
    error: 'Deploy failed',
  }
);
```

### Dismissing

```js
const id = toast('Persistent message', { duration: Infinity });

// Later...
toast.dismiss(id);
```

### Custom Countdown Text

```js
// Default English
toast.success('Done');

// Custom text
toast.success('Saved', {
  countdownText: 'Auto-closing in {seconds}s',
  stopText: 'Keep open',
  pausedText: 'Paused — will stay open',
});

// Localized
toast.success('保存しました', {
  countdownText: '{seconds}秒後に閉じます。',
  stopText: 'タイマーを停止',
  pausedText: '一時停止中',
});

// Hide countdown entirely
toast.info('Clean notification', {
  showCountdown: false,
});
```

### Deduplication

Identical toasts (same type + message) are automatically deduplicated:

```js
toast.success('Saved'); // ✅ shown
toast.success('Saved'); // ❌ ignored (already active)
toast.success('Saved'); // ❌ ignored

// After the first one is dismissed, the next call will show again.

// Custom dedup key
toast.info('Update', { dedupeKey: 'update-check' });
```

---

## `<Toaster />` Component

Place once in your app layout.

```jsx
<Toaster
  position="bottom-right"
  theme="dark"
/>
```

#### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `string` | `"bottom-right"` | `"top-left"` `"top-center"` `"top-right"` `"bottom-left"` `"bottom-center"` `"bottom-right"` |
| `theme` | `string \| object` | `"dark"` | `"dark"`, `"light"`, or a custom `ToastTheme` object |
| `container` | `RefObject` | — | Ref to a container element for scoped rendering |

### Container Scoping

Render toasts inside a specific element instead of the window:

```jsx
function Panel() {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <Toaster position="top-center" container={containerRef} theme="light" />
      <button onClick={() => toast.success('Scoped!')}>
        Toast inside panel
      </button>
    </div>
  );
}
```

> **Note:** The container must have `position: relative` (or `absolute`/`fixed`).

---

## Theming

### Built-in Themes

```jsx
<Toaster theme="dark" />
<Toaster theme="light" />
```

### Custom Theme

Pass an object with any subset of theme tokens. Missing tokens fall back to the dark theme.

```jsx
const midnightTheme = {
  toastBg: 'rgba(15, 10, 40, 0.96)',
  toastBorder: 'rgba(120, 80, 255, 0.15)',
  toastShadow: '0 16px 48px rgba(60, 20, 180, 0.25)',
  title: '#e8e0ff',
  desc: 'rgba(200, 180, 255, 0.5)',
  footerBg: 'rgba(60, 20, 180, 0.1)',
  footerBorder: 'rgba(120, 80, 255, 0.1)',
  footerText: 'rgba(200, 180, 255, 0.4)',
  footerLink: 'rgba(200, 180, 255, 0.7)',
  progressTrack: 'rgba(120, 80, 255, 0.08)',
  closeBtnColor: 'rgba(200, 180, 255, 0.3)',
  closeBtnHover: 'rgba(200, 180, 255, 0.7)',
  closeBtnHoverBg: 'rgba(120, 80, 255, 0.1)',
  actionBg: 'rgba(120, 80, 255, 0.12)',
  actionBorder: 'rgba(120, 80, 255, 0.2)',
  actionHoverBg: 'rgba(120, 80, 255, 0.22)',
  actionHoverBorder: 'rgba(120, 80, 255, 0.35)',
  actionText: '#d4c0ff',
  backdrop: 'blur(16px) saturate(1.6)',
};

<Toaster theme={midnightTheme} />
```

### Theme Token Reference

| Token | Description |
|---|---|
| `toastBg` | Toast card background |
| `toastBorder` | Toast card border |
| `toastShadow` | Toast card box-shadow |
| `title` | Title text color |
| `desc` | Description text color |
| `footerBg` | Countdown footer background |
| `footerBorder` | Countdown footer top border |
| `footerText` | Countdown text color |
| `footerLink` | "Click to stop" link color |
| `progressTrack` | Progress bar track background |
| `closeBtnColor` | Close button default color |
| `closeBtnHover` | Close button hover color |
| `closeBtnHoverBg` | Close button hover background |
| `actionBg` | Action button background |
| `actionBorder` | Action button border |
| `actionHoverBg` | Action button hover background |
| `actionHoverBorder` | Action button hover border |
| `actionText` | Action button text color |
| `backdrop` | CSS backdrop-filter value |

### Utilities

```js
import { darkTheme, lightTheme, resolveTheme } from 'toastwave';

// Extend the dark theme
const custom = resolveTheme({
  ...darkTheme,
  toastBg: '#1a1a2e',
  title: '#eee',
});
```

---

## Running the Examples

The repo includes 3 runnable Vite examples. Each one aliases `toastwave` to the local build, so you don't need to publish first.

### 1. Build the library

```bash
# From the project root
npm install
npm run build
```

### 2. Run any example

```bash
# Basic — all toast types
cd examples/basic
npm install
npm run dev

# Custom Theme — dark / light / midnight theme switching
cd examples/custom-theme
npm install
npm run dev

# Container Scoping — side-by-side panels with independent Toasters
cd examples/container-scoping
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

### Examples Overview

| Example | What it demonstrates |
|---|---|
| `examples/basic` | All toast types, action buttons, promise, custom countdown text, dedup |
| `examples/custom-theme` | Switching between dark, light, and a custom midnight theme |
| `examples/container-scoping` | Two panels with independent scoped Toasters (dark + light) |

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Requires `backdrop-filter` support for the glass effect (gracefully degrades).

## License

MIT
