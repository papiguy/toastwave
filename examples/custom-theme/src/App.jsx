import React, { useState } from "react";
import { toast, Toaster, darkTheme, lightTheme } from "toastwave";

// Custom theme — override any subset of tokens.
// Missing tokens fall back to the dark theme.
const midnightTheme = {
  toastBg: "rgba(15, 10, 40, 0.96)",
  toastBorder: "rgba(120, 80, 255, 0.15)",
  toastShadow: "0 16px 48px rgba(60, 20, 180, 0.25)",
  title: "#e8e0ff",
  desc: "rgba(200, 180, 255, 0.5)",
  footerBg: "rgba(60, 20, 180, 0.1)",
  footerBorder: "rgba(120, 80, 255, 0.1)",
  footerText: "rgba(200, 180, 255, 0.4)",
  footerLink: "rgba(200, 180, 255, 0.7)",
  progressTrack: "rgba(120, 80, 255, 0.08)",
  closeBtnColor: "rgba(200, 180, 255, 0.3)",
  closeBtnHover: "rgba(200, 180, 255, 0.7)",
  closeBtnHoverBg: "rgba(120, 80, 255, 0.1)",
  actionBg: "rgba(120, 80, 255, 0.12)",
  actionBorder: "rgba(120, 80, 255, 0.2)",
  actionHoverBg: "rgba(120, 80, 255, 0.22)",
  actionHoverBorder: "rgba(120, 80, 255, 0.35)",
  actionText: "#d4c0ff",
  backdrop: "blur(16px) saturate(1.6)",
};

const themeMap = {
  dark: "dark",        // built-in string
  light: "light",      // built-in string
  midnight: midnightTheme, // custom object
};

const pageBgs = { dark: "#0e0e10", light: "#f4f2ef", midnight: "#0a0620" };
const pageColors = { dark: "#e4e4e7", light: "#1c1917", midnight: "#d4c0ff" };

const btnBase = (isLight) => ({
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "inherit",
  borderRadius: 8,
  border: `1px solid ${isLight ? "rgba(0,0,0,.12)" : "rgba(255,255,255,.12)"}`,
  background: isLight ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.06)",
  color: isLight ? "#1c1917" : "#e4e4e7",
  cursor: "pointer",
  transition: "all .15s ease",
});

export default function App() {
  const [theme, setTheme] = useState("dark");
  const isLight = theme === "light";
  const btn = btnBase(isLight);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 32px",
        background: pageBgs[theme],
        color: pageColors[theme],
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        transition: "all .4s ease",
      }}
    >
      <Toaster position="bottom-right" theme={themeMap[theme]} />

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          🎨 Custom Theme Example
        </h1>
        <p style={{ opacity: 0.5, marginBottom: 24 }}>
          Switch themes — toasts automatically adopt the active theme.
        </p>

        {/* Theme switcher */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {["dark", "light", "midnight"].map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                ...btn,
                fontWeight: theme === t ? 700 : 500,
                borderColor: theme === t ? "#a78bfa" : btn.borderColor,
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Toast triggers */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={btn} onClick={() => toast.success("Saved!")}>
            Success
          </button>
          <button style={btn} onClick={() => toast.error("Failed!")}>
            Error
          </button>
          <button
            style={btn}
            onClick={() =>
              toast.success("Archived", {
                action: { label: "Undo", onClick: () => toast.info("Restored") },
              })
            }
          >
            With Undo
          </button>
          <button
            style={btn}
            onClick={() =>
              toast.info("Custom text", {
                countdownText: "Vanishes in {seconds}s",
                stopText: "Pin it",
                pausedText: "📌 Pinned",
              })
            }
          >
            Custom Countdown
          </button>
        </div>
      </div>
    </div>
  );
}
