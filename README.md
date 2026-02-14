# Toastwave

Lightweight React toast notifications with zero CSS dependencies.

- **~3KB** gzipped
- **Deduplication** — identical messages won't stack
- **Countdown timer** with configurable text, pause-on-hover, and "click to stop"
- **Action presets** — built-in "undo", "retry" or custom actions
- **Custom icons** — use any React icon library (Hero Icons, Lucide, etc.)
- **Theming** — dark, light, or fully custom theme objects
- **Container scoping** — render at window level or inside any element
- **Promise toasts** — loading → success/error transitions
- **TypeScript** — full type definitions included

## Install

```bash
bun add toastwave
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
| `action` | `string \| object` | — | Preset name, preset config, or custom action |
| `icon` | `ReactNode` | — | Custom icon element (overrides default type icon) |
| `dedupeKey` | `string` | `${type}::${message}` | Custom key for deduplication |
| `showCountdown` | `boolean` | `true` | Show/hide the countdown footer |
| `countdownText` | `string` | `"This message will close in {seconds} second{s}."` | Countdown template |
| `pausedText` | `string` | `"Timer paused"` | Text when hovering (timer paused) |
| `stopText` | `string` | `"Click to stop."` | Clickable text to permanently stop timer |

### Action Buttons

Actions support three formats: preset name, preset with callback, or custom action.

```js
// Using preset name (no callback)
toast.success('Deleted', { action: 'undo' });

// Using preset with callback
toast.success('Message archived', {
  action: {
    preset: 'undo',
    onAction: () => {
      restoreMessage();
      toast.info('Message restored');
    },
  },
});

// Custom action
toast.error('Upload failed', {
  action: {
    label: 'Retry',
    onClick: () => retryUpload(),
  },
});
```

#### Registering Custom Presets

```js
import { registerActionPreset } from 'toastwave';

registerActionPreset('retry', (onRetry) => ({
  label: 'Retry',
  onClick: onRetry,
}));

// Now use it anywhere
toast.error('Request failed', {
  action: { preset: 'retry', onAction: () => fetchData() },
});
```

### Custom Icons

Use any React icon library by passing the `icon` prop:

```jsx
import { RocketLaunchIcon } from '@heroicons/react/24/outline';

// Override default icon with Hero Icons
toast('Launching soon!', {
  icon: <RocketLaunchIcon style={{ width: 20, height: 20, color: '#f472b6' }} />,
});

// Works with any toast type
toast.success('Deployed!', {
  icon: <RocketLaunchIcon style={{ width: 20, height: 20, color: '#4ade80' }} />,
});

// Or use Lucide, FontAwesome, custom SVGs, etc.
toast.info('Syncing...', {
  icon: <CloudIcon className="w-5 h-5 text-blue-400" />,
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
// Custom text
toast.success('Saved', {
  countdownText: 'Auto-closing in {seconds}s',
  stopText: 'Keep open',
  pausedText: 'Paused',
});

// Hide countdown entirely
toast.info('Clean notification', {
  showCountdown: false,
});
```

### Deduplication

Identical toasts (same type + message) are automatically deduplicated:

```js
toast.success('Saved'); // shown
toast.success('Saved'); // ignored (already active)
toast.success('Saved'); // ignored

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
| `theme` | `string \| object` | `"dark"` | `"dark"`, `"light"`, or a custom theme object |
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
const customTheme = {
  toastBg: 'rgba(15, 10, 40, 0.96)',
  toastBorder: 'rgba(120, 80, 255, 0.15)',
  toastShadow: '0 16px 48px rgba(60, 20, 180, 0.25)',
  title: '#e8e0ff',
  // ... other tokens
};

<Toaster theme={customTheme} />
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

## Development

### Running the Playground

The repo includes a comprehensive playground that showcases all features.

```bash
# Install dependencies
bun install

# Build library and start playground
bun run dev
```

Then open **http://localhost:5173** in your browser.

The playground demonstrates:
- All toast types (default, success, error, warning, info, loading)
- Action presets (undo, retry) and custom actions
- Promise toasts
- Countdown timer options
- Position anchoring (6 positions)
- Theme switching (dark, light, custom)
- Deduplication
- Container scoping
- Programmatic dismissal

### Scripts

| Script | Description |
|---|---|
| `bun run dev` | Build library and start playground |
| `bun run build` | Build the library |
| `bun run watch` | Watch mode for library development |
| `bun run playground` | Start playground only (requires build) |

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Requires `backdrop-filter` support for the glass effect (gracefully degrades).

## License

MIT
