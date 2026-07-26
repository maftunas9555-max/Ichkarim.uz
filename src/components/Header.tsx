"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center glass rounded-b-2xl"
    >
      <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
        ICHKARIM
      </h1>
      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-xl">
        🔔
        <span className="absolute top-1.5 right-2 w-2 h-2 bg-neon-teal rounded-full shadow-[0_0_8px_rgba(0,245,212,0.8)]"></span>
      </button>
    </motion.header>
  );
}
