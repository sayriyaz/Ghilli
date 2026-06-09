import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://ghilligolisoda.com";
const TITLE = "Ghilli Goli Soda – Refreshing in Every Sip";
const DESCRIPTION = "Ghilli Goli Soda — the Indian marble soda, reimagined. 8 bold flavours: Blueberry, Cola, Green Apple, Lemon Mint, Orange, Paneer, Pineapple, Strawberry. Made in Pudukkottai, Tamil Nadu by Oasis Food & Beverages.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Ghilli Goli Soda",
  },
  description: DESCRIPTION,
  applicationName: "Ghilli Goli Soda",
  keywords: [
    "Ghilli", "Ghilli Goli Soda", "Gilli soda", "goli soda", "marble soda",
    "Indian soda", "banta", "paneer soda", "craft soda", "soft drink",
    "Pudukkottai", "Tamil Nadu beverages", "Oasis Food and Beverages",
  ],
  authors: [{ name: "Oasis Food & Beverages" }],
  creator: "Oasis Food & Beverages",
  publisher: "Oasis Food & Beverages",
  category: "Food & Beverage",
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "2Vy9iHfmjuVJFzHi5ScUwk0jUZV-XLVU_D-knwNw-0w",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Ghilli Goli Soda",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ghilli Goli Soda — all 8 flavours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

// Structured data for rich results (Organization + Brand + Product line)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Oasis Food & Beverages",
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.jpg`,
      email: "oasisfoodbeverag@gmail.com",
      telephone: ["+91 99449 19449", "+91 93444 19991"],
      address: {
        "@type": "PostalAddress",
        streetAddress: "TSNO 8558/8, SSMA Hall Complex, TVS Corner, Pudukkottai – Thirumayam Road, Poonga Nagar",
        addressLocality: "Pudukkottai",
        addressRegion: "Tamil Nadu",
        postalCode: "622003",
        addressCountry: "IN",
      },
      sameAs: [
        "https://www.instagram.com/iamgillisoda/",
        "https://www.facebook.com/iamgillisoda",
      ],
    },
    {
      "@type": "Brand",
      "@id": `${SITE_URL}/#brand`,
      name: "Ghilli Goli Soda",
      slogan: "Refreshing in Every Sip",
      logo: `${SITE_URL}/og-image.jpg`,
      manufacturer: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Ghilli Goli Soda",
      description: DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#flavours`,
      name: "Ghilli Goli Soda Flavours",
      numberOfItems: 8,
      itemListElement: [
        ["Blueberry", "The bestselling original. Bold, crisp, iconic."],
        ["Cola", "Deep, dark fizz with maximum punch."],
        ["Green Apple", "Crisp green apple kick."],
        ["Lemon Mint", "Sharp citrus with mint. Summer refreshment."],
        ["Orange", "Sunny, tropical orange burst."],
        ["Paneer", "The classic Indian paneer/rose soda. Clear and crisp."],
        ["Pineapple", "Sweet, fizzy tropical pineapple."],
        ["Strawberry", "Sweet berry crowd-favourite."],
      ].map(([name, desc], i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `Ghilli Goli Soda — ${name}`,
          description: desc,
          brand: { "@id": `${SITE_URL}/#brand` },
          category: "Carbonated soft drink",
          manufacturer: { "@id": `${SITE_URL}/#organization` },
        },
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        [
          "What is Ghilli Goli Soda?",
          "Ghilli Goli Soda is an Indian marble-bottle (goli / codd-neck) carbonated soft drink brand, reimagined as a premium craft soda. It is made in Pudukkottai, Tamil Nadu by Oasis Food & Beverages and comes in 8 flavours.",
        ],
        [
          "How many flavours does Ghilli have?",
          "8 flavours: Blueberry, Cola, Green Apple, Lemon Mint, Orange, Paneer, Pineapple, and Strawberry.",
        ],
        [
          "Who manufactures Ghilli Goli Soda?",
          "Oasis Food & Beverages, located in Pudukkottai, Tamil Nadu, India.",
        ],
        [
          "How do I become a Ghilli dealer or distributor?",
          "Submit the dealer enquiry form at https://ghilligolisoda.com or call +91 99449 19449 or +91 93444 19991. Enquiries are accepted from all 38 districts of Tamil Nadu and other locations including other Indian states and abroad.",
        ],
        [
          "What is goli soda?",
          "Goli soda (also called banta or marble soda) is a traditional Indian carbonated drink sealed with a glass marble in a codd-neck bottle. You push the marble in to 'pop' the bottle and release the fizz.",
        ],
      ].map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body style={{ background: "#0a0e1a", minHeight: "100vh" }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
