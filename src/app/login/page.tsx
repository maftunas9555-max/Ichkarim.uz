"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-[#FFF3CD]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center gap-8 text-center"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#FFD966] to-[#FFB800] rounded-3xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl text-white font-bold">I</span>
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-[#2d2d2d]">
            ICHKARIM
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Chuqur psixologik sayohatingizni boshlang
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => signIn("credentials", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-[#FFD966] to-[#FFB800] text-white shadow-[0_4px_15px_rgba(255,184,0,0.4)] font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            Tizimga Kirish
          </button>
        </div>
      </motion.div>
    </div>
  );
}
