import React from "react";
import { toast, Toaster } from "toastwave";

const btnStyle = {
  padding: "10px 18px",
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "inherit",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,.12)",
  background: "rgba(255,255,255,.06)",
  color: "#e4e4e7",
  cursor: "pointer",
  transition: "all .15s ease",
};

export default function App() {
  return (
    <div style={{ padding: "48px 32px", maxWidth: 720, margin: "0 auto" }}>
      {/* Place Toaster once in your app */}
      <Toaster position="bottom-right" theme="dark" />

      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
        🌊 Toastwave — Basic Example
      </h1>
      <p style={{ color: "rgba(255,255,255,.5)", marginBottom: 32 }}>
        Click any button to trigger a toast.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {/* Simple toasts — no action button */}
        <button style={btnStyle} onClick={() => toast("Default notification")}>
          Default
        </button>
        <button style={btnStyle} onClick={() => toast.success("Changes saved!")}>
          Success
        </button>
        <button style={btnStyle} onClick={() => toast.error("Something went wrong")}>
          Error
        </button>
        <button style={btnStyle} onClick={() => toast.warning("Careful with that")}>
          Warning
        </button>
        <button style={btnStyle} onClick={() => toast.info("Update available")}>
          Info
        </button>

        {/* With action button — only shows because we pass `action` */}
        <button
          style={btnStyle}
          onClick={() =>
            toast.success("File deleted", {
              description: "document.pdf has been removed.",
              action: {
                label: "Undo",
                onClick: () => {
                  console.log("Undo delete!");
                  toast.info("File restored");
                },
              },
            })
          }
        >
          With Undo
        </button>

        {/* Promise toast — loading → success */}
        <button
          style={btnStyle}
          onClick={() =>
            toast.promise(
              new Promise((resolve) => setTimeout(resolve, 2000)),
              {
                loading: "Uploading file...",
                success: "Upload complete!",
                error: "Upload failed",
              }
            )
          }
        >
          Promise
        </button>

        {/* Custom countdown text */}
        <button
          style={btnStyle}
          onClick={() =>
            toast.success("Custom countdown", {
              countdownText: "Closing in {seconds}s",
              stopText: "Keep open",
              pausedText: "⏸ Paused",
            })
          }
        >
          Custom Text
        </button>

        {/* No countdown footer */}
        <button
          style={btnStyle}
          onClick={() =>
            toast.info("Clean notification", { showCountdown: false })
          }
        >
          No Countdown
        </button>

        {/* Dedup test — click rapidly, only 1 shows */}
        <button
          style={btnStyle}
          onClick={() =>
            toast.success("Only one of me!", {
              description: "Duplicates are prevented.",
            })
          }
        >
          Dedup Test
        </button>
      </div>
    </div>
  );
}
