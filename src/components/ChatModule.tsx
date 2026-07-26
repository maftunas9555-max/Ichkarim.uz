"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ChatModuleProps {
  title: string;
  subtitle: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  systemPrompt: string;
  initialQuestion: string;
}

export default function ChatModule({
  title,
  subtitle,
  emoji,
  gradientFrom,
  gradientTo,
  systemPrompt,
  initialQuestion,
}: ChatModuleProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<{role: "user"|"model", content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendToAPI = async (msgs: {role: "user"|"model", content: string}[]) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, systemPrompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...msgs, { role: "model", content: data.message }]);
      }
    } catch (e) {} finally {
      setIsLoading(false);
    }
  };

  const handleStart = async () => {
    setStarted(true);
    const firstMsg = [{ role: "user" as const, content: initialQuestion }];
    setMessages(firstMsg);
    await sendToAPI(firstMsg);
  };

  const handleSend = async () => {
    const input = chatInput.trim();
    if (!input || isLoading) return;
    const newMsgs = [...messages, { role: "user" as const, content: input }];
    setMessages(newMsgs);
    setChatInput("");
    await sendToAPI(newMsgs);
  };

  if (!started) {
    return (
      <div className="flex flex-col h-full px-5 pt-6 pb-24 items-center justify-center gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-4xl shadow-lg`}>
            {emoji}
          </div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-gray-400 max-w-[280px]">{subtitle}</p>

          <button
            onClick={handleStart}
            className={`mt-6 px-8 py-4 rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all active:scale-95`}
          >
            Boshlash →
          </button>

          <button
            onClick={() => router.back()}
            className="text-xs text-gray-500 hover:text-white transition-colors mt-2"
          >
            ← Orqaga
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full gap-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg">{emoji}</span>
            <span className="font-medium text-sm text-white">{title}</span>
          </div>
          <button
            onClick={() => router.back()}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Tugatish
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 scrollbar-hide">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx === messages.length - 1 ? 0.1 : 0 }}
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
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientFrom} ${gradientTo}`}></div>
                )}
                {msg.role === "model" && idx === 0 ? null : null}
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl p-4 text-sm glass bg-[#11131a]/80 border-white/10 text-gray-400 rounded-bl-sm flex items-center gap-2">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse" style={{animationDelay: "0.2s"}}>●</span>
                <span className="animate-pulse" style={{animationDelay: "0.4s"}}>●</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="pt-2 flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Javob yozing..."
            className="flex-1 h-12 glass bg-[#11131a]/60 rounded-full px-4 text-white text-sm outline-none placeholder-gray-500 focus:border-neon-teal/50 transition-colors"
            disabled={isLoading}
          />
          <button
            disabled={isLoading || !chatInput.trim()}
            onClick={handleSend}
            className={`h-12 w-12 flex items-center justify-center rounded-full disabled:opacity-50 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-bold`}
          >
            ➤
          </button>
        </div>
      </motion.div>
    </div>
  );
}
