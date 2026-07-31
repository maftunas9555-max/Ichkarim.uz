"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Step = "energy" | "cards" | "analysis";

const CARDS = [
  {
    author: "S. Freud",
    quote: "Inson eng ko\u2018p energiyani o\u2018zidan yashirgan haqiqatlariga sarflaydi.",
    question:
      "Hozir hayotingizda tan olishdan qochayotgan, sizga ichki azob va qarshilik berayotgan narsa nima?",
  },
  {
    author: "C. Jung",
    quote:
      "Boshqalardagi bizni g\u2018azablantiradigan xislatlar \u2014 o\u2018zimizni anglash kalitidir.",
    question:
      "Atrofingizdagilarning qaysi harakati sizning g\u2018ashingizga tegib, quvvatingizni so\u2018rib olyapti?",
  },
  {
    author: "Asl istak",
    quote:
      "Sizning qayerga qarayotganingiz emas, nima ko\u2018rayotganingiz muhim.",
    question:
      "Hech qanday to\u2018siq (qo\u2018rquv, pul, odamlar gapi) bo\u2018lmaganda, ayni damdagi bor kuchingizni nima qilishga sarflardingiz?",
  },
];

export default function Diagnostika() {
  const [step, setStep] = useState<Step>("energy");
  const [energy, setEnergy] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Cards state
  const [currentCard, setCurrentCard] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [inputValue, setInputValue] = useState("");

  // Analysis & Chat state
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "model"; content: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ─── handlers ─── */
  const selectEnergy = (level: string) => {
    setEnergy(level);
    setShowModal(true);
  };

  const confirmStart = () => {
    setShowModal(false);
    setStep("cards");
  };

  const submitAnswer = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const updated = [...answers];
    updated[currentCard] = trimmed;
    setAnswers(updated);
    setInputValue("");

    if (currentCard < 2) {
      setCurrentCard(currentCard + 1);
    } else {
      // all 3 cards done — send to AI
      setStep("analysis");
      await generateAnalysis(updated);
    }
  };

  const generateAnalysis = async (finalAnswers: string[]) => {
    setIsLoading(true);

    let energyContext = "";
    if (energy === "100") {
      energyContext = `Mijozning energiyasi 100% (Juda ajoyib). Kouch sifatida vazifang: Bu ulkan quvvatni sochib yubormaslikka va aniq maqsadga yo'naltirishga yordam ber. (Misol: "Sizdagi bu shiddatli energiya ichingizdagi qaysi buyuk maqsadingizni ro'yobga chiqarishni talab qilyapti?").`;
    } else {
      energyContext = `Mijozning energiyasi ${energy}%. Kouch sifatida qat'iy vazifang: Hech qachon darhol maslahat berma yoki sababini oddiygina xulosa qilib qo'yma. Karl Yung ta'limotiga ko'ra, bunday charchoq va quvvatsizlik ko'pincha jamiyat uchun kiyilgan "Persona" (ijtimoiy niqob) ni saqlashga yoki ichki "Soya" (bostirilgan hislar) bilan kurashishga sarflanadi. Shuni hisobga olib, mijozni ichiga chuqurroq sho'ng'it.`;
    }

    const prompt = `Mening holatim:
- Energiya darajam: ${energy}%
- Yashirgan haqiqatim (Freyd): ${finalAnswers[0]}
- Meni g'azablantiradigan xislat (Yung): ${finalAnswers[1]}
- Asl istagim: ${finalAnswers[2]}`;

    const msgs = [{ role: "user" as const, content: prompt }];
    setChatMessages(msgs);

    const systemPrompt = `Sen dunyoga tan olingan, Karl Yung va Zigmund Freyd ta'limotlarini mukammal o'zlashtirgan eng kuchli psixolog-kouchsan.
Sening vazifang mijozga to'g'ridan-to'g'ri, chuqur va uning qalbini larzaga soladigan haqiqatni ochish.

${energyContext}

QAT'IY QOIDALAR:
1. Hech qachon bir vaqtning o'zida birdaniga ko'p maslahat yoki savol berib tashlama. 
2. Agar mijozning javoblari yuzaki (masalan, "bilmadim", "charchadim") bo'lsa, "Nega?" deb tergama. "Qanday vaziyatlarda o'zingizni eng noqulay his qilasiz?" yoki "O'zingizni majbur qilayotgan qaysi jihat..." kabi kouching usullari bilan ochiltir.
3. Har doim empatiya bilan yondash, lekin qat'iyatli bo'l.
4. Javobing qisqa va lo'nda bo'lsin. 
5. Har bir javobing oxirida faqat bitta chuqur o'ylantiradigan savol qoldir.

Tahlilni quyidagi strukturada ber:
🔍 **Sizning holatingiz:** [Yung va Freyd orqali chuqur kouching tahlili]
🚀 **Asosiy savol:** [O'ylantiradigan bitta ochiq savol]`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: msgs,
          systemPrompt,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages([
          ...msgs,
          { role: "model", content: data.reply || data.message },
        ]);
      } else {
        setChatMessages([
          ...msgs,
          { role: "model", content: `❌ Xatolik yuz berdi: ${data.error || "AI xizmatiga ulanib bo'lmadi. Vercel'dagi GEMINI_API_KEY to'g'riligini tekshiring."}` },
        ]);
      }
    } catch {
      setChatMessages([
        ...msgs,
        { role: "model", content: "❌ Tarmoq xatosi. Iltimos qaytadan urinib ko'ring." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChat = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || isLoading) return;

    const updated = [
      ...chatMessages,
      { role: "user" as const, content: trimmed },
    ];
    setChatMessages(updated);
    setChatInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          systemPrompt: `Sen professional Yungian kouchsan. 
QOIDALAR:
- Doim empatiya bilan yondash. Ochiq savollar ber.
- "Nega?" deb tergama, o'rniga "Qanday holatlarda...", "Nima uchun emas, nima maqsadda..." deb so'ra.
- Hech qachon birdaniga ko'p maslahat berma. 
- Oxirida bitta o'ylantiradigan savol ber.
- Suhbat davomida inson muammosini anglab yetsa, suhbatni chiroyli yakunla.`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages([
          ...updated,
          { role: "model", content: data.reply || data.message },
        ]);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const aiResponse = chatMessages.find((m) => m.role === "model")?.content;
  const furtherChat = chatMessages.slice(2);

  /* ─── render ─── */
  return (
    <div className="flex flex-col min-h-screen w-full pb-28">
      {/* Back button */}
      <div className="px-5 pt-5 pb-2">
        <Link
          href="/"
          className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {/* ════════ SCREEN 1: ENERGY ════════ */}
        {step === "energy" && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6"
          >
            {/* Heading */}
            <h1 className="font-serif text-[28px] sm:text-[32px] leading-snug text-white drop-shadow-md mb-8">
              Bugun ichki quvvatingiz
              <br />
              qanday darajada?
            </h1>

            {/* Energy pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {[
                { label: "⚡️ 100%", value: "100" },
                { label: "🔋 50%", value: "50" },
                { label: "🪫 10%", value: "10" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => selectEnergy(item.value)}
                  className={`px-6 py-3 rounded-full text-[15px] font-medium transition-all duration-200 ${
                    energy === item.value
                      ? "bg-white text-[#2C3E2D] shadow-lg scale-105"
                      : "bg-white/15 text-white border border-white/20 backdrop-blur-sm hover:bg-white/25"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
              {showModal && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.97 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-[#F5F8F2] rounded-3xl p-7 shadow-sm"
                >
                  <p className="font-serif text-xl text-[#2C3E2D] leading-relaxed mb-7">
                    Energiyangiz aynan qayerga sizib chiqib ketayotganini
                    aniqlaymizmi?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={confirmStart}
                      className="flex-1 bg-[#49A045] hover:bg-[#3d8a3a] text-white py-3.5 rounded-full font-semibold transition-colors shadow-sm"
                    >
                      Ha, aniqlaymiz
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setEnergy(null);
                      }}
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

        {/* ════════ SCREEN 2: DIAGNOSTIC CARDS ════════ */}
        {step === "cards" && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="px-5 flex flex-col gap-5"
          >
            {/* Progress bar */}
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-white/80 text-sm font-medium">
                Qadam {currentCard + 1} / 3
              </span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-[5px] w-7 rounded-full transition-all duration-300 ${
                      i <= currentCard ? "bg-white" : "bg-white/25"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Single Card */}
            <motion.div
              key={currentCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-[#F5F8F2] rounded-3xl p-7 sm:p-8 shadow-sm"
            >
              {/* Author */}
              <h2 className="font-serif text-[26px] text-[#2C3E2D] font-semibold mb-4">
                {CARDS[currentCard].author}
              </h2>

              {/* Quote */}
              <p className="italic text-[#6B7A6A] text-[15px] leading-relaxed mb-7 font-serif">
                &ldquo;{CARDS[currentCard].quote}&rdquo;
              </p>

              {/* Question */}
              <p className="text-[#2C3E2D] font-medium text-[16px] leading-snug mb-6">
                {CARDS[currentCard].question}
              </p>

              {/* Input Area */}
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Shu yerga yozing..."
                  rows={4}
                  className="w-full bg-[#EDF2E8] rounded-2xl p-5 pr-16 text-[#2C3E2D] text-[15px] placeholder-[#6B7A6A]/50 resize-none focus:outline-none focus:ring-2 focus:ring-[#49A045]/30 transition-shadow"
                />
                <button
                  onClick={submitAnswer}
                  disabled={!inputValue.trim()}
                  className="absolute bottom-3.5 right-3.5 w-11 h-11 bg-[#2C3E2D] hover:bg-[#1e2c1f] text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all active:scale-90"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ════════ SCREEN 3: ANALYSIS + CHAT ════════ */}
        {step === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 flex flex-col gap-5"
          >
            {/* Title */}
            <h1 className="font-serif text-[28px] text-white drop-shadow-md">
              Tahlil natijasi
            </h1>

            {/* AI Analysis Card */}
            <div className="bg-[#F5F8F2] rounded-3xl p-7 shadow-sm">
              {isLoading && !aiResponse ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="w-8 h-8 border-[3px] border-[#49A045] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[#6B7A6A] text-sm font-medium animate-pulse">
                    Kouch javob tayyorlamoqda...
                  </p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-[#2C3E2D] prose-strong:text-[#2C3E2D] prose-p:leading-relaxed prose-p:mb-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiResponse || ""}
                  </ReactMarkdown>
                </div>
              )}

              {aiResponse && (
                <div className="mt-8 pt-6 border-t border-[#2C3E2D]/10">
                  <h3 className="font-serif text-[18px] text-[#2C3E2D] font-semibold mb-4 text-center">
                    Keyingi qadamni tanlang:
                  </h3>
                  <div className="flex flex-col gap-3">
                    {/* Option 1: Podcasts */}
                    <a
                      href="https://www.youtube.com/results?search_query=Amira+Rashidova+Barno+Mukimova+psixologiya"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left bg-[#EDF2E8] hover:bg-[#E7F0E2] text-[#2C3E2D] p-4 rounded-2xl transition-colors shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm">🎙 Podkastlar eshitish</p>
                        <p className="text-[12px] text-[#6B7A6A] mt-1">Ruhiyat va balans (Amira Rashidova, Barno Mukimova)</p>
                      </div>
                      <span className="text-xl">→</span>
                    </a>

                    {/* Option 2: Test */}
                    <Link
                      href="/oz-yolini-topish"
                      className="w-full text-left bg-[#49A045] hover:bg-[#3d8a3a] text-white p-4 rounded-2xl transition-colors shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm">🧠 O'z yo'lini topish</p>
                        <p className="text-[12px] text-white/80 mt-1">Temperament orqali kasb va maqsadni aniqlash</p>
                      </div>
                      <span className="text-xl">→</span>
                    </Link>

                    {/* Option 3: Continue Chat */}
                    <button
                      onClick={() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                      className="w-full text-left bg-[#2C3E2D] hover:bg-[#1e2c1f] text-white p-4 rounded-2xl transition-colors shadow-sm flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm">💬 Kouch bilan suhbat</p>
                        <p className="text-[12px] text-white/80 mt-1">Suhbatni pastda davom ettirish</p>
                      </div>
                      <span className="text-xl">↓</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Ongoing Coach Chat */}
            {aiResponse && (
              <div className="bg-[#F5F8F2] rounded-3xl p-5 shadow-sm flex flex-col">
                {/* Chat header */}
                <div className="flex items-center gap-2.5 mb-4 px-1">
                  <div className="w-8 h-8 rounded-full bg-[#49A045]/15 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-[#49A045]" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#2C3E2D]">
                    Kouch bilan suhbat
                  </h3>
                </div>

                {/* Chat messages */}
                {furtherChat.length > 0 && (
                  <div className="flex flex-col gap-3 mb-4 max-h-[350px] overflow-y-auto no-scrollbar px-1">
                    {furtherChat.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-[#49A045] text-white rounded-br-md"
                              : "bg-white text-[#2C3E2D] border border-[#2C3E2D]/8 rounded-bl-md shadow-sm"
                          }`}
                        >
                          {msg.role === "user" ? (
                            msg.content
                          ) : (
                            <div className="prose prose-sm max-w-none prose-p:text-[#2C3E2D] prose-strong:text-[#2C3E2D]">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-2xl px-4 py-3 text-sm bg-white text-[#6B7A6A] border border-[#2C3E2D]/8 rounded-bl-md">
                          <span className="animate-pulse">
                            Kouch yozmoqda...
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {/* Chat input */}
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChat()}
                    placeholder="Fikringiz bormi? Shu yerda yozing..."
                    disabled={isLoading}
                    className="w-full bg-[#EDF2E8] rounded-full pl-5 pr-14 py-4 text-sm text-[#2C3E2D] placeholder-[#6B7A6A]/60 focus:outline-none focus:ring-2 focus:ring-[#49A045]/30 transition-shadow disabled:opacity-60"
                  />
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || isLoading}
                    className="absolute right-1.5 top-1.5 w-10 h-10 bg-[#49A045] hover:bg-[#3d8a3a] text-white rounded-full flex items-center justify-center disabled:opacity-40 transition-all active:scale-90"
                  >
                    <ArrowUp className="w-4 h-4" />
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
