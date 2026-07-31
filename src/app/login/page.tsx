"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 bg-transparent">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center gap-8 text-center neu-card p-8"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#49A045] to-[#2C3E2D] rounded-3xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-4xl text-white font-bold font-serif">I</span>
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-[#2C3E2D] font-serif">
            ICHKARIM
          </h1>
          <p className="text-sm text-[#6B7A6A] mt-2">
            Chuqur psixologik sayohatingizni boshlang
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => signIn("credentials", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#2C3E2D] text-white shadow-md font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            Tizimga Kirish
          </button>
        </div>
      </motion.div>
    </div>
  );
}
