"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Carl Jung's "Shadow" (Soya) yondashuvi asosida 5 ta juda chuqur savol (1-kunlik qism)
const questions = [
  {
    id: 1,
    category: "😠 G'azab (Proyeksiya)",
    question: "Boshqalarda qaysi xususiyat sizni hammadan ham ko'proq asabiylashtiradi?",
    options: [
      { text: "Maqtanchoqlik va diqqat markazida bo'lish", score: "repressed_attention" },
      { text: "Zaiflik, o'zini himoya qila olmaslik", score: "repressed_vulnerability" },
      { text: "Qoidalarga bo'ysunmaslik va erkinlik", score: "repressed_rebellion" },
      { text: "Haddan tashqari xudbinlik (faqat o'zini o'ylash)", score: "repressed_needs" },
    ],
  },
  {
    id: 2,
    category: "🤐 Yashirilgan istaklar",
    question: "Agar hech kim bilmasligiga 100% kafolat bo'lsa, nimani qilishni xohlardingiz?",
    options: [
      { text: "Barcha mas'uliyatlarni tashlab, qochib ketish", score: "repressed_rebellion" },
      { text: "Meni xafa qilganlardan qasos olish", score: "repressed_anger" },
      { text: "Hech narsa qilmasdan, yordam kutish (zaif bo'lish)", score: "repressed_vulnerability" },
      { text: "O'z yutuqlarimni hammaga ko'z-ko'z qilish", score: "repressed_attention" },
    ],
  },
  {
    id: 3,
    category: "🎭 Niqob (Persona)",
    question: "Jamiyatda o'zingizni qanday qilib ko'rsatishga eng ko'p energiya sarflaysiz?",
    options: [
      { text: "\"Men juda mehribon va yordamga tayyorman\"", score: "repressed_needs" },
      { text: "\"Men kuchliman, hammasi nazoratim ostida\"", score: "repressed_vulnerability" },
      { text: "\"Men aqlli, mukammal va to'g'riman\"", score: "repressed_rebellion" },
      { text: "\"Men ochiqko'ngilman, hech narsaga siqilmayman\"", score: "repressed_anger" },
    ],
  },
  {
    id: 4,
    category: "🥺 Bolalik yarasi",
    question: "Bolaligingizda eng ko'p qanday so'zlarni eshitishni xohlagansiz?",
    options: [
      { text: "\"Sen men uchun eng muhimsan\"", score: "repressed_attention" },
      { text: "\"Sen yig'lashing mumkin, men yoningdaman\"", score: "repressed_vulnerability" },
      { text: "\"Men seni doim himoya qilaman\"", score: "repressed_anger" },
      { text: "\"Seni shundayligingcha qabul qilaman (xatolaring bilan)\"", score: "repressed_rebellion" },
    ],
  },
  {
    id: 5,
    category: "🌑 Soyani tan olish",
    question: "O'zingizdagi eng yomon ko'rgan odatingiz nima?",
    options: [
      { text: "Odamlarga yo'q deya olmasligim (o'zimni qurbon qilish)", score: "repressed_needs" },
      { text: "Hammani va hamma narsani nazorat qilishni xohlashim", score: "repressed_vulnerability" },
      { text: "Ichimdagi yig'ilib qolgan sababsiz g'azab", score: "repressed_anger" },
      { text: "Atrofimdagilarga (ichki) hasad qilishim", score: "repressed_attention" },
    ],
  },
];

