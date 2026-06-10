import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ManyashaChatProvider } from "@/components/ManyashaChat";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Agentum Pro — Партнёрская программа для риелторов",
  description:
    "Зарабатывайте на клиентах с проблемной недвижимостью и долгами. Передайте клиента в Agentum Pro и получите вознаграждение.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-residential-complex.jpg"
          fetchPriority="high"
        />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ManyashaChatProvider>{children}</ManyashaChatProvider>
      </body>
    </html>
  );
}
