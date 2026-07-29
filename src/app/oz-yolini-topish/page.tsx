"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Compass, Send } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const temperamentQuestions = [
  {
    id: 1,
    question: "Yangi vaziyatda birinchi bo'lib kim gapiradi?",
    options: [
      { text: "Men. Avval gapiraman, keyin o'ylayman", score: "X" },
      { text: "Men. Quvnoqlik bilan, yangi tanishishni yaxshi ko'raman", score: "S" },
      { text: "Kuzataman. Vaziyatni tushungach gapiraman", score: "F" },
      { text: "Kamdan-kam. Ko'p o'ylaymanku, hamma so'zlarni", score: "M" },
    ],
  },
  {
    id: 2,
    question: "Qiyin vaziyatda odatda nima qilasiz?",
    options: [
      { text: "Darhol harakatga o'taman, kutib o'tirmayman", score: "X" },
      { text: "Odamlardan yordam so'rayman yoki birodarlarim bilan gaplasman", score: "S" },
      { text: "Tinch fikrlayman, to'g'ri qaror topgunimcha", score: "F" },
      { text: "Ko'p xavotirlanaman, yolg'iz o'tirib o'ylayman", score: "M" },
    ],
  },
  {
    id: 3,
    question: "Ideal dam olish nima sizning uchun?",
    options: [
      { text: "Yangi joyga sayohat, yangi ish, yangi g'alaba", score: "X" },
      { text: "Do'stlar bilan shovqinli uchrashuv", score: "S" },
      { text: "Uy, kitob, tinchlik, tartib", score: "F" },
      { text: "Yolg'izlikda fikrlar, san'at yoki tabiat", score: "M" },
    ],
  },
  {
    id: 4,
    question: "Do'stlaringiz siz haqingizda nima deydi?",
    options: [
      { text: "\"Har doim energiyali va dadil\"", score: "X" },
      { text: "\"Har doim kayfiyatimni ko'taradi\"", score: "S" },
      { text: "\"Ishonchli, puxta, so'zida turadi\"", score: "F" },
      { text: "\"Chuqur, sezgir, o'ychi, kamgap\"", score: "M" },
    ],
  },
  {
    id: 5,
    question: "Muvaffaqiyat sizga qanday keladi?",
    options: [
      { text: "Qo'rqmasdan harakat qilganimda. Risk — bu mening yo'lim", score: "X" },
      { text: "Odamlar bilan birga, jamoa kuchi bilan", score: "S" },
      { text: "Uzoq vaqt puxta tayyorgarlik va sabr orqali", score: "F" },
      { text: "Chuqur fikrlash, boshqalar ko'rmagan narsani ko'rish orqali", score: "M" },
    ],
  },
];

const situationQuestions = [
  {
    id: 1,
    question: "Hayotingizning hozirgi davrida eng ko'p nima o'g'irlab turibdi vaqtingizni?",
    options: [
      { text: "Boshqalar uchun yashash — oila, majburiyat", score: "persona" },
      { text: "Pul topish, lekin yurak so'zi boshqa narsa deya", score: "shadow" },
      { text: "Qo'rquv — shikast yegim kelmaydi, xato qilgim kelmaydi", score: "anima" },
      { text: "Hali aniq maqsadim yo'q, izlayapman", score: "self" },
    ],
  },
  {
    id: 2,
    question: "O'zingizni birinchi marta haqiqatan baxtli his qilganingiz qachon edi?",
    options: [
      { text: "Biror narsani yaratganimda yoki muammo yechganimda", score: "creator" },
      { text: "Kimgadir yordam berganimda va minnatdorlik ko'rganimda", score: "helper" },
      { text: "Rahbar bo'lib, jamoam g'alaba qozonganda", score: "leader" },
      { text: "Yolg'iz o'zimga xos nimadir topganimda", score: "explorer" },
    ],
  },
  {
    id: 3,
    question: "Hozirgi hayotingizda nimani o'zgartirmoqchisiz?",
    options: [
      { text: "Kasbimni yoki ish joyimni", score: "career" },
      { text: "O'zim bilan munosabatimni, o'z-o'zimni hurmatimni", score: "self_esteem" },
      { text: "Munosabatlarni — oila, sevgi, do'stlik", score: "relations" },
      { text: "Hamma narsani — yangi boshlashni xohlayman", score: "restart" },
    ],
  },
];

type Step = "intro" | "stage1" | "stage1done" | "stage2" | "loading" | "chat";

