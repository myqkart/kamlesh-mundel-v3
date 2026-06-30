export const siteConfig = {
  name: "Kamlesh Mundel",
  shortName: "Kamlesh Mundel",
  title: "Kamlesh Mundel — Creator & Engineer",
  tagline: "Building experiences that people remember.",
  description:
    "Creative engineer crafting premium digital products at the intersection of design, motion, and code. Next.js, WebGL, and performance-first architecture for startups and agencies.",
  keywords: [
    "Kamlesh Mundel",
    "creative engineer",
    "frontend developer",
    "Next.js developer",
    "WebGL developer",
    "portfolio",
    "React developer",
    "full stack engineer",
    "motion design",
    "India",
  ],
  author: "Kamlesh Mundel",
  locale: "en_IN",
  email: "kamlesh.mundel@gmail.com",
  location: "India",
  jobTitle: "Creative Engineer & Full-Stack Developer",
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    x: "https://x.com",
    instagram: "https://instagram.com",
  },
  skills: [
    "Next.js",
    "React",
    "TypeScript",
    "WebGL",
    "Three.js",
    "GSAP",
    "Node.js",
    "Python",
  ],
} as const;

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
