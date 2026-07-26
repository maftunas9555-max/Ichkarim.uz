"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Viktor Frankl's "Man's Search for Meaning" & Ken Robinson's "The Element" asosida 10 ta savol
const questions = [
  {
    id: 1,
    category: "🌟 Oqim holati (Flow)",
    question: "Qaysi ishni qilayotganda vaqt qanday o'tganini sezmay qolasiz?",
    options: [
      { text: "Muammolarni yechish, analiz qilish (Dasturlash, matematika)", score: "analytical" },
      { text: "Odamlarga yordam berish, tushuntirish, tinglash", score: "social" },
      { text: "Nimanidir yaratish, chizish, yozish, dizayn", score: "creative" },
      { text: "Tashkil qilish, boshqarish, yo'l ko'rsatish", score: "leadership" },
    ],
  },
  {
    id: 2,
    category: "🧗 Qiyinchilikka munosabat",
    question: "Frankl bo'yicha: Qiyinchilik va azobga qanday munosabatdasiz?",
    options: [
      { text: "Bu meni kuchliroq qiladi, saboq olaman", score: "resilient" },
      { text: "Undan qochishga yoki chalg'ishga harakat qilaman", score: "avoidant" },
      { text: "Azob orqali boshqalarga qanday yordam berishni o'ylayman", score: "altruistic" },
      { text: "Qiyinchilikda ijodiy ilhom topaman", score: "artistic" },
    ],
  },
  {
    id: 3,
    category: "🎯 Element (Robinson)",
    question: "Agar pul umuman muammo bo'lmaganda, har kuni nima bilan shug'ullanardingiz?",
    options: [
      { text: "Kitob o'qirdim, ilmiy izlanishlar qilardim", score: "analytical" },
      { text: "Odamlar bilan suhbatlashib, ularni davolardim/o'qitardim", score: "social" },
      { text: "San'at, musiqa, yozuvchilik bilan shug'ullanardim", score: "creative" },
      { text: "Yangi bizneslar yoki loyihalar boshlardim", score: "leadership" },
    ],
  },
  {
    id: 4,
    category: "🕊️ Hayot mazmuni",
    question: "Frankl bo'yicha hayotingizning eng katta mazmuni nimada?",
    options: [
      { text: "Biror muhim ishni yakunlash (ijod/ixtiro)", score: "creative" },
      { text: "Boshqalarni sevish va g'amxo'rlik qilish", score: "social" },
      { text: "O'z yo'limni qiyinchiliklarga qaramay mardona bosib o'tish", score: "resilient" },
      { text: "Katta tizimlarni tushunish va tartibga solish", score: "analytical" },
    ],
  },
  {
    id: 5,
    category: "💡 Tabi'iy qobiliyat",
    question: "Atrofingizdagilar sizni qaysi xususiyatingiz uchun ko'proq maqtaydi?",
    options: [
      { text: "Mantiqiy fikrlashim va aqliy tezligim uchun", score: "analytical" },
      { text: "Odamlarni yaxshi tushunishim va eshita olishim uchun", score: "social" },
      { text: "Kreativ g'oyalarim va o'zgacha didim uchun", score: "creative" },
      { text: "Liderligim va qat'iyatim uchun", score: "leadership" },
    ],
  },
  {
    id: 6,
    category: "🔥 Ehtiros",
    question: "Qaysi mavzuda soatlab zerikmasdan gaplashishingiz mumkin?",
    options: [
      { text: "Texnologiya, ilm-fan, koinot", score: "analytical" },
      { text: "Psixologiya, munosabatlar, inson tabiati", score: "social" },
      { text: "Kino, adabiyot, san'at, dizayn", score: "creative" },
      { text: "Biznes, siyosat, iqtisodiyot", score: "leadership" },
    ],
  },
  {
    id: 7,
    category: "🧩 Bolalik",
    question: "Bolaligingizda asosan nima qilishni yaxshi ko'rardingiz?",
    options: [
      { text: "Narsalarni buzib, ichini o'rganishni (Lego, boshqotirma)", score: "analytical" },
      { text: "Do'stlar bilan do'xtir-do'xtir yoki ustoz-shogird o'ynashni", score: "social" },
      { text: "Rasm chizish, ertak to'qish, hayol surishni", score: "creative" },
      { text: "Boshqalarni boshqarib, sardor bo'lishni", score: "leadership" },
    ],
  },
  {
    id: 8,
    category: "⏳ Pushaymonlik",
    question: "Agar umringiz oxirida bo'lsangiz, nima qilmaganingizdan eng ko'p afsuslanardingiz?",
    options: [
      { text: "O'z salohiyatimni to'liq ishga solmaganimdan", score: "analytical" },
      { text: "Yaqinlarimga yetarlicha mehr bermaganimdan", score: "social" },
      { text: "Ichimdagi asarni/g'oyani yuzaga chiqarmaganimdan", score: "creative" },
      { text: "Katta o'zgarishlar qila olmaganimdan", score: "leadership" },
    ],
  },
  {
    id: 9,
    category: "🔋 Energiya",
    question: "Siz qachon o'zingizni eng energiyaga to'la his qilasiz?",
    options: [
      { text: "Tinchgina yolg'iz ishlaganimda", score: "analytical" },
      { text: "Jamoada, odamlar bilan birga ishlaganimda", score: "social" },
      { text: "Erkinlikda, hech qanday qoidalarsiz ishlaganimda", score: "creative" },
      { text: "Mas'uliyatni o'z zimmamga olganimda", score: "leadership" },
    ],
  },
  {
    id: 10,
    category: "🌍 Dunyoga hissa",
    question: "Frankl so'raydi: Hayot sizdan nima kutyapti?",
    options: [
      { text: "Yangi bilim va texnologiyalarni kashf qilishni", score: "analytical" },
      { text: "Singan qalblarni davolash va yordam berishni", score: "social" },
      { text: "Dunyoni go'zallashtirish va ilhomlantirishni", score: "creative" },
      { text: "Adolat o'rnatish va jamiyatni boshqarishni", score: "leadership" },
    ],
  },
];

