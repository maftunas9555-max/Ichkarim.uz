"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Heart, Send } from "lucide-react";
import Link from "next/link";

// Gottman's 4 Horsemen + Perel's Erotic Intelligence asosida 15 ta savol
const questions = [
  {
    id: 1,
    category: "🛡️ Himoya Mexanizmi",
    question: "Sherigingiz sizni tanqid qilganda, odatda nima qilasiz?",
    options: [
      { text: "O'zimni himoya qilaman va aybni unga qaytaraman", score: 1 },
      { text: "Jim bo'lib ketaman va ichimda g'azablanaman", score: 2 },
      { text: "Tinglashga harakat qilaman, lekin qiyin", score: 3 },
      { text: "Ochiq gaplashib, tushunishga harakat qilaman", score: 4 },
    ],
  },
  {
    id: 2,
    category: "🧱 Devor Qurish",
    question: "Janjal vaqtida siz tez-tez suhbatdan \"chiqib ketasizmi\"?",
    options: [
      { text: "Ha, men doim jim qolaman (stonewalling)", score: 1 },
      { text: "Ba'zan o'zimni yopib olaman", score: 2 },
      { text: "Kamdan-kam, faqat juda og'ir bo'lganda", score: 3 },
      { text: "Yo'q, men doim muloqotda qolaman", score: 4 },
    ],
  },
  {
    id: 3,
    category: "💔 Nafrat Alomatlari",
    question: "Sherigingiz haqida ichingizda mensimaslik yoki nafrat his qilasizmi?",
    options: [
      { text: "Ha, tez-tez u meni bezdirib yuboradi", score: 1 },
      { text: "Ba'zan \"nega men uni tanladim\" deb o'ylayman", score: 2 },
      { text: "Kamdan-kam, faqat janjal paytida", score: 3 },
      { text: "Yo'q, men uni hurmat qilaman", score: 4 },
    ],
  },
  {
    id: 4,
    category: "⚔️ Tanqid Uslubi",
    question: "Siz sherigingizni tanqid qilganda, qanday so'zlar ishlatasiz?",
    options: [
      { text: "\"Sen DOIM shunday qilasan!\" deb aytaman", score: 1 },
      { text: "\"Sen HECH QACHON...\" degan gaplarni ishlataman", score: 2 },
      { text: "Muammoni aytaman, lekin ba'zan keskin bo'laman", score: 3 },
      { text: "\"Men shunday his qilaman\" deb o'z hislarimdan gaplashaman", score: 4 },
    ],
  },
  {
    id: 5,
    category: "🤝 Emotsional Bank",
    question: "Gottman bo'yicha: Sherigingiz bilan \"emotsional hisob\"ingiz qanday?",
    options: [
      { text: "Doimiy salbiy — janjal ko'p, iliqlik kam", score: 1 },
      { text: "Nol atrofida — na yaxshi, na yomon", score: 2 },
      { text: "Ijobiy tomonga og'adi, lekin tebranishlar bor", score: 3 },
      { text: "Juda ijobiy — biz bir-birimizga investitsiya qilamiz", score: 4 },
    ],
  },
  {
    id: 6,
    category: "🔄 Qayta Tiklanish",
    question: "Janjal yoki xafa bo'lgandan keyin qanchalik tez yarashishingiz mumkin?",
    options: [
      { text: "Kunlab gaplashmaymiz", score: 1 },
      { text: "Soatlab sovuq munosabatda bo'lamiz", score: 2 },
      { text: "Biroz vaqtdan keyin birinchi qadam tashlayman", score: 3 },
      { text: "Tezda gaplashib, bir-birimizni tushunishga harakat qilamiz", score: 4 },
    ],
  },
  {
    id: 7,
    category: "👀 E'tibor",
    question: "Perel bo'yicha: Sherigingizga hali ham qiziqish bilan qaraysizmi?",
    options: [
      { text: "Yo'q, u meni zeriktirib qo'ygan", score: 1 },
      { text: "Ba'zan u menga begona tuyuladi", score: 2 },
      { text: "Qiziqish bor, lekin kamaygan", score: 3 },
      { text: "Ha, men undagi yangi tomonlarni kashf qilishni yaxshi ko'raman", score: 4 },
    ],
  },
  {
    id: 8,
    category: "🔥 Intim Yaqinlik",
    question: "Munosabatingizda ehtiros va yaqinlik darajasi qanday?",
    options: [
      { text: "Deyarli yo'q, biz faqat sherikchilik qilamiz", score: 1 },
      { text: "Kamaygan, lekin ba'zan bor", score: 2 },
      { text: "O'rtacha, ammo men ko'proq xohlayman", score: 3 },
      { text: "Bizda hali ham kuchli yaqinlik bor", score: 4 },
    ],
  },
  {
    id: 9,
    category: "🗺️ Xarita",
    question: "Gottman bo'yicha: Siz sherigingizning ichki dunyosi 'xaritasi'ni bilasizmi?",
    options: [
      { text: "Uning nima haqida o'ylashini bilmayman", score: 1 },
      { text: "Asosiy narsalarni bilaman, chuqurini emas", score: 2 },
      { text: "Ko'p narsani bilaman, lekin so'ramasam aytmaydi", score: 3 },
      { text: "Uning qo'rquvlari, orzulari, sevimli narsalarini yaxshi bilaman", score: 4 },
    ],
  },
  {
    id: 10,
    category: "🏠 Xavfsiz Makon",
    question: "Sherigingiz oldida o'zingizni zaif ko'rsata olasizmi?",
    options: [
      { text: "Yo'q, u buni ishlatadi", score: 1 },
      { text: "Qiyinchilik bilan, qo'rqaman", score: 2 },
      { text: "Ba'zan, ishonchim bor", score: 3 },
      { text: "Ha, u mening xavfsiz makonim", score: 4 },
    ],
  },
  {
    id: 11,
    category: "🌊 Mustaqillik",
    question: "Perel bo'yicha: Munosabatda o'z mustaqilligingizni saqlay olasizmi?",
    options: [
      { text: "Men o'zimni yo'qotib qo'yganman", score: 1 },
      { text: "Sherigim menga juda bog'liq yoki men unga", score: 2 },
      { text: "Balans izlamoqdaman", score: 3 },
      { text: "Ha, biz ikkalamiz ham mustaqilmiz va yaqinmiz", score: 4 },
    ],
  },
  {
    id: 12,
    category: "💬 Muloqot Sifati",
    question: "Bir hafta ichida sherigingiz bilan nechta chuqur suhbat bo'ladi?",
    options: [
      { text: "Hech qachon chuqur gaplashmaymiz", score: 1 },
      { text: "Oyda bir marta bo'lsa yaxshi", score: 2 },
      { text: "Haftada 1-2 marta", score: 3 },
      { text: "Deyarli har kuni mazmunli gaplashamiz", score: 4 },
    ],
  },
  {
    id: 13,
    category: "😊 Ijobiy Nisbat",
    question: "Gottman formula: Munosabatingizdagi ijobiy:salbiy lahzalar nisbati qanday?",
    options: [
      { text: "Salbiy ancha ko'p", score: 1 },
      { text: "Taxminan teng", score: 2 },
      { text: "Ijobiy biroz ko'proq", score: 3 },
      { text: "Ijobiy ancha ustun (5:1 ga yaqin)", score: 4 },
    ],
  },
  {
    id: 14,
    category: "🔮 Kelajak",
    question: "5 yildan keyin bu munosabatni qanday ko'rasiz?",
    options: [
      { text: "Ehtimol tugaydi", score: 1 },
      { text: "Bilmayman, noaniq", score: 2 },
      { text: "Davom etadi, lekin o'zgarishlar kerak", score: 3 },
      { text: "Yanada mustahkamroq va chuqurroq bo'lamiz", score: 4 },
    ],
  },
  {
    id: 15,
    category: "❤️ Sevgi Tili",
    question: "Siz sherigingizning sevgi tilini bilasizmi va uning tilida gaplashasizmi?",
    options: [
      { text: "Bilmayman, bu nima?", score: 1 },
      { text: "Bilaman, lekin qiynalib amalga oshiraman", score: 2 },
      { text: "Harakat qilaman, lekin unutib qo'yaman", score: 3 },
      { text: "Ha, biz bir-birimizning sevgi tilimizda gaplashamiz", score: 4 },
    ],
  },
];

