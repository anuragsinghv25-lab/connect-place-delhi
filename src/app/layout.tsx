import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/bricolage-grotesque";
import { copy } from "@/lib/copy";
import "./globals.css";

// Fonts are self-hosted (npm packages), so builds never depend on Google Fonts.
export const metadata: Metadata = {
  title: `${copy.brand} — ${copy.tagline}`,
  description: copy.landing.sub,
  applicationName: copy.brand,
};

export const viewport: Viewport = {
  themeColor: "#1b1035",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${GeistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
