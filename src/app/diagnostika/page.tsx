"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Activity, Send, ChevronRight } from "lucide-react";
import Link from "next/link";

// 20 questions based on Freud and Jung's theories
const ALL_QUESTIONS = [
  // Freud (Subconscious, Repression, Desires)
  { text: "Oxirgi marta kimga yoki nimaga qattiq g'azablandingiz? Nega?" },
  { text: "Tushingizda tez-tez qanday holat yoki obrazlarni ko'rasiz?" },
  { text: "Sizni eng ko'p qo'rqitadigan narsa nima va u qachon boshlangan?" },
  { text: "Hozir qanday istagingizni boshqalardan (va o'zingizdan) yashiryapsiz?" },
  { text: "Bolaligingizdagi eng yorqin va yoqimsiz xotira qaysi?" },
  { text: "Hech kim bilmaydigan, o'zingiz uyaladigan qanday siringiz bor?" },
  { text: "Qaysi odat yoki xulq-atvoringizni o'zgartira olmayapsiz?" },
  { text: "Boshqalarda eng yomon ko'rgan hislatingiz nima?" },
  
  // Jung (Shadow, Archetypes, Individuation)
  { text: "Hozir o'zingizni biror jonzotga o'xshatsangiz, u nima bo'lardi? Va nega?" },
  { text: "O'zingizdagi qaysi 'qorong'u' yoki salbiy tomonni tan olishni xohlamaysiz (Soyangiz)?" },
  { text: "Hayotingizdagi takrorlanayotgan xatoliklar qaysi? Ular nimani o'rgatmoqda?" },
  { text: "Agar siz ideal inson bo'lganingizda, bugungi kuningiz qanday o'tgan bo'lardi?" },
  { text: "O'zingizga qanday niqob (Persona) taqishni yaxshi ko'rasiz?" },
  { text: "Kimsasiz orolda qolsangiz, birinchi navbatda nima haqida o'ylaysiz?" },
  { text: "Hozir sizning ichingizdagi 'Bola' nimani xohlayapti?" },
  { text: "Hayotingizning hozirgi bosqichini qaysi faslga qiyoslagan bo'lardingiz?" },

  // General Deep reflection
  { text: "Bugun nima sizdan eng ko'p energiyani tortib oldi?" },
  { text: "O'zingizni eng ko'p qachon va kimning oldida xavfsiz his qilasiz?" },
  { text: "Vijdonga xilof ish qilganingizni qachon ohirgi marta sezdingiz?" },
  { text: "Hayotingizda nimani yo'qotishdan eng ko'p qo'rqasiz?" }
];

