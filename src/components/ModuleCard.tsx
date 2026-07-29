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
        "relative rounded-[32px] overflow-hidden bg-[#fcf1ef] cursor-pointer neu-card",
        className
      )}
    >
      {/* Top Wavy Colored Section */}
      <div className={cn("absolute top-0 left-0 w-full h-[110px]", colorClass)}>
        <div className="flex justify-between items-start p-5">
          <div className="text-white opacity-90">{icon}</div>
          <div className="bg-white/20 backdrop-blur-sm text-white/90 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            {pillText}
          </div>
        </div>
        {/* Wavy SVG Divider */}
        <svg
          className="absolute bottom-0 w-full h-8 text-[#fcf1ef] translate-y-[1px]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
        >
          <path
            fill="currentColor"
            fillOpacity="1"
            d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,144C672,128,768,128,864,138.7C960,149,1056,171,1152,176C1248,181,1344,171,1392,165.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative pt-[115px] px-5 pb-5">
        <h3 className="text-[19px] font-bold text-[#2d2d2d] mb-1 tracking-wide">{title}</h3>
        <p className="text-xs text-[#8a7b78] font-medium mb-4">{subtitle}</p>
        
        <div className="h-[1px] w-full bg-[#8a7b78]/10 my-4"></div>
        
        <div className="flex justify-between items-center text-[#ff756b] transition-colors">
          <span className="text-[11px] font-bold tracking-wide">{footerText}</span>
          <div className="bg-[#fcf1ef] p-1.5 rounded-full shadow-[inset_2px_2px_5px_rgba(220,195,185,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
             <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
