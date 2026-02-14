import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════════════════
   TOASTWAVE - Lightweight React Toast Notification System
   ═══════════════════════════════════════════════════════════════ */

// ── Internal State ──────────────────────────────────────────────

let _id = 0;
let _addToast = null;
let _active = new Map();

const _unreg = (k) => _active.delete(k);

// ── Public API ──────────────────────────────────────────────────

// ── Action Presets ───────────────────────────────────────────────

const actionPresets = {
  undo: (onUndo) => ({
    label: "Undo",
    onClick: onUndo,
  }),
};

/**
 * Register a custom action preset.
 * @param {string} name - Preset name
 * @param {Function} factory - Factory function (onAction) => { label, onClick }
 */
const registerActionPreset = (name, factory) => {
  actionPresets[name] = factory;
};

/**
 * Resolve action from preset string or custom object.
 * @param {string|Object} action - "undo", { preset: "undo", onAction }, or { label, onClick }
 * @returns {Object|null} Resolved action object
 */
const resolveAction = (action) => {
  if (!action) return null;
  if (typeof action === "string") {
    // Preset name only (e.g., "undo") - return preset with no-op
    const factory = actionPresets[action];
    return factory ? factory(() => {}) : null;
  }
  if (action.preset) {
    // Preset with callback (e.g., { preset: "undo", onAction: () => {...} })
    const factory = actionPresets[action.preset];
    return factory ? factory(action.onAction || (() => {})) : null;
  }
  // Custom action object { label, onClick }
  return action;
};

/**
 * Show a toast notification.
 *
 * @param {string} message - The toast title/message
 * @param {Object} [opts] - Options
 * @param {string} [opts.type="default"] - Toast type: "default"|"success"|"error"|"warning"|"info"|"loading"
 * @param {string} [opts.description] - Secondary text below the message
 * @param {number} [opts.duration=5000] - Auto-dismiss duration in ms. Use Infinity to persist.
 * @param {string|Object} [opts.action] - Action button: preset name ("undo"), preset config ({ preset: "undo", onAction }), or custom ({ label, onClick })
 * @param {React.ReactNode} [opts.icon] - Custom icon element. Overrides the default type icon.
 * @param {string} [opts.dedupeKey] - Custom dedup key. Defaults to `${type}::${message}`
 * @param {string} [opts.countdownText] - Custom countdown text. Use `{seconds}` as placeholder.
 * @param {string} [opts.pausedText] - Custom text shown when timer is paused.
 * @param {string} [opts.stopText] - Custom "Click to stop" text.
 * @param {boolean} [opts.showCountdown=true] - Whether to show the countdown footer.
 * @returns {number} Toast ID
 */
const toast = (message, opts = {}) => {
  const dk = opts.dedupeKey || `${opts.type || "default"}::${message}`;
  if (_active.has(dk)) return _active.get(dk);
  const id = ++_id;
  const resolvedAction = resolveAction(opts.action);
  const t = {
    id,
    message,
    type: "default",
    duration: 5000,
    showCountdown: true,
    countdownText: "This message will close in {seconds} second{s}.",
    pausedText: "Timer paused",
    stopText: "Click to stop.",
    ...opts,
    action: resolvedAction,
    dedupeKey: dk,
    createdAt: Date.now(),
  };
  _active.set(dk, id);
  if (_addToast) _addToast(t);
  return id;
};

toast.success = (m, o) => toast(m, { ...o, type: "success" });
toast.error = (m, o) => toast(m, { ...o, type: "error" });
toast.warning = (m, o) => toast(m, { ...o, type: "warning" });
toast.info = (m, o) => toast(m, { ...o, type: "info" });
toast.loading = (m, o) => toast(m, { ...o, type: "loading", duration: Infinity });

/**
 * Show a promise-based toast that transitions from loading → success/error.
 *
 * @param {Promise} promise
 * @param {Object} msgs - { loading, success, error }
 * @param {Object} [opts] - Same options as toast()
 * @returns {number} Toast ID
 */
