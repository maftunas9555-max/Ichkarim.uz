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

      <div className="relative rounded-[32px] overflow-hidden bg-[#F5F8F2] shadow-sm h-[210px]">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentIndex}
            href={PODCASTS[currentIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 block cursor-pointer"
          >
            {/* Top Wavy Image Section */}
            <div className="absolute top-0 left-0 w-full h-[110px]">
              <img 
                src={PODCASTS[currentIndex].image} 
                alt={PODCASTS[currentIndex].author}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10 transition-colors hover:bg-black/20" />
              
              {/* Play icon centered in the image area */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-[-5px]">
                 <PlayCircle className="w-10 h-10 text-white/90 drop-shadow-md" />
              </div>

              {/* Wavy SVG Divider */}
              <svg
                className="absolute bottom-0 w-full h-8 text-[#F5F8F2] translate-y-[1px]"
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

            {/* Bottom Text Section */}
            <div className="relative pt-[115px] px-5 pb-5">
              <h3 className="text-[19px] font-bold text-[#2C3E2D] mb-1 tracking-wide font-serif line-clamp-1">
                {PODCASTS[currentIndex].author}
              </h3>
              <p className="text-[13px] text-[#6B7A6A] font-medium leading-snug line-clamp-2 pr-8">
                {PODCASTS[currentIndex].title}
              </p>
            </div>
          </motion.a>
        </AnimatePresence>

        {/* Indicators at the bottom right */}
        <div className="absolute bottom-5 right-5 flex gap-1.5 z-10">
          {PODCASTS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                idx === currentIndex ? "w-4 bg-[#49A045]" : "w-1.5 bg-[#49A045]/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
