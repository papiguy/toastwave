import React, { useRef } from "react";
import { toast, Toaster } from "toastwave";

const btn = {
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "inherit",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(255,255,255,.06)",
  color: "#e4e4e7",
  cursor: "pointer",
};

export default function App() {
  const panelARef = useRef(null);
  const panelBRef = useRef(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "48px 32px",
        background: "#0e0e10",
        color: "#e4e4e7",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          📦 Container Scoping Example
        </h1>
        <p style={{ opacity: 0.5, marginBottom: 32 }}>
          Toasts can render inside specific containers using absolute positioning.
          Each panel below has its own independent Toaster.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Panel A — dark theme, top-center */}
          <div
            ref={panelARef}
            style={{
              position: "relative",
              height: 400,
              border: "1.5px solid rgba(255,255,255,.1)",
              borderRadius: 12,
              overflow: "hidden",
              background: "rgba(255,255,255,.02)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: 24,
            }}
          >
            <Toaster position="top-center" theme="dark" container={panelARef} />
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              Panel A — Dark
            </h3>
            <p style={{ fontSize: 12, opacity: 0.4, textAlign: "center", marginBottom: 12 }}>
              position="top-center"
            </p>
            <button
              style={btn}
              onClick={() => toast.success("Panel A toast!", { dedupeKey: "panel-a-success" })}
            >
              Success
            </button>
            <button
              style={btn}
              onClick={() =>
                toast.error("Error in Panel A", {
                  description: "Something broke.",
                  dedupeKey: "panel-a-error",
                })
              }
            >
              Error
            </button>
          </div>

          {/* Panel B — light theme, bottom-center */}
          <div
            ref={panelBRef}
            style={{
              position: "relative",
              height: 400,
              border: "1.5px solid rgba(0,0,0,.15)",
              borderRadius: 12,
              overflow: "hidden",
              background: "#f4f2ef",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: 24,
            }}
          >
            <Toaster position="bottom-center" theme="light" container={panelBRef} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1c1917", marginBottom: 4 }}>
              Panel B — Light
            </h3>
            <p style={{ fontSize: 12, color: "rgba(0,0,0,.4)", textAlign: "center", marginBottom: 12 }}>
              position="bottom-center"
            </p>
            <button
              style={{ ...btn, border: "1px solid rgba(0,0,0,.12)", background: "rgba(0,0,0,.05)", color: "#1c1917" }}
              onClick={() => toast.info("Panel B info", { dedupeKey: "panel-b-info" })}
            >
              Info
            </button>
            <button
              style={{ ...btn, border: "1px solid rgba(0,0,0,.12)", background: "rgba(0,0,0,.05)", color: "#1c1917" }}
              onClick={() =>
                toast.warning("Low storage", {
                  description: "Only 2GB remaining",
                  action: { label: "Manage", onClick: () => toast.info("Opening settings...") },
                  dedupeKey: "panel-b-warning",
                })
              }
            >
              Warning + Action
            </button>
          </div>
        </div>

        <p style={{ marginTop: 24, fontSize: 13, opacity: 0.35, textAlign: "center" }}>
          Note: Each container needs <code>position: relative</code> and <code>overflow: hidden</code>.
          Pass a ref via the <code>container</code> prop to scope toasts.
        </p>
      </div>
    </div>
  );
}
