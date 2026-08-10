"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ModuleCardProps {
  title: string;
  subtitle: string;
  footerText: string;
  icon: ReactNode;
  pillText: string;
  colorClass: string;
  delay?: number;
  className?: string;
}

export default function ModuleCard({
  title,
  subtitle,
  footerText,
  icon,
  pillText,
  colorClass,
  delay = 0,
  className,
}: ModuleCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative rounded-[32px] p-6 overflow-hidden bg-white/70 backdrop-blur-2xl border border-white/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer flex flex-col justify-between min-h-[170px]",
        className
      )}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start mb-6">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md", colorClass)}>
          {icon}
        </div>
        <div className="bg-white/70 text-[#2C3E2D] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-white/50 backdrop-blur-md">
          {pillText}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10">
        <h3 className="text-[22px] font-bold text-[#2C3E2D] mb-1 tracking-wide font-serif leading-tight">{title}</h3>
        <p className="text-[13px] text-[#6B7A6A] font-medium mb-4">{subtitle}</p>
        
        <div className="h-[1px] w-full bg-gradient-to-r from-[#2C3E2D]/5 via-[#2C3E2D]/10 to-transparent my-4"></div>
        
        <div className="flex justify-between items-center text-[#49A045] transition-colors">
          <span className="text-[12px] font-bold tracking-wide">{footerText}</span>
          <div className="bg-white/80 p-2 rounded-full shadow-sm border border-white/40 backdrop-blur-md text-[#2C3E2D] group-hover:bg-[#49A045] group-hover:text-white transition-all">
             <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
