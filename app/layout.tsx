import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CyberpunkBackground from "./components/CyberpunkBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sergio L. Pereira | Desenvolvedor Front-end",
  description: "Portfólio de Sergio L. Pereira — Desenvolvedor Front-end especializado em Next.js e React.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-white">
        {/* Cyberpunk Background (atrás de tudo) */}
        <CyberpunkBackground />

        {/* Conteúdo da página */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
