"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  neon?: boolean;
}

export default function FloatingCard({ children, className, delay = 0, neon = false }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={cn(
        "rounded-2xl p-6 transition-all duration-300",
        neon ? "glass-neon" : "glass",
        className
      )}
    >
      <div className="h-full">
        {children}
      </div>
    </motion.div>
  );
}
