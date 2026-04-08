import type { Metadata } from "next";
import { Noto_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { el } from "@/lib/i18n/el";

const notoSans = Noto_Sans({
  variable: "--font-sans-greek",
  subsets: ["latin", "greek", "greek-ext"],
  display: "swap",
});

// Editorial display serif. Used for big headlines to break the monotony of
// pure sans-serif "AI template" look.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: `${el.brand.name} · ${el.brand.tagline}`,
  description: el.home.heroSubtitle,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      className={`${notoSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
