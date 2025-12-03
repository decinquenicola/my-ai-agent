import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// --- MODIFICA QUI: Titolo e Nuova Icona (Lente Gialla) ---
export const metadata: Metadata = {
  title: "AI AGENT",
  description: "Il tuo assistente di ricerca avanzato, creato da NDC.",
  icons: {
    // SVG Data URI di una lente d'ingrandimento gialla semplice con tratto spesso
    icon: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23fbbf24' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>`,
  },
};
// -------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}