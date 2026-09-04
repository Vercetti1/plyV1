import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/lib/ply";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ply: accessible React components",
    template: "%s · Ply",
  },
  description:
    "A dependency-free React component library in TypeScript and Tailwind CSS, with every WAI-ARIA pattern implemented properly.",
  openGraph: {
    title: "Ply: accessible React components",
    description:
      "A dependency-free React component library in TypeScript and Tailwind CSS.",
    type: "website",
  },
};

/**
 * Applies the stored theme before first paint. This has to be a blocking
 * inline script: doing it in an effect means one frame of the wrong theme,
 * which reads as a flash of white on every load for dark-mode users.
 */
const THEME_SCRIPT = `
try {
  var stored = localStorage.getItem("ply-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        {/* First tab stop on every page, for keyboard and screen-reader users. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-fg"
        >
          Skip to content
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
