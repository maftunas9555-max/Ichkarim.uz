"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Activity, Send } from "lucide-react";
import Link from "next/link";

export default function Diagnostika() {
  const [step, setStep] = useState(1);
  const [note, setNote] = useState("");
  const [messages, setMessages] = useState<{role: "user"|"model", content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startAnalysis = async () => {
    if (!note.trim()) return;
    try {
      setIsLoading(true);
      const initialUserMsg = `Vaziyatim: ${note}`;
      const newMsgs = [{ role: "user" as const, content: initialUserMsg }];
      setMessages(newMsgs);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMsgs,
          systemPrompt: "Sen Freyd va Yung ta'limotlarini mukammal biladigan psixoanalitiksan. Mijozning yozganlaridan uning qanday his qilayotganini aniqla. JAVOBING QISQA VA LONDDA bo'lsin. Faqat: 1. Muammo (diagnostika). 2. Yechim (aniq va amaliy vazifa). Ortiqcha gap va muallif nomlarini ishlatma."
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMsgs, { role: "model", content: data.reply || data.message }]);
        setStep(2);
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
          systemPrompt: "Faqat QISQA va LONDDA yechim ber."
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
        <Link href="/" className="neu-button p-2 text-[#8a7b78] hover:text-[#2d2d2d]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-[#2d2d2d] ml-4 drop-shadow-sm">Tezkor Diagnostika</h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
            <div className="neu-card p-6 border border-white/40 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#fcf1ef] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]">
                  <Activity className="w-8 h-8 text-[#ff756b]" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-[#2d2d2d] mb-2">Hozirgi holatingiz qanday?</h2>
              <p className="text-xs text-[#8a7b78] font-medium mb-4">
                Ichingizdagi gaplarni, qanday his qilayotganingizni erkin yozing. AI uni tahlil qiladi.
              </p>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Men o'zimni shunday his qilyapman..."
                className="w-full h-32 p-4 neu-input text-sm text-[#2d2d2d] placeholder:text-[#8a7b78]/50 resize-none rounded-2xl mb-4"
                disabled={isLoading}
              />

              <button
                onClick={startAnalysis}
                disabled={isLoading || !note.trim()}
                className="w-full neu-button bg-[#ff756b] text-[#fcf1ef] py-3 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? "Tahlil qilinmoqda..." : "Tahlilni Boshlash"}
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
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
                        ? "bg-[#ff756b] text-white shadow-md rounded-br-sm"
                        : "neu-card border border-white/40 text-[#2d2d2d] rounded-bl-sm prose prose-sm prose-p:text-[#2d2d2d]"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl p-4 text-sm neu-card border border-white/40 text-[#8a7b78] rounded-bl-sm">
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
                className="flex-1 h-12 neu-input rounded-full px-4 text-[#2d2d2d] text-sm placeholder:text-[#8a7b78]/50"
                disabled={isLoading}
              />
              <button
                disabled={isLoading || !chatInput.trim()}
                onClick={sendMsg}
                className="h-12 w-12 flex items-center justify-center neu-button text-[#ff756b] rounded-full disabled:opacity-50"
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
