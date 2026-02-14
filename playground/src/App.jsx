import React, { useState, useRef } from "react";
import { toast, Toaster, registerActionPreset, darkTheme, lightTheme } from "toastwave";
import {
  RocketLaunchIcon,
  SparklesIcon,
  HeartIcon,
  BellAlertIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

// Register a custom action preset
registerActionPreset("retry", (onRetry) => ({
  label: "Retry",
  onClick: onRetry,
}));

const styles = {
  container: {
    padding: "32px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 42,
    fontWeight: 800,
    background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 8,
  },
  subtitle: {
    color: "rgba(255,255,255,.5)",
    fontSize: 16,
  },
  modeToggle: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  modeBtn: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "inherit",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    color: "#e4e4e7",
    cursor: "pointer",
    transition: "all .15s ease",
  },
  modeBtnActive: {
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    border: "1px solid transparent",
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 24,
  },
  card: {
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 16,
    padding: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  cardDesc: {
    color: "rgba(255,255,255,.5)",
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 1.5,
  },
  btnGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  btn: {
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    color: "#e4e4e7",
    cursor: "pointer",
    transition: "all .15s ease",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    border: "none",
    color: "#fff",
  },
  select: {
    padding: "10px 14px",
    fontSize: 13,
    fontFamily: "inherit",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    color: "#e4e4e7",
    cursor: "pointer",
    minWidth: 140,
  },
  scopedContainer: {
    background: "rgba(0,0,0,.3)",
    border: "2px solid rgba(74, 222, 128, 0.3)",
    borderRadius: 12,
    padding: 20,
    position: "relative",
    minHeight: 300,
    overflow: "hidden",
  },
  badge: {
    display: "inline-block",
    padding: "4px 10px",
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 6,
    background: "rgba(139, 92, 246, 0.2)",
    color: "#a78bfa",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  scopedNote: {
    background: "rgba(74, 222, 128, 0.1)",
    border: "1px solid rgba(74, 222, 128, 0.2)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 13,
    color: "rgba(255,255,255,.7)",
  },
};

export default function App() {
  const [mode, setMode] = useState("global"); // "global" or "scoped"
  const [position, setPosition] = useState("bottom-right");
  const [theme, setTheme] = useState("dark");
  const scopedRef = useRef(null);

  // Custom theme example
  const customTheme = {
    ...darkTheme,
    toastBg: "rgba(20, 20, 40, 0.98)",
    toastBorder: "rgba(139, 92, 246, 0.3)",
    toastShadow: "0 20px 60px rgba(139, 92, 246, 0.2), 0 4px 12px rgba(0,0,0,.4)",
  };

  const currentTheme = theme === "custom" ? customTheme : theme;
  const isScoped = mode === "scoped";

  return (
    <div style={styles.container}>
      {/* Toaster - either global or scoped based on mode */}
      {isScoped ? (
        <div style={styles.scopedContainer} ref={scopedRef}>
          <Toaster position={position} theme={currentTheme} container={scopedRef} />
          <div style={styles.scopedNote}>
            <strong>Scoped Mode Active</strong> - Toasts appear inside this container instead of the viewport.
            The container has <code>position: relative</code> and the Toaster uses the <code>container</code> prop.
          </div>
          <ScopedContent position={position} theme={theme} styles={styles} />
        </div>
      ) : (
        <Toaster position={position} theme={currentTheme} />
      )}

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Toastwave Playground</h1>
        <p style={styles.subtitle}>
          Explore all features of the lightweight React toast notification library
        </p>
      </header>

      {/* Mode Toggle */}
      <div style={styles.modeToggle}>
        <button
          style={{ ...styles.modeBtn, ...(mode === "global" ? styles.modeBtnActive : {}) }}
          onClick={() => setMode("global")}
        >
          Global (Window)
        </button>
        <button
          style={{ ...styles.modeBtn, ...(mode === "scoped" ? styles.modeBtnActive : {}) }}
          onClick={() => setMode("scoped")}
        >
          Container Scoped
        </button>
      </div>

      {/* Feature Grid - only show when in global mode */}
      {!isScoped && (
        <div style={styles.grid}>
          {/* Toast Types */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Toast Types</h2>
            <p style={styles.cardDesc}>
              Six built-in toast types for different scenarios. Each has a unique icon and accent color.
            </p>
            <div style={styles.btnGroup}>
              <button style={styles.btn} onClick={() => toast("Default notification")}>
                Default
              </button>
              <button style={styles.btn} onClick={() => toast.success("Operation successful!")}>
                Success
              </button>
              <button style={styles.btn} onClick={() => toast.error("Something went wrong")}>
                Error
              </button>
              <button style={styles.btn} onClick={() => toast.warning("Proceed with caution")}>
                Warning
              </button>
              <button style={styles.btn} onClick={() => toast.info("New update available")}>
                Info
              </button>
              <button style={styles.btn} onClick={() => toast.loading("Processing...")}>
                Loading
              </button>
            </div>
          </section>

          {/* Actions - Presets & Custom */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              Action Buttons
              <span style={styles.badge}>New</span>
            </h2>
            <p style={styles.cardDesc}>
              Add action buttons using presets ("undo", "retry") or custom configurations.
            </p>
            <div style={styles.btnGroup}>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.success("Item deleted", {
                    action: { preset: "undo", onAction: () => toast.info("Restored!") },
                  })
                }
              >
                Undo Preset
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.error("Request failed", {
                    action: { preset: "retry", onAction: () => toast.loading("Retrying...") },
                  })
                }
              >
                Retry Preset
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.info("New version available", {
                    action: { label: "Update Now", onClick: () => toast.success("Updated!") },
                  })
                }
              >
                Custom Action
              </button>
            </div>
          </section>

          {/* Custom Icons */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              Custom Icons
              <span style={styles.badge}>New</span>
            </h2>
            <p style={styles.cardDesc}>
              Use any React icon library (Hero Icons, Lucide, etc.) by passing the <code>icon</code> prop.
            </p>
            <div style={styles.btnGroup}>
              <button
                style={styles.btn}
                onClick={() =>
                  toast("Launching soon!", {
                    icon: <RocketLaunchIcon style={{ width: 20, height: 20, color: "#f472b6" }} />,
                  })
                }
              >
                Rocket
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.success("You're awesome!", {
                    icon: <SparklesIcon style={{ width: 20, height: 20, color: "#fbbf24" }} />,
                  })
                }
              >
                Sparkles
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast("Thanks for the love!", {
                    icon: <HeartIcon style={{ width: 20, height: 20, color: "#f87171" }} />,
                  })
                }
              >
                Heart
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.warning("New notification", {
                    icon: <BellAlertIcon style={{ width: 20, height: 20, color: "#a78bfa" }} />,
                  })
                }
              >
                Bell
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.info("Syncing to cloud...", {
                    icon: <CloudArrowUpIcon style={{ width: 20, height: 20, color: "#60a5fa" }} />,
                  })
                }
              >
                Cloud
              </button>
            </div>
          </section>

          {/* Promise Toasts */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Promise Toasts</h2>
            <p style={styles.cardDesc}>
              Automatically transition from loading to success/error based on promise resolution.
            </p>
            <div style={styles.btnGroup}>
              <button
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={() =>
                  toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 2000)),
                    { loading: "Uploading file...", success: "Upload complete!", error: "Upload failed" }
                  )
                }
              >
                Success Promise
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.promise(
                    new Promise((_, reject) => setTimeout(reject, 2000)),
                    { loading: "Connecting...", success: "Connected!", error: "Connection failed" }
                  )
                }
              >
                Failing Promise
              </button>
            </div>
          </section>

          {/* Countdown Options */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Countdown Timer</h2>
            <p style={styles.cardDesc}>
              Customize or hide the countdown footer. Timer pauses on hover, click to stop.
            </p>
            <div style={styles.btnGroup}>
              <button
                style={styles.btn}
                onClick={() => toast.success("Standard countdown")}
              >
                Default Timer
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.info("Custom countdown", {
                    countdownText: "Closing in {seconds}s",
                    stopText: "Keep open",
                    pausedText: "Paused",
                  })
                }
              >
                Custom Text
              </button>
              <button
                style={styles.btn}
                onClick={() => toast.info("Clean look, no timer", { showCountdown: false })}
              >
                No Countdown
              </button>
              <button
                style={styles.btn}
                onClick={() => toast.warning("This stays until dismissed", { duration: Infinity })}
              >
                Persistent
              </button>
            </div>
          </section>

          {/* Positioning */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Position</h2>
            <p style={styles.cardDesc}>
              Anchor toasts to any corner or center of the screen.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <select
                style={styles.select}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
              <button
                style={styles.btn}
                onClick={() => toast.success(`Position: ${position}`)}
              >
                Test Position
              </button>
            </div>
          </section>

          {/* Theming */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Theming</h2>
            <p style={styles.cardDesc}>
              Built-in dark/light themes or create custom themes with 18+ tokens.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <select
                style={styles.select}
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
                <option value="custom">Custom (Purple)</option>
              </select>
              <button
                style={styles.btn}
                onClick={() => toast.success("Theme preview", { description: `Using ${theme} theme` })}
              >
                Preview Theme
              </button>
            </div>
          </section>

          {/* Deduplication */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Deduplication</h2>
            <p style={styles.cardDesc}>
              Prevent duplicate toasts from stacking. Click rapidly - only one shows!
            </p>
            <div style={styles.btnGroup}>
              <button
                style={styles.btn}
                onClick={() => toast.success("Click me rapidly!", { description: "Only one toast appears" })}
              >
                Auto Dedup
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.info("Custom key toast", {
                    dedupeKey: "my-custom-key",
                    description: "Same key = same toast",
                  })
                }
              >
                Custom Key
              </button>
            </div>
          </section>

          {/* Description */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Rich Content</h2>
            <p style={styles.cardDesc}>
              Add descriptions for additional context below the main message.
            </p>
            <div style={styles.btnGroup}>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.success("File uploaded", {
                    description: "report-2024.pdf (2.4 MB) has been saved to your documents.",
                  })
                }
              >
                With Description
              </button>
              <button
                style={styles.btn}
                onClick={() =>
                  toast.error("Payment failed", {
                    description: "Your card was declined. Please try a different payment method.",
                    action: { label: "Try Again", onClick: () => toast.loading("Processing...") },
                  })
                }
              >
                Full Example
              </button>
            </div>
          </section>

          {/* Programmatic Control */}
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>Programmatic Control</h2>
            <p style={styles.cardDesc}>
              Dismiss toasts programmatically using their ID.
            </p>
            <div style={styles.btnGroup}>
              <button
                style={styles.btn}
                onClick={() => {
                  const id = toast.loading("I can be dismissed...", { duration: Infinity });
                  setTimeout(() => toast.dismiss(id), 3000);
                }}
              >
                Auto Dismiss (3s)
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer style={{ textAlign: "center", marginTop: 64, color: "rgba(255,255,255,.3)", fontSize: 13 }}>
        <p>Toastwave v0.1.0 - Lightweight React Toast Notifications</p>
      </footer>
    </div>
  );
}

