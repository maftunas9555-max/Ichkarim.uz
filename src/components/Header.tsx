"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center glass-soft rounded-b-2xl"
    >
      <h1 className="text-2xl font-bold tracking-widest text-[#2d2d2d] drop-shadow-sm">
        ICHKARIM
      </h1>
      <button className="relative p-2 rounded-full hover:bg-white/30 transition-colors text-xl neu-button">
        🔔
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ff756b] rounded-full border-2 border-[#fcf1ef]"></span>
      </button>
    </motion.header>
  );
}
