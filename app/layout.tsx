import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chopin Chat Demo",
  description:
    "A simple chat application created by Modular Cloud using the Chopin framework.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex items-center justify-center h-screen`}
      >
        <div className="w-[46.5rem] h-80 rounded-2xl border border-[#20232C] overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