toast.promise = (promise, msgs, o) => {
  const id = toast(msgs.loading, { ...o, type: "loading", duration: Infinity });
  promise
    .then(() => {
      if (_addToast)
        _addToast({
          id, message: msgs.success, type: "success", duration: 5000,
          showCountdown: true,
          countdownText: o?.countdownText || "This message will close in {seconds} second{s}.",
          pausedText: o?.pausedText || "Timer paused",
          stopText: o?.stopText || "Click to stop.",
          createdAt: Date.now(), replace: true, dedupeKey: `p-ok-${id}`,
        });
    })
    .catch(() => {
      if (_addToast)
        _addToast({
          id, message: msgs.error, type: "error", duration: 5000,
          showCountdown: true,
          countdownText: o?.countdownText || "This message will close in {seconds} second{s}.",
          pausedText: o?.pausedText || "Timer paused",
          stopText: o?.stopText || "Click to stop.",
          createdAt: Date.now(), replace: true, dedupeKey: `p-err-${id}`,
        });
    });
  return id;
};

/**
 * Programmatically dismiss a toast by ID.
 * @param {number} id
 */
toast.dismiss = (id) => {
  if (_addToast) _addToast({ id, _dismiss: true });
};

// ── Default Themes ──────────────────────────────────────────────

const darkTheme = {
  toastBg: "rgba(30,30,32,.95)",
  toastBorder: "rgba(255,255,255,.08)",
  toastShadow: "0 16px 48px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.04)",
  title: "#f0f0f0",
  desc: "rgba(255,255,255,.5)",
  footerBg: "rgba(0,0,0,.15)",
  footerBorder: "rgba(255,255,255,.06)",
  footerText: "rgba(255,255,255,.35)",
  footerLink: "rgba(255,255,255,.6)",
  progressTrack: "rgba(255,255,255,.04)",
  closeBtnColor: "rgba(255,255,255,.3)",
  closeBtnHover: "rgba(255,255,255,.7)",
  closeBtnHoverBg: "rgba(255,255,255,.06)",
  actionBg: "rgba(255,255,255,.08)",
  actionBorder: "rgba(255,255,255,.15)",
  actionHoverBg: "rgba(255,255,255,.14)",
  actionHoverBorder: "rgba(255,255,255,.25)",
  actionText: "#f0f0f0",
  backdrop: "blur(16px) saturate(1.4)",
};

const lightTheme = {
  toastBg: "rgba(255,255,255,.97)",
  toastBorder: "rgba(0,0,0,.08)",
  toastShadow: "0 16px 48px rgba(0,0,0,.08),0 4px 12px rgba(0,0,0,.05),0 1px 3px rgba(0,0,0,.06)",
  title: "#1a1a1a",
  desc: "rgba(0,0,0,.5)",
  footerBg: "rgba(0,0,0,.025)",
  footerBorder: "rgba(0,0,0,.06)",
  footerText: "rgba(0,0,0,.35)",
  footerLink: "rgba(0,0,0,.6)",
  progressTrack: "rgba(0,0,0,.05)",
  closeBtnColor: "rgba(0,0,0,.25)",
  closeBtnHover: "rgba(0,0,0,.6)",
  closeBtnHoverBg: "rgba(0,0,0,.05)",
  actionBg: "rgba(0,0,0,.05)",
  actionBorder: "rgba(0,0,0,.12)",
  actionHoverBg: "rgba(0,0,0,.1)",
  actionHoverBorder: "rgba(0,0,0,.2)",
  actionText: "#1a1a1a",
  backdrop: "blur(16px) saturate(1.2)",
};

const builtInThemes = { dark: darkTheme, light: lightTheme };

/**
 * Resolve a theme by name or merge a custom theme object on top of the dark base.
 * @param {"dark"|"light"|Object} themeOrName
 * @returns {Object} Resolved theme tokens
 */
const resolveTheme = (themeOrName) => {
  if (!themeOrName) return darkTheme;
  if (typeof themeOrName === "string") return builtInThemes[themeOrName] || darkTheme;
  return { ...darkTheme, ...themeOrName };
};

