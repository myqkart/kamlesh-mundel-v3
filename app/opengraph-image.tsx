import { ImageResponse } from "next/og";
import { siteConfig } from "./lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          padding: "64px 72px",
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
            backgroundImage:
              "linear-gradient(rgba(0,255,170,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,170,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "60%",
            height: "80%",
            display: "flex",
            background:
              "radial-gradient(ellipse at center, rgba(0,255,170,0.18) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "999px",
              border: "1px solid rgba(0,255,170,0.3)",
              background: "rgba(0,255,170,0.08)",
              color: "#00ffaa",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#00ffaa",
              }}
            />
            Creator & Engineer
          </div>
          <span
            style={{
              display: "flex",
              color: "rgba(255,255,255,0.35)",
              fontSize: "14px",
              letterSpacing: "0.08em",
            }}
          >
            {siteConfig.location}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "88px",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ display: "flex", color: "#ffffff" }}>Kamlesh</span>
            <span style={{ display: "flex", color: "rgba(255,255,255,0.55)" }}>Mundel</span>
          </div>
          <p
            style={{
              display: "flex",
              fontSize: "28px",
              fontWeight: 300,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.4,
              maxWidth: "720px",
              margin: 0,
            }}
          >
            {siteConfig.tagline}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          {siteConfig.skills.slice(0, 5).map((skill) => (
            <div
              key={skill}
              style={{
                display: "flex",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "13px",
                fontFamily: "monospace",
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