export default function OzYoliniTopish() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQ1, setCurrentQ1] = useState(0);
  const [currentQ2, setCurrentQ2] = useState(0);
  const [answers1, setAnswers1] = useState<string[]>([]);
  const [answers2, setAnswers2] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenNote, setWrittenNote] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "model"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const systemPrompt = `Sen Zigmund Freyd (Psixoanaliz) va Karl Yung (Analitik psixologiya) ta'limotlarini chuqur biladigan psixolog-maslahatchisan. JAVOBING QISQA VA LONDDA bo'lsin. Faqat: 1. Asosiy muammo. 2. Aniq amaliy yo'l. Muallif nomlarini va ortiqcha gapni ishlatma. Doim o'zbek tilida gapir.`;

  const temperamentScores = { X: 0, S: 0, F: 0, M: 0 };
  answers1.forEach((a) => {
    if (a in temperamentScores) temperamentScores[a as keyof typeof temperamentScores]++;
  });

  const getTemperament = () => {
    const max = Math.max(...Object.values(temperamentScores));
    const tip = Object.entries(temperamentScores).find(([_, v]) => v === max)?.[0];
    const map: Record<string, string> = {
      X: "Xolerik — Harakatchan Lider",
      S: "Sangvinik — Ijtimoiy Ilhomchi",
      F: "Flegmatik — Ishonchli Analist",
      M: "Melanxolik — Chuqur Mutafakkir",
    };
    return map[tip || "X"];
  };

  const handleAnswer1 = (score: string) => {
    setSelectedOption(score);
    setTimeout(() => {
      const newA = [...answers1, score];
      setAnswers1(newA);
      setSelectedOption(null);
      if (currentQ1 < temperamentQuestions.length - 1) {
        setCurrentQ1(currentQ1 + 1);
      } else {
        setStep("stage1done");
      }
    }, 350);
  };

  const handleAnswer2 = (score: string) => {
    setSelectedOption(score);
    setTimeout(() => {
      const newA = [...answers2, score];
      setAnswers2(newA);
      setSelectedOption(null);
      if (currentQ2 < situationQuestions.length - 1) {
        setCurrentQ2(currentQ2 + 1);
      } else {
        startAnalysis(newA);
      }
    }, 350);
  };

  const startAnalysis = async (sit: string[]) => {
    setStep("loading");
    const msg = `Temperamentim: ${getTemperament()}. Hozirgi vaziyat: ${sit.join(", ")}. Qo'shimcha: ${writtenNote || "Yozilmadi"}. Meni tahlil qil.`;
    const firstMsg = [{ role: "user" as const, content: msg }];
    setMessages(firstMsg);
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: firstMsg, systemPrompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...firstMsg, { role: "model", content: data.reply || data.message }]);
        setStep("chat");
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const input = chatInput.trim();
    if (!input || isLoading) return;
    const newMsgs = [...messages, { role: "user" as const, content: input }];
    setMessages(newMsgs);
    setChatInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs, systemPrompt }),
      });
      const data = await res.json();
      if (res.ok) setMessages([...newMsgs, { role: "model", content: data.reply || data.message }]);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-24">
      <div className="flex items-center mb-6 w-full">
        <Link href="/" className="neu-button p-2 text-[#8a7b78] hover:text-[#2d2d2d]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-[#2d2d2d] ml-4 drop-shadow-sm">O'z Yo'lini Topish</h1>
      </div>

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {step === "intro" && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-6">
            <div className="neu-card p-6 border border-white/40 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#fcf1ef] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]">
                  <Compass className="w-8 h-8 text-[#ff756b]" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-[#2d2d2d] mb-2">2 Bosqichli Tahlil</h2>
              <p className="text-sm text-[#8a7b78] leading-relaxed font-medium mb-4">
                <strong className="text-[#ff756b]">1-bosqich:</strong> Temperamentingizni aniqlaymiz<br />
                <strong className="text-[#ff756b]">2-bosqich:</strong> Hozirgi hayot holatini tahlil qilamiz
              </p>
              <div className="flex gap-3 justify-center mb-6">
                <span className="text-xs px-4 py-1.5 rounded-full neu-button text-[#8a7b78] font-bold">8 savol</span>
                <span className="text-xs px-4 py-1.5 rounded-full neu-button text-[#8a7b78] font-bold">~5 daqiqa</span>
              </div>
              <button onClick={() => setStep("stage1")} className="w-full bg-[#ff756b] text-white py-3 rounded-full font-bold shadow-[0_4px_15px_rgba(255,117,107,0.4)] active:scale-95 transition-all">
                Boshlash →
              </button>
            </div>
          </motion.div>
        )}

        {/* BOSQICH 1: Temperament */}
        {step === "stage1" && (
          <motion.div key="stage1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#ff756b] uppercase tracking-wider">1-Bosqich: Temperament</span>
              <span className="text-xs text-[#8a7b78] font-bold">{currentQ1 + 1}/{temperamentQuestions.length}</span>
            </div>
            <div className="h-2 bg-[#fcf1ef] rounded-full shadow-[inset_2px_2px_5px_rgba(220,195,185,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
              <motion.div className="h-full bg-[#ff756b] rounded-full" animate={{ width: `${((currentQ1 + 1) / temperamentQuestions.length) * 100}%` }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentQ1} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <div className="neu-card p-6 border border-white/40">
                  <p className="text-[#2d2d2d] font-bold text-base leading-relaxed mb-5">{temperamentQuestions[currentQ1].question}</p>
                  <div className="flex flex-col gap-3">
                    {temperamentQuestions[currentQ1].options.map((opt, i) => (
                      <button key={i} onClick={() => handleAnswer1(opt.score)}
                        className={`text-left p-4 rounded-2xl text-sm font-medium transition-all active:scale-[0.98] ${
                          selectedOption === opt.score ? "bg-[#ff756b] text-white shadow-md" : "neu-button text-[#2d2d2d]"
                        }`}>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* BOSQICH 1 NATIJA */}
        {step === "stage1done" && (
          <motion.div key="stage1done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
            <div className="neu-card p-6 border border-white/40 text-center">
              <div className="text-5xl mb-3">🧬</div>
              <h2 className="text-lg font-bold text-[#2d2d2d] mb-1">Temperamentingiz:</h2>
              <p className="text-xl font-bold text-[#ff756b] mb-4">{getTemperament()}</p>
              <p className="text-xs text-[#8a7b78] font-medium mb-5 leading-relaxed">
                Endi hozirgi hayotingizni chuqurroq tahlil qilamiz.
              </p>
              <p className="text-xs text-[#8a7b78] font-bold mb-2 text-left">Qo'shimcha izoh (ixtiyoriy):</p>
              <textarea
                value={writtenNote}
                onChange={(e) => setWrittenNote(e.target.value)}
                placeholder="Masalan: Men hozir ishim bilan qoniqmayapman, lekin nima qilishni bilmayman..."
                className="w-full h-24 p-3 neu-input text-sm text-[#2d2d2d] placeholder:text-[#8a7b78]/50 resize-none rounded-2xl mb-4"
              />
              <button onClick={() => setStep("stage2")} className="w-full bg-[#ff756b] text-white py-3 rounded-full font-bold shadow-[0_4px_15px_rgba(255,117,107,0.4)] active:scale-95 transition-all">
                2-bosqichga o'tish →
              </button>
            </div>
          </motion.div>
        )}

        {/* BOSQICH 2: Hozirgi vaziyat */}
        {step === "stage2" && (
          <motion.div key="stage2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6d6875] uppercase tracking-wider">2-Bosqich: Hozirgi Holat</span>
              <span className="text-xs text-[#8a7b78] font-bold">{currentQ2 + 1}/{situationQuestions.length}</span>
            </div>
            <div className="h-2 bg-[#fcf1ef] rounded-full shadow-[inset_2px_2px_5px_rgba(220,195,185,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
              <motion.div className="h-full bg-[#6d6875] rounded-full" animate={{ width: `${((currentQ2 + 1) / situationQuestions.length) * 100}%` }} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentQ2} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <div className="neu-card p-6 border border-white/40">
                  <p className="text-[#2d2d2d] font-bold text-base leading-relaxed mb-5">{situationQuestions[currentQ2].question}</p>
                  <div className="flex flex-col gap-3">
                    {situationQuestions[currentQ2].options.map((opt, i) => (
                      <button key={i} onClick={() => handleAnswer2(opt.score)}
                        className={`text-left p-4 rounded-2xl text-sm font-medium transition-all active:scale-[0.98] ${
                          selectedOption === opt.score ? "bg-[#6d6875] text-white shadow-md" : "neu-button text-[#2d2d2d]"
                        }`}>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center mt-20 gap-4">
            <div className="p-6 rounded-full bg-[#fcf1ef] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] animate-pulse">
              <Compass className="w-10 h-10 text-[#ff756b]" />
            </div>
            <p className="text-sm text-[#8a7b78] font-medium">Tahlil qilinmoqda...</p>
          </motion.div>
        )}

        {/* CHAT */}
        {step === "chat" && (
          <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-[calc(100vh-200px)] gap-3">
            <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 no-scrollbar">
              {messages.filter((m, i) => i > 0 || m.role === "model").map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#ff756b] text-white shadow-md rounded-br-sm"
                      : "neu-card border border-white/40 text-[#2d2d2d] rounded-bl-sm prose prose-sm prose-p:text-[#2d2d2d] prose-strong:text-[#ff756b]"
                  }`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl p-4 text-sm neu-card border border-white/40 text-[#8a7b78] rounded-bl-sm flex gap-1">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                    <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Javob yozing..." disabled={isLoading}
                className="flex-1 h-12 neu-input rounded-full px-4 text-[#2d2d2d] text-sm placeholder:text-[#8a7b78]/50" />
              <button disabled={isLoading || !chatInput.trim()} onClick={handleSend}
                className="h-12 w-12 flex items-center justify-center neu-button text-[#ff756b] rounded-full disabled:opacity-50">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