// Separate component for scoped mode content
function ScopedContent({ position, theme, styles }) {
  return (
    <div style={styles.grid}>
      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Scoped Toast Types</h2>
        <p style={styles.cardDesc}>
          All toast types work inside the scoped container.
        </p>
        <div style={styles.btnGroup}>
          <button style={styles.btn} onClick={() => toast.success("Scoped success!")}>
            Success
          </button>
          <button style={styles.btn} onClick={() => toast.error("Scoped error!")}>
            Error
          </button>
          <button style={styles.btn} onClick={() => toast.warning("Scoped warning!")}>
            Warning
          </button>
          <button style={styles.btn} onClick={() => toast.info("Scoped info!")}>
            Info
          </button>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.cardTitle}>Scoped with Actions</h2>
        <p style={styles.cardDesc}>
          Actions work the same way in scoped mode.
        </p>
        <div style={styles.btnGroup}>
          <button
            style={styles.btn}
            onClick={() =>
              toast.success("Item removed", {
                action: { preset: "undo", onAction: () => toast.info("Restored!") },
              })
            }
          >
            With Undo
          </button>
          <button
            style={styles.btn}
            onClick={() =>
              toast.info("Scoped toast", {
                description: "This toast appears inside the container, not the viewport.",
              })
            }
          >
            With Description
          </button>
        </div>
      </section>

      <section style={{ ...styles.card, gridColumn: "1 / -1" }}>
        <h2 style={styles.cardTitle}>How Container Scoping Works</h2>
        <p style={styles.cardDesc}>
          Pass a ref to your container element. The container must have <code>position: relative</code> (or absolute/fixed).
        </p>
        <pre style={{
          background: "rgba(0,0,0,.4)",
          padding: 16,
          borderRadius: 8,
          fontSize: 13,
          overflow: "auto",
          color: "rgba(255,255,255,.8)",
        }}>
{`const containerRef = useRef(null);

<div ref={containerRef} style={{ position: 'relative' }}>
  <Toaster
    position="top-right"
    theme="dark"
    container={containerRef}
  />
  <button onClick={() => toast.success('Scoped!')}>
    Show Toast
  </button>
</div>`}
        </pre>
      </section>
    </div>
  );
}