// ── SVG Icons ───────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#4ade80" strokeWidth="1.5" opacity=".3" />
    <path d="M6.5 10.5l2 2 5-5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1.5" opacity=".3" />
    <path d="M10 6v5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="13.5" r=".75" fill="#f87171" />
  </svg>
);
const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 2.5L1.5 17h17L10 2.5z" stroke="#fbbf24" strokeWidth="1.3" strokeLinejoin="round" opacity=".35" />
    <path d="M10 8v4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="14.5" r=".75" fill="#fbbf24" />
  </svg>
);
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" stroke="#60a5fa" strokeWidth="1.5" opacity=".3" />
    <path d="M10 9v5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="6.5" r=".75" fill="#60a5fa" />
  </svg>
);
const LoadingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ animation: "toastwave-spin .7s linear infinite" }}>
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.8" opacity=".15" />
    <path d="M10 2a8 8 0 018 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" opacity=".5" />
  </svg>
);
const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
  </svg>
);

const iconMap = {
  success: <CheckIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
  loading: <LoadingIcon />,
};

const accentMap = {
  success: "#4ade80",
  error: "#f87171",
  warning: "#fbbf24",
  info: "#60a5fa",
  loading: "#a78bfa",
  default: "#888",
};

// ── Countdown Text Formatter ────────────────────────────────────

const formatCountdown = (template, seconds) => {
  return template
    .replace(/\{seconds\}/g, String(seconds))
    .replace(/\{s\}/g, seconds !== 1 ? "s" : "");
};

// ── Toast Item ──────────────────────────────────────────────────

