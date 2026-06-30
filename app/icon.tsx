import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          borderRadius: "6px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "6px",
            border: "1px solid rgba(0,255,170,0.4)",
          }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#00ffaa",
            letterSpacing: "-0.05em",
          }}
        >
          KM
        </span>
      </div>
    ),
    { ...size }
  );
}
