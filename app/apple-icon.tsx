import { ImageResponse } from "next/og";
import { siteConfig } from "./lib/site";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(0,255,170,0.2) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            display: "flex",
            width: "64px",
            height: "64px",
            border: "2px solid rgba(0,255,170,0.5)",
            transform: "rotate(45deg)",
            marginBottom: "16px",
          }}
        />
        <span
          style={{
            display: "flex",
            fontSize: "22px",
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {siteConfig.name.split(" ")[0]}
        </span>
      </div>
    ),
    { ...size }
  );
}
