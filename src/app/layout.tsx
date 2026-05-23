import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