export default function Diagnostika() {
  const [step, setStep] = useState<"intro" | "questions" | "write" | "chat">("intro");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [finalNote, setFinalNote] = useState("");
  const [messages, setMessages] = useState<{role: "user"|"model", content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pick 5 random questions on mount
  useEffect(() => {
    const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 5).map(q => q.text));
  }, []);

  const handleNextQuestion = () => {
    if (!currentAnswer.trim()) return;
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("write");
    }
  };

  const startAnalysis = async () => {
    if (!finalNote.trim()) return;
    try {
      setIsLoading(true);
      setStep("chat");

      const testResults = questions.map((q, i) => `Savol: ${q}\nJavob: ${answers[i]}`).join("\n\n");
      const initialUserMsg = `Mening psixologik test javoblarim:\n${testResults}\n\nMening hozirgi holatim va fikrlarim:\n${finalNote}`;
      
      const newMsgs = [{ role: "user" as const, content: initialUserMsg }];
      setMessages(newMsgs);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMsgs,
          systemPrompt: `Sen kuchli, prinsipial va haqiqatni yuzga aytadigan psixoanalitik-kouchsan (Zigmund Freyd va Karl Yung yondashuvlari asosida).
Mijozning test javoblari va hozirgi holatiga qarab, uni DIAGNOSTIKA qilasan.
QOIDALAR:
1. QISQA VA LONDDA yoz (150-200 so'z maksimum). Ortiqcha kirish gaplar (Salom, shunday ekan) kerak emas.
2. Jiddiy, hatto biroz qattiqqo'l (lekin yordam beruvchi) kouch kabi gapir. "Siz hozir agressivsiz", "Siz o'zingizni aldayapsiz", "Kibringiz sizga halal beryapti" kabi OCHIQ ayt!
3. Agar holatini aniq anglay olmasang, kouch kabi provokatsion savol ber.
4. Aniq va amaliy YECHIM / MASLAHAT ber (nima qilishi kerakligini buyruq ohangida ayt).`
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMsgs, { role: "model", content: data.reply || data.message }]);
      }
    } catch (err) {
      alert("Xatolik yuz berdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendMsg = async () => {
    const input = chatInput.trim();
    if (!input) return;
    const newMsgs = [...messages, { role: "user" as const, content: input }];
    setMessages(newMsgs);
    setChatInput("");
    try {
      setIsLoading(true);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMsgs,
          systemPrompt: "Sen kouchsan. QISQA, LONDDA, TO'G'RIDAN-TO'G'RI yechim ber. Yuziga ayt."
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMsgs, { role: "model", content: data.reply || data.message }]);
      }
    } catch (e) {} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-5 pt-6 pb-24">
      <div className="flex items-center mb-6 w-full">
        <Link href="/" className="neu-button p-2 text-[var(--color-muted-text)] hover:text-[var(--color-foreground)]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-[var(--color-foreground)] ml-4 drop-shadow-sm">Tezkor Diagnostika</h1>
      </div>

      <AnimatePresence mode="wait">
        {step === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="neu-card p-6 border border-white/40 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[var(--background)] shadow-[inset_4px_4px_10px_rgba(215,200,160,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]">
                  <Activity className="w-8 h-8 text-[var(--color-soft-red)]" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-2">Miya va Ong Osti Tahlili</h2>
              <p className="text-xs text-[var(--color-muted-text)] font-medium mb-6 leading-relaxed">
                Bu diagnostika Freyd va Yung ta'limotiga asoslangan. Sizga 5 ta maxsus savol beriladi. Ular orqali sizning ong osti holatingiz aniqlanadi.
              </p>
              <button
                onClick={() => setStep("questions")}
                className="w-full neu-button bg-[var(--color-soft-red)] text-white py-3 rounded-full font-bold shadow-[0_4px_15px_rgba(255,184,0,0.4)] active:scale-95 transition-all"
              >
                Testni Boshlash
              </button>
            </div>
          </motion.div>
        )}

        {step === "questions" && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="neu-card p-6 border border-white/40">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-[var(--color-soft-red)] uppercase tracking-wider">
                  Savol {currentQ + 1} / 5
                </span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 w-4 rounded-full ${i <= currentQ ? 'bg-[var(--color-soft-red)]' : 'bg-black/10'}`} />
                  ))}
                </div>
              </div>
              
              <h3 className="text-[17px] font-bold text-[var(--color-foreground)] mb-6 leading-relaxed">
                {questions[currentQ]}
              </h3>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Rostini yozing..."
                className="w-full h-32 p-4 neu-input text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-text)]/50 resize-none rounded-2xl mb-4"
              />

              <button
                onClick={handleNextQuestion}
                disabled={!currentAnswer.trim()}
                className="w-full neu-button bg-[var(--color-soft-red)] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Keyingisi <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "write" && (
          <motion.div
            key="write"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="neu-card p-6 border border-white/40 text-center">
              <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-2">So'nggi Qadam</h2>
              <p className="text-xs text-[var(--color-muted-text)] font-medium mb-4">
                Hozirgi holatingiz (qanday his qilayotganingiz, nima qiynayotgani) haqida qisqacha yozing.
              </p>

              <textarea
                value={finalNote}
                onChange={(e) => setFinalNote(e.target.value)}
                placeholder="Men o'zimni shunday his qilyapman..."
                className="w-full h-32 p-4 neu-input text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-muted-text)]/50 resize-none rounded-2xl mb-4"
                disabled={isLoading}
              />

              <button
                onClick={startAnalysis}
                disabled={isLoading || !finalNote.trim()}
                className="w-full neu-button bg-[var(--color-soft-red)] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Tahlil qilinmoqda..." : "Kouch Tahlilini Olish"}
              </button>
            </div>
          </motion.div>
        )}

        {step === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col h-[calc(100vh-180px)] gap-4"
          >
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-2 no-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--color-soft-red)] text-white shadow-md rounded-br-sm"
                        : "neu-card border border-white/40 text-[var(--color-foreground)] rounded-bl-sm prose prose-sm prose-p:text-[var(--color-foreground)]"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl p-4 text-sm neu-card border border-white/40 text-[var(--color-muted-text)] rounded-bl-sm">
                    Tahlil qilinmoqda...
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && sendMsg()}
                placeholder="Javob yozing..."
                className="flex-1 h-12 neu-input rounded-full px-4 text-[var(--color-foreground)] text-sm placeholder:text-[var(--color-muted-text)]/50"
                disabled={isLoading}
              />
              <button
                disabled={isLoading || !chatInput.trim()}
                onClick={sendMsg}
                className="h-12 w-12 flex items-center justify-center neu-button text-[var(--color-soft-red)] rounded-full disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
