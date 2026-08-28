import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Andi Muchlas — Backend & Spatial Systems Engineer",
  description:
    "Andi Muchlas is a backend engineer specializing in spatial computing, high-throughput APIs and distributed systems — routing engines, geospatial ETL pipelines and low-latency microservices.",
  icons: { icon: "/assets/image/Logo.png" },
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

