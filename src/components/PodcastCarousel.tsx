"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Mic } from "lucide-react";

const PODCASTS = [
  {
    id: 1,
    author: "Amira Rashidova",
    title: "Ikkinchi xotinlar, mahrga \"Gelik\" so'raydiganlar",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop", // Placeholder image for Amira
    link: "https://www.youtube.com/results?search_query=Amira+Rashidova+podcast",
  },
  {
    id: 2,
    author: "Barno Qayumova",
    title: "O'zlikni anglash va ruhiy balans",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop", // Placeholder image for Barno
    link: "https://www.youtube.com/results?search_query=Barno+Mukimova+podcast",
  },
  {
    id: 3,
    author: "Ichkarim Tavsiyasi",
    title: "Inson psixologiyasi: O'zingizni kashf eting",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=200&auto=format&fit=crop", // Placeholder podcast mic
    link: "https://www.youtube.com/results?search_query=psixologiya+podkast",
  }
];

export default function PodcastCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PODCASTS.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-[#F5F8F2] shadow-sm mb-5 p-4 flex flex-col justify-center min-h-[140px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Mic className="w-4 h-4 text-[#49A045]" />
        <span className="text-xs font-bold text-[#6B7A6A] tracking-wider uppercase">Tavsiya etamiz</span>
      </div>
      
      <div className="relative h-20">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentIndex}
            href={PODCASTS[currentIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex items-center gap-4 group"
          >
            {/* Image */}
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border border-[#2C3E2D]/5">
              <img 
                src={PODCASTS[currentIndex].image} 
                alt={PODCASTS[currentIndex].author}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* Text */}
            <div className="flex flex-col justify-center flex-1 pr-2">
              <h3 className="font-serif text-[17px] font-bold text-[#2C3E2D] leading-snug line-clamp-1">
                {PODCASTS[currentIndex].author}
              </h3>
              <p className="text-[12px] text-[#6B7A6A] font-medium leading-tight mt-1 line-clamp-2">
                {PODCASTS[currentIndex].title}
              </p>
            </div>
          </motion.a>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 right-5 flex gap-1.5">
        {PODCASTS.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-4 bg-[#49A045]" : "w-1.5 bg-[#49A045]/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
