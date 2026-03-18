import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "ROOTS",
  description: "Grow your knowledge. Explore your potential.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased bg-[#050a0e] text-[#e2ffe8]`} style={{ fontFamily: 'var(--font-dm-sans)' }}>
        {children}
      </body>
    </html>
  );
}
