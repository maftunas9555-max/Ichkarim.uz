"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const emotions = [
  { icon: "😊", label: "Quvonch", color: "border-green-500/30 hover:border-green-500/60" },
  { icon: "🙏", label: "Minnatdor", color: "border-teal-500/30 hover:border-teal-500/60" },
  { icon: "😌", label: "Sokin", color: "border-blue-400/30 hover:border-blue-400/60" },
  { icon: "🤩", label: "G'ayratli", color: "border-yellow-500/30 hover:border-yellow-500/60" },
  { icon: "🤔", label: "Ikkilanish", color: "border-indigo-400/30 hover:border-indigo-400/60" },
  { icon: "🥺", label: "Yolg'izlik", color: "border-purple-400/30 hover:border-purple-400/60" },
  { icon: "😰", label: "Xavotir", color: "border-orange-500/30 hover:border-orange-500/60" },
  { icon: "😴", label: "Charchoq", color: "border-gray-500/30 hover:border-gray-500/60" },
  { icon: "😤", label: "G'azab", color: "border-red-500/30 hover:border-red-500/60" },
  { icon: "😔", label: "Tushkunlik", color: "border-blue-600/30 hover:border-blue-600/60" },
  { icon: "🌀", label: "Adashish", color: "border-indigo-600/30 hover:border-indigo-600/60" },
  { icon: "💔", label: "Umidsizlik", color: "border-rose-600/30 hover:border-rose-600/60" },
];

export default function Diagnostika() {
  const [step, setStep] = useState(1);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [messages, setMessages] = useState<{role: "user"|"model", content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col h-full px-5 pt-6 pb-24">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center">
              <h2 className="text-xl font-bold text-white mb-2">Qanday hissasiz?</h2>
              <p className="text-sm text-gray-400">
                Hozir eng ko'p his qilayotgan tuyg'ungizni tanlang
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {emotions.map((em) => (
                <button
                  key={em.label}
                  onClick={() => {
                    setSelectedEmotion(em.label);
                    setStep(2);
                  }}
                  className={`glass bg-[#11131a]/60 flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all hover:scale-105 active:scale-95 ${em.color}`}
                >
                  <span className="text-3xl mb-1">{em.icon}</span>
                  <span className="text-[10px] font-medium text-white/90">{em.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center">
              <button 
                onClick={() => setStep(1)} 
                className="text-gray-500 text-sm mb-4 hover:text-white transition-colors"
                disabled={isLoading}
              >
                ← Orqaga
              </button>
              <h2 className="text-xl font-bold text-white mb-2">Biroz gaplashamizmi?</h2>
              <p className="text-sm text-gray-400">
                Ushbu tuyg'u ({selectedEmotion}) haqida bir-ikki gap aytib bering.
              </p>
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nima bo'layotganini yozing..."
              className="w-full h-40 glass bg-[#11131a]/60 rounded-2xl p-4 text-white text-sm outline-none resize-none placeholder-gray-500 focus:border-neon-teal/50 transition-colors"
              disabled={isLoading}
            />

            <button
              onClick={async () => {
                if (!note.trim()) return;
                try {
                  setIsLoading(true);
                  const initialUserMsg = `Men o'zimni "${selectedEmotion}" his qilyapman. Vaziyatim: ${note}`;
                  const newMsgs = [{ role: "user" as const, content: initialUserMsg }];
                  setMessages(newMsgs);

                  const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: newMsgs }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setMessages([...newMsgs, { role: "model", content: data.message }]);
                    setStep(3);
                  } else {
                    alert("Xatolik: " + data.error);
                  }
                } catch (err) {
                  alert("Ulanishda xatolik yuz berdi.");
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading || !note.trim()}
              className={`w-full py-4 rounded-full font-bold transition-all ${
                isLoading 
                  ? "bg-gray-600 text-gray-300" 
                  : "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              }`}
            >
              {isLoading ? "Tahlil qilinmoqda..." : "Davom etish >"}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex flex-col h-full gap-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-neon-teal">
                <span className="text-xl">✨</span>
                <span className="font-medium text-sm">Chuqur Tahlil (Carl Jung)</span>
              </div>
              <button
                onClick={() => {
                  setStep(1);
                  setNote("");
                  setMessages([]);
                  setSelectedEmotion(null);
                }}
                className="text-xs text-gray-500 hover:text-white"
              >
                Tugatish
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-2 scrollbar-hide">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                      msg.role === "user"
                        ? "bg-white/10 text-white rounded-br-sm"
                        : "glass bg-[#11131a]/80 border-white/10 text-gray-200 rounded-bl-sm relative overflow-hidden"
                    }`}
                  >
                    {msg.role === "model" && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-teal"></div>
                    )}
                    {msg.role === "model" ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-neon-teal">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl p-4 text-sm glass bg-[#11131a]/80 border-white/10 text-gray-400 rounded-bl-sm">
                    Psixolog o'ylamoqda...
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading && chatInput.trim()) {
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
                          body: JSON.stringify({ messages: newMsgs }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setMessages([...newMsgs, { role: "model", content: data.message }]);
                        }
                      } catch (e) {} finally {
                        setIsLoading(false);
                      }
                    };
                    sendMsg();
                  }
                }}
                placeholder="Javob yozing..."
                className="flex-1 h-12 glass bg-[#11131a]/60 rounded-full px-4 text-white text-sm outline-none placeholder-gray-500 focus:border-neon-teal/50 transition-colors"
                disabled={isLoading}
              />
              <button
                disabled={isLoading || !chatInput.trim()}
                onClick={async () => {
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
                      body: JSON.stringify({ messages: newMsgs }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setMessages([...newMsgs, { role: "model", content: data.message }]);
                    }
                  } catch (e) {} finally {
                    setIsLoading(false);
                  }
                }}
                className="h-12 w-12 flex items-center justify-center bg-white text-black rounded-full disabled:opacity-50"
              >
                ➔
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
