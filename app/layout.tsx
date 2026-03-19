import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BeyondCampus | Student Housing & Services",
  description:
    "Find flats, roommates, and food services. The ultimate community living platform for students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(outfit.variable, "bg-canvas font-sans antialiased text-text-primary")}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-28">{children}</main>
          <Footer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "rgba(79, 76, 74, 0.96)",
                border: "1px solid rgba(239, 243, 247, 0.6)",
                color: "#f7f8f9",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
