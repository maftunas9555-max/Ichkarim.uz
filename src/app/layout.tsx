import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import KeepAlive from "@/components/KeepAlive";
import SessionProvider from "@/components/SessionProvider";

const inter = Inter({
  variable: "--font-inter-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair-serif",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ichkarim",
  description: "Chuqur psixologik transformatsiya ilovasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} font-sans h-full antialiased`}
    >
      <body className="bg-gradient-to-b from-[#49A045] to-[#E7F0E2] min-h-screen text-[#2C3E2D] font-sans flex justify-center">
        <SessionProvider>
          <KeepAlive />
          <div className="w-full max-w-md bg-transparent min-h-screen relative overflow-hidden flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 pt-16">
              {children}
            </main>
            <BottomNav />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