export default function OzYoliniTopish() {
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

  const systemPrompt = `Siz Viktor Frankl (Logoterapiya) va Ken Robinson ("Element") yondashuvlari asosida ishlaydigan kasb va hayot mazmuni psixolog-maslahatchisisiz.

FRANKL YONDASHUVI:
- Insonning asosiy maqsadi — rohatlanish emas, balki MA'NO topishdir.
- Ma'no 3 xil yo'l bilan topiladi: 1) Yaratish/mehnat, 2) Boshqalarni sevish, 3) Qochib qutulib bo'lmaydigan azobga mardona munosabat.
- "Hayotdan nima kutyapsan emas, hayot sendan nima kutyapti?" degan savolni berasiz.

ROBINSON YONDASHUVI:
- "Element" — bu tabiiy qobiliyat va kuchli ehtiros (haves) uchrashadigan nuqta.
- Elementni topsagina inson baxtli bo'ladi va vaqt qanday o'tganini sezmaydi (oqim holati).
- Ta'lim tizimi ko'pincha kreativitini o'ldiradi, lekin inson uni qayta topishi mumkin.

QOIDALAR:
1. Foydalanuvchi test natijalarini (aysi tip ustunligini) tashlaydi.
2. Natijalarni tahlil qiling va qaysi sohalar (kasblar) uning "Element"i bo'lishi mumkinligini TAXMIN qiling.
3. Frankl yondashuvi bilan uning ichki bo'shlig'ini va maqsadini qidiring.
4. Foydalanuvchiga amaliy yechim va yo'nalish bering. Uning kuchini (salohiyatini) o'ziga ko'rsating.
5. Har doim o'zbek tilida, empatiya bilan, lekin juda chuqur va aniq gapiring.
6. Hech qachon shunchaki "yaxshi bo'ladi" demang. Haqiqiy psixologik qazish ishini olib boring. Savol orqali uning ehtirosini toping.`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Hisoblash
  const scores = { analytical: 0, social: 0, creative: 0, leadership: 0, resilient: 0, avoidant: 0, altruistic: 0, artistic: 0 };
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

    const msg = `Men \"O'z Yo'lini Topish\" testini topshirdim.

NATIJALARIM (Mening moyilliklarim):
Analitik/Mantiqiy: ${scores.analytical} ball
Ijtimoiy/Yordam: ${scores.social} ball
Kreativ/Ijodiy: ${scores.creative} ball
Liderlik/Boshqaruv: ${scores.leadership} ball

QO'SHIMCHA IZOHIM:
${writtenAnswer || "Qo'shimcha izoh yozilmadi."}

Iltimos, mening natijalarimni Viktor Frankl va Ken Robinson yondashuvi asosida chuqur tahlil qiling. Mening haqiqiy "Element"im nima bo'lishi mumkin va men qanday kasb/mashg'ulot orqali hayot mazmunini topishim mumkin? Menga aniq yo'nalish va og'riqlarimni yechuvchi savollar bering.`;

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
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(45,212,191,0.3)]">
              🧭
            </div>
            <h1 className="text-2xl font-bold text-white">O'z Yo'lini Topish</h1>
            <p className="text-sm text-gray-400 max-w-[300px]">
              V. Frankl va K. Robinson metodikasi yordamida hayot mazmuni va kuchli tomonlaringizni aniqlang. 
            </p>
            <div className="flex gap-3 mt-2">
              <span className="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">10 savol</span>
              <span className="text-xs px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">~7 daqiqa</span>
            </div>
            <button onClick={() => setStep("test")} className="mt-4 px-8 py-4 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold hover:shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all active:scale-95">
              Boshlash →
            </button>
            <button onClick={() => router.back()} className="text-xs text-gray-500 hover:text-white transition-colors mt-1">← Orqaga</button>
          </motion.div>
        )}

        {/* TEST */}
        {step === "test" && (
          <motion.div key="test" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="flex flex-col gap-5">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" animate={{width: `${((currentQ + 1) / questions.length) * 100}%`}} transition={{duration: 0.3}} />
              </div>
              <span className="text-xs text-gray-400 font-medium">{currentQ + 1}/{questions.length}</span>
            </div>

            {/* Category Badge */}
            <div className="text-center">
              <span className="text-sm text-teal-400">{questions[currentQ].category}</span>
            </div>

            {/* Question Card */}
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
                            ? "bg-teal-500/20 border-teal-500/60 text-teal-200"
                            : "bg-white/5 border-white/10 text-gray-300 hover:border-teal-500/40 hover:bg-teal-500/10"
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
              <span className="text-4xl mb-3 block">📝</span>
              <h2 className="text-xl font-bold text-white mb-2">Test yakunlandi!</h2>
              <p className="text-sm text-gray-400">
                Endi hozirgi ishingiz yoki o'qishingiz haqida yozing. Sizni nima ko'proq charchatyapti yoki ilhomlantiryapti?
              </p>
            </div>

            <textarea
              value={writtenAnswer}
              onChange={(e) => setWrittenAnswer(e.target.value)}
              placeholder="Masalan: Men hozir bankda ishlayman, lekin har kuni bir xil ishdan zerikdim. Ko'proq erkinlik va ijod xohlayman..."
              className="w-full h-36 glass bg-[#11131a]/60 rounded-2xl p-4 text-white text-sm outline-none resize-none placeholder-gray-500 focus:border-teal-500/50 transition-colors"
            />

            <button onClick={handleSubmitAll} className="w-full py-4 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold hover:shadow-[0_0_25px_rgba(45,212,191,0.3)] transition-all active:scale-95">
              Tahlilni boshlash 🔍
            </button>
          </motion.div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center animate-pulse">
              <span className="text-3xl">🧭</span>
            </div>
            <p className="text-sm text-gray-400">Frankl va Robinson tahlili tayyorlanmoqda...</p>
          </motion.div>
        )}

        {/* CHAT */}
        {step === "chat" && (
          <motion.div key="chat" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧭</span>
                <span className="font-medium text-sm text-teal-400">O'z Yo'lini Topish</span>
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
                    {msg.role === "model" && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600"></div>}
                    {msg.role === "model" ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-a:text-teal-400">
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
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} placeholder="Javob yozing..." className="flex-1 h-12 glass bg-[#11131a]/60 rounded-full px-4 text-white text-sm outline-none placeholder-gray-500 focus:border-teal-500/50" disabled={isLoading} />
              <button disabled={isLoading || !chatInput.trim()} onClick={handleSend} className="h-12 w-12 flex items-center justify-center rounded-full disabled:opacity-50 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold">➤</button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
