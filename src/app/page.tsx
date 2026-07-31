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
            className="absolute top-4 left-5 right-5 z-50 neu-card p-5 border border-white/60 bg-[#F5F8F2]/95 backdrop-blur-md shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white shadow-sm text-[#49A045]">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#2C3E2D] font-serif text-lg">Xush kelibsiz!</h3>
              </div>
              <button onClick={closeNotification} className="neu-button p-1.5 text-[#6B7A6A] hover:text-[#2C3E2D]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#6B7A6A] font-medium leading-relaxed">
              Bugun o'zingizga qanday g'amxo'rlik qildingiz? Rejalaringizni tekshirishni va yangi maqsadlar qo'yishni unutmang.
            </p>
            <button onClick={closeNotification} className="w-full mt-2 bg-[#2C3E2D] text-white py-2.5 rounded-full font-bold shadow-sm active:scale-95 transition-all">
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
          colorClass="bg-[#49A045]"
          className="shadow-sm"
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
            colorClass="bg-[#2C3E2D]"
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
            colorClass="bg-[#6B7A6A]"
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
            colorClass="bg-[#49A045]"
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
            colorClass="bg-[#2C3E2D]"
          />
        </Link>

      </div>
    </div>
  );
}