function ToastItem({ data, onDismiss, position, theme }) {
  const [phase, setPhase] = useState("enter");
  const [paused, setPaused] = useState(false);
  const [remain, setRemain] = useState(data.duration);
  const ivRef = useRef(null);
  const startRef = useRef(Date.now());
  const isTop = position.startsWith("top");
  const hasDur = data.duration !== Infinity;
  const showFooter = hasDur && data.showCountdown !== false;
  const th = theme;

  useEffect(() => {
    if (!hasDur || paused) {
      if (ivRef.current) clearInterval(ivRef.current);
      return;
    }
    startRef.current = Date.now();
    const end = startRef.current + remain;
    ivRef.current = setInterval(() => {
      const left = end - Date.now();
      if (left <= 0) {
        clearInterval(ivRef.current);
        setPhase("exit");
        setTimeout(() => onDismiss(data.id, data.dedupeKey), 320);
      } else {
        setRemain(left);
      }
    }, 50);
    return () => clearInterval(ivRef.current);
  }, [paused, hasDur]);

  useEffect(() => {
    if (data.duration !== Infinity) setRemain(data.duration);
  }, [data.type, data.duration, data.createdAt]);

  useEffect(() => {
    const r = requestAnimationFrame(() => setPhase("visible"));
    return () => cancelAnimationFrame(r);
  }, []);

  const dismiss = () => {
    setPhase("exit");
    setTimeout(() => onDismiss(data.id, data.dedupeKey), 320);
  };

  const stopTimer = (e) => {
    e.stopPropagation();
    setPaused(true);
  };

  const progress = hasDur ? Math.max(0, remain / data.duration) : 1;
  const secs = Math.ceil(remain / 1000);
  const enterY = isTop ? -24 : 24;
  const tf = {
    enter: `translateY(${enterY}px) scale(.95)`,
    visible: "translateY(0) scale(1)",
    exit: `translateY(${enterY}px) scale(.95)`,
  };

  return (
    <div
      onMouseEnter={() => !paused && setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        width: 420,
        maxWidth: "calc(100vw - 32px)",
        background: th.toastBg,
        backdropFilter: th.backdrop,
        WebkitBackdropFilter: th.backdrop,
        border: `1px solid ${th.toastBorder}`,
        borderRadius: 12,
        overflow: "hidden",
        transform: tf[phase],
        opacity: phase === "visible" ? 1 : 0,
        transition: "all .32s cubic-bezier(.16,1,.3,1)",
        boxShadow: th.toastShadow,
      }}
    >
      {/* Content */}
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        {(data.icon || data.type !== "default") && (
          <div style={{ flexShrink: 0, marginTop: 1, color: th.title }}>
            {data.icon || iconMap[data.type]}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: th.title, lineHeight: 1.4 }}>
            {data.message}
          </div>
          {data.description && (
            <div style={{ fontSize: 13, color: th.desc, marginTop: 4, lineHeight: 1.45 }}>
              {data.description}
            </div>
          )}
          {data.action && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (data.action.onClick) data.action.onClick();
                dismiss();
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = th.actionHoverBg;
                e.currentTarget.style.borderColor = th.actionHoverBorder;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = th.actionBg;
                e.currentTarget.style.borderColor = th.actionBorder;
              }}
              style={{
                marginTop: 10,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                borderRadius: 6,
                border: `1px solid ${th.actionBorder}`,
                background: th.actionBg,
                color: th.actionText,
                cursor: "pointer",
                transition: "all .15s ease",
              }}
            >
              {data.action.label}
            </button>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = th.closeBtnHover;
            e.currentTarget.style.background = th.closeBtnHoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = th.closeBtnColor;
            e.currentTarget.style.background = "transparent";
          }}
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            border: "none",
            background: "transparent",
            color: th.closeBtnColor,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            transition: "all .15s ease",
            padding: 0,
          }}
        >
          <CloseIcon />
        </button>
      </div>

      {/* Countdown footer */}
      {showFooter && (
        <div
          style={{
            borderTop: `1px solid ${th.footerBorder}`,
            padding: "8px 16px",
            background: th.footerBg,
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 12, color: th.footerText }}>
            {paused ? (
              data.pausedText
            ) : (
              <>
                {formatCountdown(data.countdownText, secs)}{" "}
                <span
                  onClick={stopTimer}
                  style={{
                    color: th.footerLink,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                  }}
                >
                  {data.stopText}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {hasDur && !paused && (
        <div style={{ height: 2, background: th.progressTrack, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "100%",
              width: `${progress * 100}%`,
              background: accentMap[data.type] || accentMap.default,
              transition: "width .1s linear",
              borderRadius: "0 1px 1px 0",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ── Toaster Component ───────────────────────────────────────────

/**
 * Toaster container component. Place once in your app.
 *
 * @param {Object} props
 * @param {"top-left"|"top-center"|"top-right"|"bottom-left"|"bottom-center"|"bottom-right"} [props.position="bottom-right"]
 * @param {"dark"|"light"|Object} [props.theme="dark"] - Built-in theme name or custom theme object
 * @param {React.RefObject} [props.container] - Optional ref to scope toasts inside a container (uses absolute positioning)
 */
function Toaster({ position = "bottom-right", theme = "dark", container }) {
  const [toasts, setToasts] = useState([]);
  const resolvedThemeObj = resolveTheme(theme);

  useEffect(() => {
    _addToast = (t) => {
      if (t._dismiss) {
        setToasts((p) => {
          const f = p.find((x) => x.id === t.id);
          if (f) _unreg(f.dedupeKey);
          return p.filter((x) => x.id !== t.id);
        });
        return;
      }
      setToasts((p) => {
        if (t.replace) {
          const o = p.find((x) => x.id === t.id);
          if (o) _unreg(o.dedupeKey);
          return p.map((x) => (x.id === t.id ? { ...t } : x));
        }
        return [...p, t];
      });
    };
    return () => {
      _addToast = null;
    };
  }, []);

  const dismiss = useCallback((id, dk) => {
    _unreg(dk);
    setToasts((p) => p.filter((x) => x.id !== id));
  }, []);

  const [vPos, hPos] = position.split("-");
  const isCenter = hPos === "center";

  return (
    <div
      style={{
        position: container ? "absolute" : "fixed",
        zIndex: 99999,
        display: "flex",
        flexDirection: vPos === "top" ? "column" : "column-reverse",
        alignItems: isCenter ? "center" : hPos === "left" ? "flex-start" : "flex-end",
        gap: 10,
        padding: container ? 12 : 20,
        pointerEvents: "none",
        ...(vPos === "top" ? { top: 0 } : { bottom: 0 }),
        ...(isCenter ? { left: 0, right: 0 } : hPos === "left" ? { left: 0 } : { right: 0 }),
      }}
    >
      <style>{`@keyframes toastwave-spin{to{transform:rotate(360deg)}}`}</style>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <ToastItem data={t} onDismiss={dismiss} position={position} theme={resolvedThemeObj} />
        </div>
      ))}
    </div>
  );
}

// ── Exports ─────────────────────────────────────────────────────

export { toast, Toaster, darkTheme, lightTheme, resolveTheme, registerActionPreset };
export default toast;
