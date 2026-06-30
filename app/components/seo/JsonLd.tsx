import { getSiteUrl, siteConfig } from "../../lib/site";

export default function JsonLd() {
  const siteUrl = getSiteUrl();

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: siteConfig.name,
    url: siteUrl,
    email: siteConfig.email,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    knowsAbout: siteConfig.skills,
    sameAs: Object.values(siteConfig.social),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteUrl,
    inLanguage: "en-IN",
    author: { "@id": `${siteUrl}/#person` },
    publisher: { "@id": `${siteUrl}/#person` },
  };

  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profile`,
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteUrl,
    mainEntity: { "@id": `${siteUrl}/#person` },
    isPartOf: { "@id": `${siteUrl}/#website` },
  };

  const professionalSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#services`,
    name: `${siteConfig.name} — Digital Product Engineering`,
    description: siteConfig.description,
    url: siteUrl,
    provider: { "@id": `${siteUrl}/#person` },
    areaServed: "Worldwide",
    serviceType: [
      "Web Application Development",
      "Interactive Design Systems",
      "Performance Optimization",
      "Creative Engineering",
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [personSchema, websiteSchema, profileSchema, professionalSchema],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
