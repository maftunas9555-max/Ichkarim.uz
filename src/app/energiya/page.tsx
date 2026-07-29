"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Battery, BatteryMedium, BatteryWarning, Send } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function EnergiyaPage() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const analyzeEnergy = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Soya va Energiya tahlili: ${input}`,
          systemPrompt: "Sen Zigmund Freyd va Karl Yung ta'limotlarini chuqur biluvchi psixoanalitiksan. Mijozning bu javobidan uning psixik energiyasi qayerga ketayotganini (g'iybat, nafrat, qo'rquv, boshqalar haqida o'ylash) aniqla. JAVOBING QISQA VA LONDDA bo'lsin. Faqatgina: 1. Muammo nima (Energiya qayerga oqyapti). 2. Yechim (Amaliy vazifa). Ortiqcha gap va muallif nomlarini ishlatma.",
        }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      setAiResponse(data.reply);
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 flex flex-col items-center">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="flex items-center mb-8 w-full">
          <Link href="/" className="neu-button p-2 text-[#8a7b78] hover:text-[#2d2d2d]">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-[#2d2d2d] ml-4 drop-shadow-sm">Energiyangizni Yo'naltiring</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="neu-card p-6 border border-white/40 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-[#fcf1ef] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]">
                    <Battery className="w-10 h-10 text-[#ff756b]" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-[#2d2d2d] mb-3">Sizning Psixik Energiyangiz</h2>
                <p className="text-sm text-[#8a7b78] leading-relaxed font-medium">
                  Insonning ichki quvvati cheklangan. Birovlar haqida o'ylash, ularni muhokama qilish, xafagarchilik va nafrat —
                  bu sizning shaxsiy maqsadingizga ketishi kerak bo'lgan quvvatni (Libido) havoga sovurishdir. 
                  Bu sizning ichki "Soyangiz" ishga tushganligini anglatadi.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full neu-button bg-[#ff756b] text-[#fcf1ef] py-4 rounded-full font-bold tracking-wide"
                >
                  Energiyamni tekshirish
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex flex-col gap-4"
            >
              <div className="neu-card p-5 border border-white/40">
                <div className="flex items-center gap-2 mb-3">
                  <BatteryWarning className="w-6 h-6 text-[#ff756b]" />
                  <h3 className="font-bold text-[#2d2d2d]">O'zingizga halol bo'ling</h3>
                </div>
                <p className="text-xs text-[#8a7b78] mb-4 font-medium">
                  Hozirgi paytda kimdir sizni asabiylashtiryaptimi? Kimdandir xafamisiz yoki kimningdir hayotiga ko'p qiziqyapsizmi? Vaziyatni yozing.
                </p>
                
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Hozirgi holatim shuki..."
                  className="w-full h-32 p-4 neu-input text-sm text-[#2d2d2d] placeholder:text-[#8a7b78]/50 resize-none rounded-2xl mb-4"
                />

                <button
                  onClick={analyzeEnergy}
                  disabled={loading || !input.trim()}
                  className="w-full neu-button bg-[#ff756b] text-[#fcf1ef] py-3 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Tahlil qilinmoqda...</span>
                  ) : (
                    <>Tahlil Qilish <Send className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && aiResponse && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-4"
            >
              <div className="neu-card p-6 border border-white/40 prose prose-sm max-w-none prose-p:text-[#2d2d2d] prose-headings:text-[#ff756b] prose-strong:text-[#ff756b]">
                <div className="flex justify-center mb-4">
                  <BatteryMedium className="w-8 h-8 text-[#ff756b]" />
                </div>
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
                
                <button
                  onClick={() => {
                    setStep(1);
                    setInput("");
                    setAiResponse(null);
                  }}
                  className="mt-6 w-full neu-button py-3 rounded-full font-bold text-[#8a7b78]"
                >
                  Tushundim, qaytish
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
