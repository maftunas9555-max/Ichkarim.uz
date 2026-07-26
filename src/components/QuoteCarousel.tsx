"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  { text: "Insonning eng katta erkinligi - har qanday vaziyatda o'z munosabatini tanlay olishidir.", author: "Viktor Frankl" },
  { text: "Sizning ongsizligingiz ongli bo'lmaguncha, u hayotingizni boshqaradi va siz buni taqdir deysiz.", author: "Carl Jung" },
  { text: "O'zimizni qanday ko'rsak, dunyoni shunday ko'ramiz.", author: "Alfred Adler" },
  { text: "Har qanday xatti-harakat - bu ehtiyojni qondirish uchun qilingan muloqot shaklidir.", author: "Marshall Rosenberg" },
  { text: "Sizning vizyoningiz faqat o'z qalbingizga qaraganingizdagina oydinlashadi.", author: "Carl Jung" },
  { text: "Muhabbat va ish - bu bizning insoniyligimizning asosidir.", author: "Sigmund Freud" },
];

export default function QuoteCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change quote every 15 seconds for testing (change to 60000 for 1 minute)
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 15000); 
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-32 flex items-center justify-center p-6 glass rounded-2xl mb-6 overflow-hidden border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 blur-xl opacity-50"></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative z-10 text-center flex flex-col items-center justify-center gap-2"
        >
          <p className="text-sm italic text-gray-200 font-medium leading-relaxed">
            "{quotes[currentIndex].text}"
          </p>
          <p className="text-[10px] text-neon-teal font-bold uppercase tracking-widest mt-1">
            — {quotes[currentIndex].author}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
