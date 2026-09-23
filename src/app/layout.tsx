import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CyberCheck — Auditoría de IA para PyMEs chilenas",
  description: "Plataforma de auditoría de inteligencia artificial con marcos internacionales (NIST AI RMF, ISO 42001, AI Act UE) y marco legal chileno (Ley 19.628, Ley 21.459). Diseñada para PyMEs críticas: salud, servicios básicos, telecomunicaciones.",
  keywords: ["CyberCheck", "auditoría IA", "ciberseguridad Chile", "NIST AI RMF", "ISO 42001", "Ley 19.628", "Ley 21.459", "shadow AI", "PyME"],
  authors: [{ name: "CyberCheck" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CyberCheck — Auditoría de IA",
    description: "Audita el uso responsable, seguro y legal de IA en tu PyME chilena",
    siteName: "CyberCheck",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
