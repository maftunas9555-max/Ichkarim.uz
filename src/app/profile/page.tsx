"use client";

import FloatingCard from "@/components/FloatingCard";

export default function Profile() {
  return (
    <div className="flex flex-col px-6 gap-6 pt-6 items-center pb-8">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-full opacity-60 blur-md"></div>
          <div className="relative w-full h-full glass rounded-full flex items-center justify-center text-4xl border border-white/20">
            👤
          </div>
        </div>
        <div className="text-center mt-2">
          <h2 className="text-xl font-bold text-white tracking-wide">Foydalanuvchi</h2>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4 mt-12 opacity-50">
        <span className="text-4xl">🌱</span>
        <p className="text-sm text-gray-400 text-center px-6">
          Sizning natijalaringiz va o'sish tarixingiz tez orada shu yerda saqlanadi.
        </p>
      </div>
    </div>
  );
}