export default function SoyaBilanYuzlashish() {
  const router = useRouter();
  const [step, setStep] = useState<"intro"|"test"|"write"|"loading"|"chat">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [messages, setMessages] = useState<{role:"user"|"model", content:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemPrompt = `Siz psixoanaliz asoschisi Karl Yung (Carl Jung) bilimlari asosida ishlaydigan chuqur psixolog-maslahatchisiz. Foydalanuvchi hozir o'zining "Soyasi" (Shadow) bilan yuzlashmoqda.

JUNG YONDASHUVI:
- "Soya" (Shadow) bu ongostimizdagi yashirilgan, qabul qilinmagan qorong'u, xudbin, g'azabnok yoki zaif tomonlarimiz.
- Biz boshqalarda aynan o'zimizning ichimizdagi soyani yomon ko'ramiz (Proyeksiya mexanizmi).
- "Persona" (Niqob) bu jamiyatga kiyadigan yuzimiz. Soya qanchalik bosilsa, inson shuncha baxtsiz bo'ladi.
- Yechim — soyani rad etish emas, uni TANI OLISH, quchoqlash va integratsiya qilishdir (Individuation).

QOIDALAR:
1. Foydalanuvchi "Soya" testini topshirdi. Uning ongostida bosib qo'yilgan qaysi xislatlari borligini tahlil qiling.
2. Unga o'zining niqobi (Persona) va asl qiyofasi (Soya) qanday ziddiyatda ekanini ko'rsating.
3. Juda chuqur, hatto biroz og'riqli (lekin empatiya bilan!) savollar bering. Uni o'zining "qorong'u xonasi"ga olib kiring.
4. Foydalanuvchiga hech qachon yuzaki tasalli bermang. Uning ichidagi g'azabni, zaiflikni yoki xudbinlikni OQLANG va bular tabiiy ekanini tushuntiring.
5. Har doim o'zbek tilida yozing. O'ylantiruvchi qisqa jumlalardan foydalaning.`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const scores = { repressed_attention: 0, repressed_vulnerability: 0, repressed_rebellion: 0, repressed_needs: 0, repressed_anger: 0 };
  answers.forEach((ans) => {
    if (scores[ans as keyof typeof scores] !== undefined) {
      scores[ans as keyof typeof scores]++;
    }
  });

  const sendToAPI = async (msgs: {role:"user"|"model", content:string}[]) => {
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

  const handleAnswer = (score: string) => {
    setSelectedOption(score);
    setTimeout(() => {
      const newAnswers = [...answers, score];
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setStep("write");
      }
    }, 400);
  };

  const handleSubmitAll = async () => {
    setStep("loading");

    const msg = `Men Karl Yungning "Soya bilan Yuzlashish" testini topshirdim.

NATIJALARIM (Bosilgan tuyg'ular):
Diqqat va e'tirofga yashirin chanqoqlik: ${scores.repressed_attention}
Zaiflikni ko'rsatishdan qochish: ${scores.repressed_vulnerability}
Isyon va erkinlikni bo'g'ish: ${scores.repressed_rebellion}
O'z ehtiyojlarini qurbon qilish: ${scores.repressed_needs}
Ichki yashirin g'azab/qasos: ${scores.repressed_anger}

QO'SHIMCHA IZOHIM:
${writtenAnswer || "Men bu haqida aniq nima deyishni bilmayman..."}

Karl Yung, mening "Soya"m (Shadow) nima o'zi? Men jamiyat uchun qanday niqob kiyganman va aslida ichimda kim yashiringan? Menga shu og'riqlarni ochib tashlaydigan chuqur savollar berib, o'z qorong'u taraflarim bilan do'stlashishimga (integratsiya qilishimga) yordam bering.`;

    const firstMsg = [{ role: "user" as const, content: msg }];
    setMessages(firstMsg);
    await sendToAPI(firstMsg);
    setStep("chat");
  };

  const handleSend = async () => {
    const input = chatInput.trim();
    if (!input || isLoading) return;
    const newMsgs = [...messages, { role: "user" as const, content: input }];
    setMessages(newMsgs);
    setChatInput("");
    await sendToAPI(newMsgs);
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-24">
      <AnimatePresence mode="wait">

        {/* INTRO */}
        {step === "intro" && (
          <motion.div key="intro" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex flex-col items-center justify-center h-full gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(71,85,105,0.4)] border border-slate-500">
              🌑
            </div>
            <h1 className="text-2xl font-bold text-white">Soya bilan Yuzlashish</h1>
            <p className="text-sm text-gray-400 max-w-[300px]">
              Karl Yung metodikasi. Ichingizdagi yashiringan, rad etilgan "Qorong'u qismlar"ingiz bilan yuzlashish va ularni qabul qilish sari 1-qadam.
            </p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">5 savol</span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">Chuqur AI psixoanaliz</span>
            </div>
            <button onClick={() => setStep("test")} className="mt-4 px-8 py-4 rounded-full bg-gradient-to-r from-slate-600 to-slate-800 text-white font-bold hover:shadow-[0_0_25px_rgba(71,85,105,0.5)] transition-all border border-slate-500 active:scale-95">
              Ichkariga kirish 🚪
            </button>
            <button onClick={() => router.back()} className="text-xs text-gray-500 hover:text-white transition-colors mt-1">← Orqaga</button>
          </motion.div>
        )}

        {/* TEST */}
        {step === "test" && (
          <motion.div key="test" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-slate-500 to-slate-700 rounded-full" animate={{width: `${((currentQ + 1) / questions.length) * 100}%`}} transition={{duration: 0.3}} />
              </div>
              <span className="text-xs text-gray-400 font-medium">{currentQ + 1}/{questions.length}</span>
            </div>

            <div className="text-center">
              <span className="text-sm text-slate-400">{questions[currentQ].category}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={{duration:0.25}}>
                <div className="glass bg-[#11131a]/80 rounded-3xl p-6 border-white/10">
                  <p className="text-white font-medium text-base leading-relaxed mb-6">{questions[currentQ].question}</p>
                  <div className="flex flex-col gap-3">
                    {questions[currentQ].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(opt.score)}
                        className={`text-left p-4 rounded-2xl border text-sm transition-all active:scale-[0.98] ${
                          selectedOption === opt.score
                            ? "bg-slate-500/20 border-slate-400/60 text-slate-200"
                            : "bg-white/5 border-white/10 text-gray-300 hover:border-slate-500/40 hover:bg-slate-500/10"
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* WRITE */}
        {step === "write" && (
          <motion.div key="write" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-4xl mb-3 block">🗝️</span>
              <h2 className="text-xl font-bold text-white mb-2">Qulf ochildi</h2>
              <p className="text-sm text-gray-400">
                Endi o'zingizda eng ko'p yashiradigan, hech kimga aytmaydigan o'y yoki hissingizni (qo'rquv, g'azab) yozib qoldiring.
              </p>
            </div>

            <textarea
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              placeholder="Masalan: Ba'zan o'z ota-onamdan ham charchab ketaman va ulardan uzoqqa qochib ketgim keladi. Bu o'yim uchun o'zimni yomon ko'raman..."
              className="w-full h-36 glass bg-[#11131a]/60 rounded-2xl p-4 text-white text-sm outline-none resize-none placeholder-gray-500 focus:border-slate-500/50 transition-colors"
            />

            <button onClick={handleSubmitAll} className="w-full py-4 rounded-full bg-gradient-to-r from-slate-600 to-slate-800 text-white font-bold hover:shadow-[0_0_25px_rgba(71,85,105,0.5)] transition-all border border-slate-500 active:scale-95">
              Soyaga yuzlashish 🌑
            </button>
          </motion.div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center animate-pulse border border-slate-500">
              <span className="text-3xl">🌑</span>
            </div>
            <p className="text-sm text-gray-400">Jung sizning soyangizni o'qimoqda...</p>
          </motion.div>
        )}

        {/* CHAT */}
        {step === "chat" && (
          <motion.div key="chat" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌑</span>
                <span className="font-medium text-sm text-slate-400">Soya bilan Yuzlashish</span>
              </div>
              <button onClick={() => router.back()} className="text-xs text-gray-500 hover:text-white">Tugatish</button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 scrollbar-hide">
              {messages.filter((m, i) => i > 0 || m.role === "model").map((msg, idx) => (
                <motion.div key={idx} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                    msg.role === "user"
                      ? "bg-white/10 text-white rounded-br-sm"
                      : "glass bg-[#11131a]/80 border-white/10 text-gray-200 rounded-bl-sm relative overflow-hidden"
                  }`}>
                    {msg.role === "model" && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-500 to-slate-700"></div>}
                    {msg.role === "model" ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-slate-400">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl p-4 text-sm glass bg-[#11131a]/80 border-white/10 text-gray-400 rounded-bl-sm flex gap-1">
                    <span className="animate-pulse">●</span><span className="animate-pulse" style={{animationDelay:"0.2s"}}>●</span><span className="animate-pulse" style={{animationDelay:"0.4s"}}>●</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} placeholder="Javob yozing..." className="flex-1 h-12 glass bg-[#11131a]/60 rounded-full px-4 text-white text-sm outline-none placeholder-gray-500 focus:border-slate-500/50" disabled={isLoading} />
              <button disabled={isLoading || !chatInput.trim()} onClick={handleSend} className="h-12 w-12 flex items-center justify-center rounded-full disabled:opacity-50 bg-gradient-to-r from-slate-600 to-slate-800 border border-slate-500 text-white font-bold">➤</button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
