import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import KeepAlive from "@/components/KeepAlive";
import SessionProvider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex justify-center bg-black">
        <SessionProvider>
          <KeepAlive />
          <div className="w-full max-w-md bg-transparent min-h-screen relative overflow-hidden shadow-2xl flex flex-col">
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
