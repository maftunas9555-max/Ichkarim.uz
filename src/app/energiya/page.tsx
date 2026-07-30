"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Battery, BatteryCharging, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Energiya() {
  const [thoughts, setThoughts] = useState("");
  const [energyLevel, setEnergyLevel] = useState(100);

  // Calculate energy level based on the amount of text written.
  // The more negative thoughts they dump, the lower the energy gets (down to 0).
  useEffect(() => {
    const charCount = thoughts.length;
    // Let's say 200 characters drops energy to 0
    let calculatedEnergy = 100 - Math.floor((charCount / 200) * 100);
    if (calculatedEnergy < 0) calculatedEnergy = 0;
    if (calculatedEnergy > 100) calculatedEnergy = 100;
    
    setEnergyLevel(calculatedEnergy);
  }, [thoughts]);

  // Determine colors based on energy level
  const getEnergyColor = () => {
    if (energyLevel > 50) return "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
    if (energyLevel > 20) return "bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]";
    return "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]";
  };

  const getTextColor = () => {
    if (energyLevel > 50) return "text-green-500";
    if (energyLevel > 20) return "text-yellow-600";
    return "text-red-500";
  };

  const getFeedbackMessage = () => {
    if (energyLevel > 50) return "Energiyangiz joyida. Lekin ichingizda nimadir yig'ilayotgan bo'lsa, uni chiqarib tashlang.";
    if (energyLevel > 20) return "Sizni nimalardir qiynamoqda. Negativ o'ylar energiyangizni so'rib olyapti.";
    return "Diqqat! Energiyangiz 0 ga yaqinlashdi. Siz butunlay negativga to'lib ketgansiz. Buni zudlik bilan to'xtatish kerak!";
  };

  return (
    <div className="flex flex-col min-h-screen px-5 pt-6 pb-24">
      <div className="flex items-center mb-6">
        <Link href="/" className="neu-button p-2 text-[var(--color-muted-text)] hover:text-[var(--color-foreground)]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-[var(--color-foreground)] ml-4 drop-shadow-sm">Energiya</h1>
      </div>

      <div className="flex flex-col items-center justify-center mb-8 mt-4">
        {/* Energy Tank Visual */}
        <div className="relative w-32 h-64 neu-card rounded-3xl p-2 border border-white/40 overflow-hidden flex flex-col justify-end items-center">
          {/* Top terminal of battery */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 neu-card rounded-t-lg z-10" />
          
          <div className="absolute inset-2 rounded-2xl overflow-hidden bg-black/5 z-0 flex flex-col justify-end">
            <motion.div 
              className={`w-full rounded-xl transition-all duration-500 ${getEnergyColor()}`}
              initial={{ height: "100%" }}
              animate={{ height: `${energyLevel}%` }}
              transition={{ type: "spring", bounce: 0.4 }}
            />
          </div>

          <div className="absolute inset-0 flex items-center justify-center z-10 font-bold text-2xl drop-shadow-md text-white mix-blend-difference">
            {energyLevel}%
          </div>
        </div>

        <div className={`mt-6 text-center font-bold text-sm ${getTextColor()} px-4 flex items-center justify-center gap-2`}>
          {energyLevel <= 20 && <AlertTriangle className="w-5 h-5 animate-pulse" />}
          {getFeedbackMessage()}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <label className="text-sm font-bold text-[var(--color-foreground)] ml-2">
          Miyangizni tozalang:
        </label>
        <p className="text-xs text-[var(--color-muted-text)] font-medium ml-2 mb-1">
          Bugun qanday negativ voqealar yoki o'y-hayollar sizni qiynadi? Hammasini yozib qoldiring.
        </p>
        <textarea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Hammasi yomg'irday yog'ib keldi, asablarim chidamyapti..."
          className="w-full flex-1 min-h-[200px] p-5 neu-input text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-text)]/50 resize-none rounded-2xl"
        />
        
        <button
          onClick={() => {
            setThoughts("");
            setEnergyLevel(100);
          }}
          disabled={!thoughts}
          className="mt-2 w-full neu-button bg-[var(--color-foreground)] text-[var(--background)] py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Tozalash va Energiyani Tiklash
        </button>
      </div>
    </div>
  );
}
