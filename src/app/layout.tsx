import type { Metadata } from "next";
import { Orbitron, Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { TransitionProvider } from "@/context/TransitionContext";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"] as any,
});

export const metadata: Metadata = {
  title: "Hasan Parlatır | Game Developer",
  description: "Portfolio of Hasan Parlatır, Independent Game Developer & Designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preload" as="video" href="/gallery/bigbang.mp4" type="video/mp4" />
        <link rel="preload" as="video" href="/Skybox/Hyperspace%20kalkis.mp4" type="video/mp4" />
      </head>
      <body className={`${orbitron.variable} ${inter.variable} ${rajdhani.variable} font-sans text-white antialiased`}>
        <TransitionProvider>
          <LanguageProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </LanguageProvider>
        </TransitionProvider>
      </body>
    </html>
  );
}

