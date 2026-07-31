"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUp, Zap, BatteryFull, BatteryMedium, BatteryLow, MessageCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type EnergyLevel = "100" | "50" | "10" | null;

export default function DiagnostikaGreen() {
  const [energy, setEnergy] = useState<EnergyLevel>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [started, setStarted] = useState(false);
  
  // Quiz State
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [currentCard, setCurrentCard] = useState(0);
  const [inputValue, setInputValue] = useState("");
  
  // AI/Chat state
  const [analysisDone, setAnalysisDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: "user" | "model", content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");

  const CARDS = [
    {
      author: "S. Freud",
      quote: "Inson eng ko'p energiyani o'zidan yashirgan haqiqatlariga sarflaydi.",
      question: "Hozir hayotingizda tan olishdan qochayotgan, sizga ichki azob va qarshilik berayotgan narsa nima?"
    },
    {
      author: "C. Jung",
      quote: "Boshqalardagi bizni g'azablantiradigan xislatlar — o'zimizni anglash kalitidir.",
      question: "Atrofingizdagilarning qaysi harakati sizning g'ashingizga tegib, quvvatingizni so'rib olyapti?"
    },
    {
      author: "Asl istak",
      quote: "Sizning qayerga qarayotganingiz emas, nima ko'rayotganingiz muhim.",
      question: "Hech qanday to'siq (qo'rquv, pul, odamlar gapi) bo'lmaganda, ayni damdagi bor kuchingizni nima qilishga sarflardingiz?"
    }
  ];

  const handleSelectEnergy = (level: EnergyLevel) => {
    setEnergy(level);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setStarted(true);
  };

  const submitAnswer = async () => {
    if (!inputValue.trim()) return;
    
    const newAnswers = [...answers];
    newAnswers[currentCard] = inputValue;
    setAnswers(newAnswers);
    setInputValue("");

    if (currentCard < 2) {
      setCurrentCard(currentCard + 1);
    } else {
      // Finished all cards, generate AI analysis
      setAnalysisDone(true);
      await generateAnalysis(newAnswers);
    }
  };

  const generateAnalysis = async (finalAnswers: string[]) => {
    setIsLoading(true);
    
    const userPrompt = `
Mening tanlagan energiyam: ${energy}%
1. Yashirgan haqiqatim (Freyd): ${finalAnswers[0]}
2. Meni g'azablantiradigan xislat (Yung): ${finalAnswers[1]}
3. Asl istagim: ${finalAnswers[2]}
`;
    
    const newMsgs = [{ role: "user" as const, content: userPrompt }];
    setChatMessages(newMsgs);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMsgs,
          systemPrompt: `Siz professional va to'g'ridan-to'g'ri haqiqatni aytuvchi kouch/psixologsiz.
Mijozning muammolarini chuqur tahlil qilib yechim bering.
QAT'IY STRUKTURA:
Javobingiz quyidagi 3 ta qismdan iborat bo'lishi shart (hech qanday salomlashishlarsiz):

🔍 Asl muammo: [Tahlil. Nimaga energiyasi ketyapti va nega o'zini aldayapti]

💡 Yechim: [C. Jung yoki Freyd arxetiplaridan foydalanib yechim. Nima qilish kerakligi haqida aniq ko'rsatma]

🚀 Amaliy qadam: [Shu yerning o'zidayoq qilish kerak bo'lgan konkret 1 ta qadam]`
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages([...newMsgs, { role: "model", content: data.reply || data.message }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isLoading) return;
    
    const newMsgs = [...chatMessages, { role: "user" as const, content: chatInput }];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMsgs,
          systemPrompt: "Sen shaxsiy psixolog kouchsan. Mijozning savoli yoki e'tiroziga real vaqtda empatik, lekin prinsipial va konkret maslahat ber. Qisqa va lo'nda yoz."
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages([...newMsgs, { role: "model", content: data.reply || data.message }]);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  // Find the AI response in chatMessages (it's the first model response)
  const initialAnalysis = chatMessages.find(m => m.role === "model")?.content;
  // Further chat is everything after index 1
  const conversation = chatMessages.slice(2);

  return (
    <div className="flex flex-col min-h-screen text-white relative w-full h-full pb-32 pt-6 px-4">
      {/* Absolute positioning for the global gradient to ensure it's everywhere if body is not covering */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#49A045] to-[#E7F0E2] -z-10" />

      {/* Header */}
      <div className="flex items-center mb-8 relative z-10 w-full">
        <Link href="/" className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 backdrop-blur-md transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {/* SCREEN 1: Energy Selection */}
        {!started && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col w-full"
          >
            <h1 className="text-4xl font-serif leading-tight mb-8 drop-shadow-md text-white">
              Bugun ichki quvvatingiz qanday darajada?
            </h1>

            <div className="flex flex-wrap gap-3 mb-10">
              <button 
                onClick={() => handleSelectEnergy("100")}
                className={`px-5 py-3 rounded-full font-medium text-[15px] flex items-center gap-2 transition-all ${
                  energy === "100" ? "bg-white text-[#49A045] shadow-lg scale-105" : "bg-white/20 text-white backdrop-blur-md border border-white/10"
                }`}
              >
                <Zap className="w-4 h-4" /> 100%
              </button>
              <button 
                onClick={() => handleSelectEnergy("50")}
                className={`px-5 py-3 rounded-full font-medium text-[15px] flex items-center gap-2 transition-all ${
                  energy === "50" ? "bg-white text-[#49A045] shadow-lg scale-105" : "bg-white/20 text-white backdrop-blur-md border border-white/10"
                }`}
              >
                <BatteryMedium className="w-4 h-4" /> 50%
              </button>
              <button 
                onClick={() => handleSelectEnergy("10")}
                className={`px-5 py-3 rounded-full font-medium text-[15px] flex items-center gap-2 transition-all ${
                  energy === "10" ? "bg-white text-[#49A045] shadow-lg scale-105" : "bg-white/20 text-white backdrop-blur-md border border-white/10"
                }`}
              >
                <BatteryLow className="w-4 h-4" /> 10%
              </button>
            </div>

            <AnimatePresence>
              {showConfirm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#F5F8F2] rounded-3xl p-6 shadow-sm text-[#2C3E2D]"
                >
                  <p className="text-lg font-medium mb-6">
                    Energiyangiz aynan qayerga sizib chiqib ketayotganini aniqlaymizmi?
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleConfirm}
                      className="flex-1 bg-[#49A045] hover:bg-[#3d863a] text-white py-3.5 rounded-full font-semibold transition-colors"
                    >
                      Ha, aniqlaymiz
                    </button>
                    <button 
                      onClick={() => { setShowConfirm(false); setEnergy(null); }}
                      className="flex-1 bg-[#2C3E2D]/10 hover:bg-[#2C3E2D]/20 text-[#2C3E2D] py-3.5 rounded-full font-semibold transition-colors"
                    >
                      Orqaga
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* SCREEN 2: Diagnostic Cards */}
        {started && !analysisDone && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col w-full h-full"
          >
            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-white/80 text-sm font-medium">Qadam {currentCard + 1} / 3</span>
              <div className="flex gap-1.5">
                {[0,1,2].map(i => (
                  <div key={i} className={`w-6 h-1.5 rounded-full ${i <= currentCard ? 'bg-white' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            <div className="bg-[#F5F8F2] rounded-3xl p-8 shadow-md text-[#2C3E2D] relative flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-serif font-bold mb-3">{CARDS[currentCard].author}</h2>
                <p className="italic text-[#6B7A6A] mb-8 leading-relaxed font-serif text-lg">
                  "{CARDS[currentCard].quote}"
                </p>
                <p className="font-semibold text-lg leading-snug mb-8">
                  {CARDS[currentCard].question}
                </p>
              </div>

              <div className="relative mt-auto">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Shu yerga yozing..."
                  className="w-full bg-white border border-[#2C3E2D]/10 rounded-3xl p-5 pb-16 text-[#2C3E2D] placeholder-[#6B7A6A]/50 focus:outline-none focus:ring-2 focus:ring-[#49A045]/30 resize-none h-40 shadow-inner"
                />
                <button
                  onClick={submitAnswer}
                  disabled={!inputValue.trim()}
                  className="absolute bottom-4 right-4 bg-[#2C3E2D] text-white w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-[#1a251b] transition-colors"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 3: Analysis & Chat */}
        {analysisDone && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col w-full gap-6"
          >
            <h1 className="text-3xl font-serif font-bold drop-shadow-sm">Tahlil Natijasi</h1>
            
            <div className="bg-[#F5F8F2] rounded-3xl p-6 md:p-8 shadow-md text-[#2C3E2D]">
              {isLoading && !initialAnalysis ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <div className="w-8 h-8 border-4 border-[#49A045] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#6B7A6A] font-medium text-sm animate-pulse">Kouch javob tayyorlamoqda...</p>
                </div>
              ) : (
                <div className="prose prose-p:leading-relaxed prose-p:mb-4 prose-strong:text-[#2C3E2D] text-[#2C3E2D] text-[15px] sm:text-base prose-headings:font-serif prose-headings:text-[#2C3E2D]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {initialAnalysis || ""}
                  </ReactMarkdown>

                  <div className="mt-10 mb-2">
                    <Link href="/oz-yolini-topish" className="w-full inline-flex items-center justify-center bg-[#49A045] hover:bg-[#3d863a] text-white py-4 rounded-full font-semibold transition-colors">
                      Testni boshlash
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Continuous Chat Section */}
            {initialAnalysis && (
              <div className="bg-[#F5F8F2] rounded-3xl p-5 shadow-md flex flex-col h-full max-h-[500px]">
                <div className="flex items-center gap-2 mb-4 px-2">
                  <MessageCircle className="w-5 h-5 text-[#49A045]" />
                  <h3 className="font-serif font-bold text-[#2C3E2D] text-lg">Kouch bilan suhbat</h3>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 px-2 space-y-4 no-scrollbar">
                  {conversation.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-4 rounded-2xl max-w-[85%] text-sm ${
                        msg.role === "user" 
                          ? "bg-[#49A045] text-white rounded-br-none" 
                          : "bg-white text-[#2C3E2D] border border-[#2C3E2D]/10 rounded-bl-none shadow-sm prose prose-sm prose-p:text-[#2C3E2D]"
                      }`}>
                        {msg.role === "user" ? (
                          msg.content
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && conversation.length % 2 === 1 && (
                    <div className="flex justify-start">
                      <div className="p-4 rounded-2xl max-w-[85%] text-sm bg-white text-[#6B7A6A] border border-[#2C3E2D]/10 rounded-bl-none shadow-sm">
                        <span className="animate-pulse">Kouch yozmoqda...</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder="Fikringiz bormi? Shu yerda yozing..."
                    className="w-full bg-white border border-[#2C3E2D]/20 rounded-full pl-5 pr-14 py-4 text-sm text-[#2C3E2D] placeholder-[#6B7A6A] focus:outline-none focus:ring-2 focus:ring-[#49A045]/40"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isLoading}
                    className="absolute right-1.5 top-1.5 bg-[#49A045] text-white w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 transition-colors"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
