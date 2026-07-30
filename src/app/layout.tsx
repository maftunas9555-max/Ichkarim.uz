import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import KeepAlive from "@/components/KeepAlive";
import SessionProvider from "@/components/SessionProvider";

const poppins = Poppins({
  variable: "--font-poppins-sans",
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
      className={`${poppins.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex justify-center bg-[#FFF3CD]">
        <SessionProvider>
          <KeepAlive />
          <div className="w-full max-w-md bg-transparent min-h-screen relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(215,200,160,0.5)]">
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
