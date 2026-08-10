"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle } from "lucide-react";

const PODCASTS = [
  {
    id: 1,
    author: "Pivot Uz",
    title: "DOMO qanday qilib millionlar ehtiyojiga aylandi?",
    image: "https://img.youtube.com/vi/FxtpUN1ebPk/maxresdefault.jpg",
    link: "https://www.youtube.com/live/FxtpUN1ebPk?si=xQydY8qxycAtAh5m",
  },
  {
    id: 2,
    author: "Amira Rashidova",
    title: "Qiz bola tarbiyasi qanday bo'lishi kerak?",
    image: "https://img.youtube.com/vi/cFGbZmd1jno/maxresdefault.jpg",
    link: "https://youtu.be/cFGbZmd1jno?si=6Pgjo9AVeY3yHqR5",
  },
  {
    id: 3,
    author: "SAPFIRIYA",
    title: "Nega hayotingizda bir xil qiyinchiliklar takrorlanadi?",
    image: "https://img.youtube.com/vi/6L5cAlt76rU/maxresdefault.jpg",
    link: "https://youtu.be/6L5cAlt76rU?si=45YxShw7K4M32XXy",
  },
  {
    id: 4,
    author: "Barno Mukimova",
    title: "Affirmatsiyalar haqida sizni aldashgan bo'lishi mumkin",
    image: "https://img.youtube.com/vi/ZuK-axYno5U/maxresdefault.jpg",
    link: "https://youtu.be/ZuK-axYno5U?si=HsdhQsg6Whrl8Uzo",
  },
  {
    id: 5,
    author: "Parvina Shoaliyeva",
    title: "Hayot va uning qonuniyatlari | Jonli efir yozuvi",
    image: "https://img.youtube.com/vi/_aUlaqsjMqI/maxresdefault.jpg",
    link: "https://youtu.be/_aUlaqsjMqI?si=wO7HLdTLvzR3PA4q",
  },
];

/* YouTube SVG icon */
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function PodcastCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PODCASTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-[32px] overflow-hidden bg-[#F5F8F2] shadow-sm neu-card"
    >
      {/* Green Header with YouTube icon */}
      <div className="bg-[#49A045] px-5 py-3 flex items-center gap-2.5">
        <YoutubeIcon className="w-5 h-5 text-white" />
        <span className="text-white text-[13px] font-bold tracking-wide">Foydali videolar</span>
      </div>

      {/* Content: Image Left + Text Right */}
      <div className="relative h-[90px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.a
            key={currentIndex}
            href={PODCASTS[currentIndex].link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex items-center gap-4 px-5 py-4 cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative w-[100px] h-[65px] rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              <img
                src={PODCASTS[currentIndex].image}
                alt={PODCASTS[currentIndex].author}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                <PlayCircle className="w-7 h-7 text-white drop-shadow-md" />
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <h3 className="text-[16px] font-bold text-[#2C3E2D] leading-snug font-serif line-clamp-1">
                {PODCASTS[currentIndex].author}
              </h3>
              <p className="text-[11px] text-[#6B7A6A] font-medium leading-snug mt-1 line-clamp-2">
                {PODCASTS[currentIndex].title}
              </p>
            </div>
          </motion.a>
        </AnimatePresence>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-1.5 pb-3 relative z-10">
        {PODCASTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-4 bg-[#49A045]" : "w-1.5 bg-[#49A045]/20 hover:bg-[#49A045]/40"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
}
