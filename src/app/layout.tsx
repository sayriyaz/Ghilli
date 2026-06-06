import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghilli – Refreshing in Every Sip",
  description: "The Indian Goli Soda, Reimagined. 8 bold flavours. Premium craft soda with authentic Indian soul.",
  keywords: ["Ghilli", "goli soda", "Indian soda", "banta", "craft soda", "premium beverages"],
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
