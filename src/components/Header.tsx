"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-transparent"
    >
      <h1 className="text-2xl font-bold tracking-widest text-white drop-shadow-sm font-serif">
        ICHKARIM
      </h1>
      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-xl bg-white/10 shadow-inner text-white border border-white/20 backdrop-blur-md">
        🔔
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white/20"></span>
      </button>
    </motion.header>
  );
}
