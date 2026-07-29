"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ModuleCard from "@/components/ModuleCard";
import { Activity, Heart, Compass, Zap, Target, Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem("ichkarim_notification_date");
    const today = new Date().toDateString();

    if (lastShown !== today) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeNotification = () => {
    setShowNotification(false);
    localStorage.setItem("ichkarim_notification_date", new Date().toDateString());
  };

  return (
    <div className="flex flex-col px-5 gap-5 pt-4 pb-12 relative">
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-4 left-5 right-5 z-50 neu-card p-5 border border-white/60 bg-[#fcf1ef]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(220,195,185,0.8)] flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white shadow-sm text-[#ff877b]">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#2d2d2d]">Xush kelibsiz!</h3>
              </div>
              <button onClick={closeNotification} className="neu-button p-1.5 text-[#8a7b78] hover:text-[#2d2d2d]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#8a7b78] font-medium leading-relaxed">
              Bugun o'zingizga qanday g'amxo'rlik qildingiz? Rejalaringizni tekshirishni va yangi maqsadlar qo'yishni unutmang.
            </p>
            <button onClick={closeNotification} className="w-full mt-2 bg-[#ff877b] text-white py-2.5 rounded-xl font-bold shadow-[0_4px_15px_rgba(255,135,123,0.4)] active:scale-95 transition-all">
              Boshlash
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. Rejalarim (My Plans) */}
      <Link href="/rejalarim" className="block w-full">
        <ModuleCard
          delay={0.1}
          title="Rejalarim"
          subtitle="Kunlik rivojlanish trekeri"
          footerText="Bugungi vazifalar"
          pillText="Muhim"
          icon={<Target className="w-6 h-6" />}
          colorClass="bg-[#ff877b]"
          className="shadow-[0_4px_30px_rgba(255,135,123,0.3)]"
        />
      </Link>

      <div className="flex flex-col gap-5">
        
        {/* 2. Energiya (Yangi Soya o'rniga) */}
        <Link href="/energiya" className="block w-full">
          <ModuleCard
            delay={0.2}
            title="Energiyangizni Yo'naltiring"
            subtitle="Diqqat va resurs tahlili"
            footerText="Freyd va Yung yondashuvi"
            pillText="Tahlil"
            icon={<Zap className="w-6 h-6" />}
            colorClass="bg-[#ffb4a2]"
          />
        </Link>

        {/* 3. Diagnostika */}
        <Link href="/diagnostika" className="block w-full">
          <ModuleCard
            delay={0.3}
            title="Tezkor Diagnostika"
            subtitle="Joriy holatni aniqlash"
            footerText="Erkin fikr yozing"
            pillText="Ai Tahlil"
            icon={<Activity className="w-6 h-6" />}
            colorClass="bg-[#e5989b]"
          />
        </Link>

        {/* 4. Yurak Qolipi */}
        <Link href="/yurak-qolipi" className="block w-full">
          <ModuleCard
            delay={0.4}
            title="Yurak Qolipi"
            subtitle="Munosabatlar arxitekturasi"
            footerText="Bir martalik chuqur test"
            pillText="15 savol"
            icon={<Heart className="w-6 h-6" />}
            colorClass="bg-[#b5838d]"
          />
        </Link>

        {/* 5. O'z Yo'lini Topish */}
        <Link href="/oz-yolini-topish" className="block w-full">
          <ModuleCard
            delay={0.5}
            title="O'z Yo'lini Topish"
            subtitle="Kasb va hayot mazmuni"
            footerText="2 bosqichli tahlil"
            pillText="10 savol"
            icon={<Compass className="w-6 h-6" />}
            colorClass="bg-[#6d6875]"
          />
        </Link>

      </div>
    </div>
  );
}
