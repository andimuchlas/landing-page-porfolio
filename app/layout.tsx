import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-archivo",
  axes: ["wdth"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Andi Muchlas — Full-Stack & Spatial Systems Engineer",
  description:
    "Andi Muchlas is a Full-Stack & Spatial Systems Engineer building location-based web and mobile applications, high-throughput APIs, and distributed geospatial systems.",
  icons: {
    icon: [
      { url: "/assets/image/Logo.png" },
      { url: "/favicon.ico" },
    ],
    apple: "/assets/image/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <body className="bg-bg text-ink font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

