import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter_Tight, JetBrains_Mono, Unbounded } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const sans = Inter_Tight({ variable: "--font-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const bebas = Bebas_Neue({ variable: "--font-bebas", subsets: ["latin"], weight: "400" });
const display = Unbounded({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Parrilla 26 · Ferrari, Mercedes y McLaren",
  description:
    "Un lienzo interactivo sobre tres escuderías de Fórmula 1: su historia, sus monoplazas y sus pilotos en la temporada 2026.",
};

export const viewport: Viewport = {
  themeColor: "#040406",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sans.variable} ${mono.variable} ${bebas.variable} ${display.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
