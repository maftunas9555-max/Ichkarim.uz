"use client";

import Link from "next/link";
import ModuleCard from "@/components/ModuleCard";
import QuoteCarousel from "@/components/QuoteCarousel";
import { Activity, Heart, Compass, Moon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col px-5 gap-5 pt-4 pb-12">
      
      <QuoteCarousel />

      <Link href="/diagnostika" className="block w-full">
        <ModuleCard
          delay={0.1}
          title="Tezkor Diagnostika"
          subtitle="Joriy holatni aniqlash · Gabor Maté"
          footerText="1 daqiqalik test"
          pillText="1 daqiqa"
          icon={<Activity className="w-6 h-6" />}
          colorClass="bg-gradient-to-br from-indigo-500 to-indigo-700"
          className="shadow-[0_4px_30px_rgba(99,102,241,0.2)]"
        />
      </Link>

      <div className="flex flex-col gap-5">
        <Link href="/yurak-qolipi" className="block w-full">
          <ModuleCard
            delay={0.2}
            title="Yurak Qolipi"
            subtitle="Munosabatlar · Gottman · Perel"
            footerText="Bir martalik chuqur test"
            pillText="15 savol"
            icon={<Heart className="w-6 h-6" />}
            colorClass="bg-gradient-to-br from-orange-400 to-orange-600"
          />
        </Link>

        <Link href="/oz-yolini-topish" className="block w-full">
          <ModuleCard
            delay={0.3}
            title="O'z Yo'lini Topish"
            subtitle="Ma'no va kasb · Frankl · Robinson"
            footerText="Natijada kasb tavsiyalari"
            pillText="10 savol"
            icon={<Compass className="w-6 h-6" />}
            colorClass="bg-gradient-to-br from-teal-400 to-teal-600"
          />
        </Link>

        <Link href="/soya-bilan-yuzlashish" className="block w-full">
          <ModuleCard
            delay={0.4}
            title="Soya bilan Yuzlashish"
            subtitle="7 kunlik ichki sayohat · Carl Jung"
            footerText="Kuniga 3 savol x 5 javob"
            pillText="5 savol"
            icon={<Moon className="w-6 h-6" />}
            colorClass="bg-gradient-to-br from-slate-600 to-slate-800"
          />
        </Link>
      </div>
    </div>
  );
}
