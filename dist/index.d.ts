import { FC, RefObject, ReactNode } from "react";

// ── Theme ───────────────────────────────────────────────────────

export interface ToastTheme {
  toastBg?: string;
  toastBorder?: string;
  toastShadow?: string;
  title?: string;
  desc?: string;
  footerBg?: string;
  footerBorder?: string;
  footerText?: string;
  footerLink?: string;
  progressTrack?: string;
  closeBtnColor?: string;
  closeBtnHover?: string;
  closeBtnHoverBg?: string;
  actionBg?: string;
  actionBorder?: string;
  actionHoverBg?: string;
  actionHoverBorder?: string;
  actionText?: string;
  backdrop?: string;
}

// ── Toast Options ───────────────────────────────────────────────

/** Custom action button configuration */
export interface ToastAction {
  /** Button label text */
  label: string;
  /** Callback when button is clicked */
  onClick: () => void;
}

/** Preset action with callback */
export interface ToastActionPreset {
  /** Preset name (e.g., "undo") */
  preset: string;
  /** Callback when the action is triggered */
  onAction?: () => void;
}

/** Action can be a preset name, preset config, or custom action */
export type ToastActionInput = string | ToastActionPreset | ToastAction;

/** Factory function for creating action presets */
export type ActionPresetFactory = (onAction: () => void) => ToastAction;

export interface ToastOptions {
  /** Toast type */
  type?: "default" | "success" | "error" | "warning" | "info" | "loading";
  /** Secondary description text */
  description?: string;
  /** Auto-dismiss in ms. Use Infinity to persist. Default: 5000 */
  duration?: number;
  /** Action button: preset name ("undo"), preset config ({ preset: "undo", onAction }), or custom ({ label, onClick }) */
  action?: ToastActionInput;
  /** Custom dedup key. Defaults to `${type}::${message}` */
  dedupeKey?: string;
  /** Countdown text template. Use {seconds} and {s} as placeholders. */
  countdownText?: string;
  /** Text shown when timer is paused on hover. */
  pausedText?: string;
  /** "Click to stop" link text. */
  stopText?: string;
  /** Whether to show countdown footer. Default: true */
  showCountdown?: boolean;
}

export interface PromiseMessages {
  loading: string;
  success: string;
  error: string;
}

// ── toast() API ─────────────────────────────────────────────────

export interface ToastAPI {
  (message: string, opts?: ToastOptions): number;
  success(message: string, opts?: Omit<ToastOptions, "type">): number;
  error(message: string, opts?: Omit<ToastOptions, "type">): number;
  warning(message: string, opts?: Omit<ToastOptions, "type">): number;
  info(message: string, opts?: Omit<ToastOptions, "type">): number;
  loading(message: string, opts?: Omit<ToastOptions, "type">): number;
  promise(promise: Promise<any>, msgs: PromiseMessages, opts?: ToastOptions): number;
  dismiss(id: number): void;
}

export declare const toast: ToastAPI;
export default toast;

// ── Toaster Component ───────────────────────────────────────────

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToasterProps {
  /** Position of toast stack. Default: "bottom-right" */
  position?: ToastPosition;
  /** "dark" | "light" | custom ToastTheme object */
  theme?: "dark" | "light" | ToastTheme;
  /** Ref to a container element for scoped rendering */
  container?: RefObject<HTMLElement>;
}

export declare const Toaster: FC<ToasterProps>;

// ── Built-in Themes ─────────────────────────────────────────────

export declare const darkTheme: ToastTheme;
export declare const lightTheme: ToastTheme;
export declare function resolveTheme(themeOrName: "dark" | "light" | ToastTheme): ToastTheme;

// ── Action Presets ───────────────────────────────────────────────

/**
 * Register a custom action preset.
 * @param name - Preset name (e.g., "retry", "dismiss")
 * @param factory - Factory function that takes onAction callback and returns { label, onClick }
 */
export declare function registerActionPreset(name: string, factory: ActionPresetFactory): void;
