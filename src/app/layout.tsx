import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taklif — Onlayn to‘y taklifnomalari",
  description: "O‘zbekistondagi zamonaviy juftliklar uchun chiroyli onlayn to‘y taklifnomalari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