export default function YurakQolipi() {
  const router = useRouter();
  const [step, setStep] = useState<"intro"|"test"|"write"|"loading"|"chat">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [messages, setMessages] = useState<{role:"user"|"model", content:string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const systemPrompt = `Siz John Gottman va Esther Perel metodologiyalari asosida ishlaydigan munosabatlar psixologisiz.

GOTTMAN YONDASHUVI:
- "To'rtta otliq" (Four Horsemen): tanqid, mensimaslik (contempt), himoyalanish (defensiveness), devor qurish (stonewalling) — bularni aniqlash va bartaraf etish.
- 5:1 nisbati: Sog'lom munosabatda har bir salbiy lahzaga 5 ta ijobiy lahza to'g'ri kelishi kerak.
- "Emotsional bank hisobi": Kichik e'tiborlar, hurmatli munosabat orqali "hisob"ni to'ldirish.
- "Sevgi xaritasi" (Love Map): Sherining ichki dunyosini chuqur bilish.

PEREL YONDASHUVI:
- Ehtiros va xavfsizlik o'rtasidagi ziddiyat.
- "Erotik intellekt" — bir vaqtning o'zida mustaqil va yaqin bo'lish san'ati.
- Munosabatda qiziquvchanlik va yangilanish ahamiyati.

QOIDALAR:
1. Foydalanuvchi test natijalarini yuboradi. Natijalarni chuqur tahlil qiling.
2. Zaif tomonlarni YUMSHOQ va EMPATIK tilda ko'rsating.
3. Har bir muammoga ANIQ va AMALIY maslahat bering (Gottman yoki Perel texnikasi).
4. Foydalanuvchi qo'shimcha savol yozsa, individual yondashing, og'riqni toping va yechim bering.
5. O'ZBEK tilida yozing. Qisqa, aniq va iliq bo'ling.
6. Agar og'riq topilsa — uni ochib berish uchun chuqur savol bering. Hech qachon yuzaki maslahat bermang.`;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = 60;
  const percentage = Math.round((totalScore / maxScore) * 100);

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

  const handleAnswer = (score: number) => {
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

    const scoreDetails = answers.map((a, i) => 
      `${questions[i].category}: ${a}/4`
    ).join("\n");

    const msg = `Men \"Yurak Qolipi\" testini topshirdim.

NATIJALARIM (${totalScore}/${maxScore}, ${percentage}%):
${scoreDetails}

QO'SHIMCHA IZOHIM:
${writtenAnswer || "Qo'shimcha izoh yozilmadi."}

Iltimos, mening natijalarimni Gottman va Perel yondashuvi asosida chuqur tahlil qiling. Zaif va kuchli tomonlarimni ko'rsating. Eng muhim — mening munosabatimdagi og'riqni aniqlang va yechim taklif qiling.`;

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
      <div className="flex items-center mb-6">
        <Link href="/" className="neu-button p-2 text-[#8a7b78] hover:text-[#2d2d2d]">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-[#2d2d2d] ml-4">Yurak Qolipi</h1>
      </div>
      <AnimatePresence mode="wait">

        {/* INTRO */}
        {step === "intro" && (
          <motion.div key="intro" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex flex-col gap-6">
            <div className="neu-card p-6 border border-white/40 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-[#fcf1ef] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]">
                  <Heart className="w-8 h-8 text-[#b5838d]" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-[#2d2d2d] mb-2">Munosabatlar Tahlili</h2>
              <p className="text-sm text-[#8a7b78] max-w-[300px] mx-auto font-medium mb-4">
                Munosabatingizni chuqur tahlil qiling. 15 ta savol + shaxsiy AI tahlil.
              </p>
              <div className="flex gap-3 justify-center mb-6">
                <span className="text-xs px-4 py-1.5 rounded-full neu-button text-[#8a7b78] font-bold">15 savol</span>
                <span className="text-xs px-4 py-1.5 rounded-full neu-button text-[#8a7b78] font-bold">~10 daqiqa</span>
              </div>
              <button onClick={() => setStep("test")} className="w-full bg-[#b5838d] text-white py-3 rounded-full font-bold shadow-[0_4px_15px_rgba(181,131,141,0.4)] active:scale-95 transition-all">
                Boshlash →
              </button>
            </div>
          </motion.div>
        )}

        {/* TEST */}
        {step === "test" && (
          <motion.div key="test" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#b5838d] uppercase tracking-wider">Savol {currentQ + 1}/{questions.length}</span>
            </div>
            <div className="h-2 bg-[#fcf1ef] rounded-full shadow-[inset_2px_2px_5px_rgba(220,195,185,0.6),inset_-2px_-2px_5px_rgba(255,255,255,0.9)]">
              <motion.div className="h-full bg-[#b5838d] rounded-full" animate={{width: `${((currentQ + 1) / questions.length) * 100}%`}} transition={{duration: 0.3}} />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold text-[#8a7b78]">{questions[currentQ].category}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}} transition={{duration:0.25}}>
                <div className="neu-card p-6 border border-white/40">
                  <p className="text-[#2d2d2d] font-bold text-base leading-relaxed mb-5">{questions[currentQ].question}</p>
                  <div className="flex flex-col gap-3">
                    {questions[currentQ].options.map((opt, i) => (
                      <button key={i} onClick={() => handleAnswer(opt.score)}
                        className={`text-left p-4 rounded-2xl text-sm font-medium transition-all active:scale-[0.98] ${
                          selectedOption === opt.score ? "bg-[#b5838d] text-white shadow-md" : "neu-button text-[#2d2d2d]"
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

        {/* WRITE */}
        {step === "write" && (
          <motion.div key="write" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex flex-col gap-5">
            <div className="neu-card p-6 border border-white/40 text-center">
              <div className="text-4xl mb-3">📝</div>
              <h2 className="text-lg font-bold text-[#2d2d2d] mb-2">Deyarli tayyor!</h2>
              <p className="text-sm text-[#8a7b78] mb-4">
                Natijangiz: <span className="text-[#b5838d] font-bold">{totalScore}/{maxScore}</span>. Munosabatingiz haqida qo'shimcha yozing.
              </p>
              <textarea value={writtenAnswer} onChange={(e) => setWrittenAnswer(e.target.value)}
                placeholder="Masalan: Biz 3 yildan beri birgamiz, lekin so'nggi paytlarda ko'p janjallashyapmiz..."
                className="w-full h-28 p-3 neu-input text-sm text-[#2d2d2d] placeholder:text-[#8a7b78]/50 resize-none rounded-2xl mb-4" />
              <button onClick={handleSubmitAll} className="w-full bg-[#b5838d] text-white py-3 rounded-full font-bold shadow-[0_4px_15px_rgba(181,131,141,0.4)] active:scale-95 transition-all">
                Tahlilni boshlash
              </button>
            </div>
          </motion.div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center mt-20 gap-4">
            <div className="p-6 rounded-full bg-[#fcf1ef] shadow-[inset_4px_4px_10px_rgba(220,195,185,0.6),inset_-4px_-4px_10px_rgba(255,255,255,0.9)] animate-pulse">
              <Heart className="w-10 h-10 text-[#b5838d]" />
            </div>
            <p className="text-sm text-[#8a7b78] font-medium">Tahlil qilinmoqda...</p>
          </motion.div>
        )}

        {/* CHAT */}
        {step === "chat" && (
          <motion.div key="chat" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="flex flex-col h-[calc(100vh-200px)] gap-3">
            <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col gap-3 py-2 no-scrollbar">
              {messages.filter((m, i) => i > 0 || m.role === "model").map((msg, idx) => (
                <motion.div key={idx} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[88%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#b5838d] text-white shadow-md rounded-br-sm"
                      : "neu-card border border-white/40 text-[#2d2d2d] rounded-bl-sm prose prose-sm prose-p:text-[#2d2d2d] prose-strong:text-[#b5838d]"
                  }`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl p-4 text-sm neu-card border border-white/40 text-[#8a7b78] rounded-bl-sm flex gap-1">
                    <span className="animate-pulse">●</span><span className="animate-pulse" style={{animationDelay:"0.2s"}}>●</span><span className="animate-pulse" style={{animationDelay:"0.4s"}}>●</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} placeholder="Savol yozing..." className="flex-1 h-12 neu-input rounded-full px-4 text-[#2d2d2d] text-sm placeholder:text-[#8a7b78]/50" disabled={isLoading} />
              <button disabled={isLoading || !chatInput.trim()} onClick={handleSend} className="h-12 w-12 flex items-center justify-center neu-button text-[#b5838d] rounded-full disabled:opacity-50"><Send className="w-5 h-5" /></button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
