"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Target, Brain, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";

export default function RejalarimPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [duration, setDuration] = useState<number>(7);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const toggleDay = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter((d) => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center mb-8 w-full">
          <Link href="/" className="neu-button p-2 text-[#8a7b78] hover:text-[#2d2d2d]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold text-[#2d2d2d] ml-4 drop-shadow-sm">Rejalarim</h1>
        </div>

        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col gap-6"
            >
              <div className="neu-card p-6 border border-white/40">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-8 h-8 text-[#ff756b]" />
                  <h2 className="text-xl font-bold text-[#2d2d2d]">Neyroplastika Haqiqati</h2>
                </div>
                <p className="text-sm text-[#8a7b78] leading-relaxed font-medium mb-4">
                  Kognitiv fanlar shuni isbotlaydiki, miya o'zining strukturasini o'zgartirishi (neyroplastika) uchun 
                  <span className="text-[#ff756b] font-bold"> har kunlik takrorlanuvchi harakat </span> kerak. 
                  Bir marta olingan ilhom 24 soat ichida so'nadi. Muvaffaqiyat - bu his-tuyg'ularga tayanib emas, 
                  balki aniq tizimga asoslanib qilingan ongli tanlovdir.
                </p>
                <div className="bg-[#fcf1ef] p-4 rounded-2xl shadow-[inset_2px_2px_5px_rgba(220,195,185,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/20">
                  <p className="text-xs text-[#2d2d2d] font-bold italic">
                    "Siz maqsadlaringiz darajasiga ko'tarilmaysiz, tizimingiz darajasiga tushasiz." — Neyropsixologiya qoidasi
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <h3 className="text-sm font-bold text-[#2d2d2d] uppercase tracking-wider text-center">
                  O'zingizga qancha vaqt berasiz?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDuration(7)}
                    className={`neu-button py-4 font-bold transition-all ${
                      duration === 7 ? "text-[#ff756b] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]" : "text-[#8a7b78]"
                    }`}
                  >
                    7 Kun (Boshlanish)
                  </button>
                  <button
                    onClick={() => setDuration(21)}
                    className={`neu-button py-4 font-bold transition-all ${
                      duration === 21 ? "text-[#ff756b] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]" : "text-[#8a7b78]"
                    }`}
                  >
                    21 Kun (Odat)
                  </button>
                </div>

                <button
                  onClick={() => setHasStarted(true)}
                  className="mt-6 neu-button bg-[#ff756b] text-[#fcf1ef] py-4 rounded-full font-bold tracking-wide flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Qat'iy Qaror Qildim
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="neu-card p-6 border border-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#2d2d2d] mb-1">Jarayon ketyapti</h2>
                  <p className="text-xs text-[#8a7b78] font-bold">
                    {completedDays.length} / {duration} kun bajarildi
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-[#fcf1ef] shadow-[inset_2px_2px_5px_rgba(220,195,185,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] flex items-center justify-center">
                  <span className="text-[#ff756b] font-bold text-lg">
                    {Math.round((completedDays.length / duration) * 100)}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-2">
                {Array.from({ length: duration }).map((_, i) => {
                  const day = i + 1;
                  const isCompleted = completedDays.includes(day);
                  
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`relative flex flex-col items-center justify-center py-4 rounded-[20px] transition-all duration-300 ${
                        isCompleted 
                          ? "bg-[#fcf1ef] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]" 
                          : "neu-button hover:text-[#ff756b]"
                      }`}
                    >
                      <span className={`text-xs font-bold mb-1 ${isCompleted ? "text-[#8a7b78]" : "text-[#2d2d2d]"}`}>
                        Kun {day}
                      </span>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-[#ff756b]" />
                      ) : (
                        <Circle className="w-6 h-6 text-[#8a7b78]/50" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
