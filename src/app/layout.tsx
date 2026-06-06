import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const SITE_URL = "https://ghilligolisoda.vercel.app";
const TITLE = "Ghilli – Refreshing in Every Sip";
const DESCRIPTION = "The Indian Goli Soda, Reimagined. 8 bold flavours. Premium craft soda with authentic Indian soul.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Ghilli", "goli soda", "Indian soda", "banta", "craft soda", "premium beverages"],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Ghilli Goli Soda",
    title: TITLE,
    description: DESCRIPTION,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body style={{ background: "#0a0e1a", minHeight: "100vh" }}>{children}</body>
    </html>
  );
}
