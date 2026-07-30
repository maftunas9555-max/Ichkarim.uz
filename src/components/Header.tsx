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
      className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#2d2d2d] rounded-b-2xl shadow-[0_4px_20px_rgba(45,45,45,0.4)]"
    >
      <h1 className="text-xl font-bold tracking-widest text-[#fcf1ef] drop-shadow-sm">
        ICHKARIM
      </h1>
      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-xl bg-[#1c1c1c] shadow-inner text-white border border-white/5">
        🔔
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFB800] rounded-full border-2 border-[#1c1c1c]"></span>
      </button>
    </motion.header>
  );
}
