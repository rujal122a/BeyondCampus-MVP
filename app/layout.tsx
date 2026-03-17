
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "BeyondCampus | Student Housing & Services",
  description: "Find flats, roommates, and food services. The ultimate community living platform for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.variable, "font-sans antialiased bg-brand-offwhite text-brand-black")}>
        <AuthProvider>
          <Navbar />
          <main className="pt-24 pb-0 min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-center" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
