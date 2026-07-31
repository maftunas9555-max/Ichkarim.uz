"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, Mic } from "lucide-react";

const PODCASTS = [
  {
    id: 1,
    author: "Amira Rashidova",
    title: "Ikkinchi xotinlar, mahrga \"Gelik\" so'raydiganlar",
    image: "https://img.youtube.com/vi/JCNKByKoaN8/maxresdefault.jpg", // User's provided video thumbnail
    link: "https://youtu.be/JCNKByKoaN8?si=6Q57pESmoNFWzORF",
  },
  {
    id: 2,
    author: "Barno Qayumova",
    title: "O'zlikni anglash va ruhiy balans",
    image: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?q=80&w=600&auto=format&fit=crop", // Aesthetic placeholder
    link: "https://www.youtube.com/results?search_query=Barno+Qayumova+podcast",
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
    <div className="w-full relative mb-5">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Mic className="w-4 h-4 text-[#49A045]" />
        <span className="text-xs font-bold text-[#6B7A6A] tracking-wider uppercase">Tavsiya etamiz</span>
      </div>

      <div className="relative w-full aspect-[16/10] rounded-[32px] overflow-hidden bg-[#F5F8F2] shadow-sm group">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentIndex}
            href={PODCASTS[currentIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 block"
          >
            {/* Background Image */}
            <img 
              src={PODCASTS[currentIndex].image} 
              alt={PODCASTS[currentIndex].author}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E2D]/90 via-[#2C3E2D]/30 to-transparent"></div>

            {/* Play Button Overlay (Visible on Hover/Always subtle) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                <PlayCircle className="w-8 h-8 text-white fill-white/20" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end">
              <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                  <h3 className="font-serif text-[22px] font-bold text-white leading-tight mb-1.5 drop-shadow-md">
                    {PODCASTS[currentIndex].author}
                  </h3>
                  <p className="text-[13px] text-white/90 font-medium leading-snug line-clamp-2 drop-shadow-sm">
                    {PODCASTS[currentIndex].title}
                  </p>
                </div>
              </div>
            </div>
          </motion.a>
        </AnimatePresence>

        {/* Indicators inside the card */}
        <div className="absolute bottom-5 right-6 flex gap-1.5 z-10">
          {PODCASTS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                idx === currentIndex ? "w-5 bg-[#49A045]" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
