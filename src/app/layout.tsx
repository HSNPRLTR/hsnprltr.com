import type { Metadata } from "next";
import { Orbitron, Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

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
  // @ts-ignore
  subsets: ["latin", "latin-ext"],
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
      <body className={`${orbitron.variable} ${inter.variable} ${rajdhani.variable} font-sans text-white antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

