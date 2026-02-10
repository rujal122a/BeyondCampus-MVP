
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BeyondCampus | Life happens BeyondCampus",
  description: "Find flats, roommates, and food services. The ultimate community living OS.",
};

import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "font-sans antialiased")}>
        <Navbar />
        <main className="pt-24 pb-12 min-h-screen">
          {children}
        </main>
        <Toaster position="bottom-center" richColors />
      </body>
    </html>
  );
}
