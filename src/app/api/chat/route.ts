import { NextRequest, NextResponse } from "next/server";

const GLOBAL_RULES = `

QATTIQ QOIDALAR (har doim amal qil):
- Javob O'ZBEK tilida bo'lsin.
- Har bir insonga individual kouch kabi chuqur yondash.
- Agar insonning javobi qisqa, yuzaki bo'lsa yoki o'zini to'liq ochmagan bo'lsa, birdaniga xulosa qilib maslahat berma! Buning o'rniga uni to'liq ochiltiruvchi, ichki holatini va "ichidagi inson" nima deyotganini anglashga yordam beradigan OCHIQ savollar ber.
- QISQA va ANIQ yoz. Maksimum 150-200 so'z.
- Faqat: 1) Muammo nima ekanligini his qilganingni aytish. 2) Yoki bitta kuchli savol berish, yoki amaliy yechim.
- Ortiqcha kirish gap, falsafa, va muallif nomlarini yozma.
- Markdown ishlatib yoz (bold, bullet points).`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, message, systemPrompt } = body;

    const defaultPrompt = "Siz empatiyaga boy psixolog-maslahatchisiz.";
    const finalSystemPrompt = (systemPrompt || defaultPrompt) + GLOBAL_RULES;

    // Build conversation contents
    const contents: { role: string; parts: { text: string }[] }[] = [];

    if (messages && Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
    } else if (message) {
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });
    } else {
      return NextResponse.json({ error: "Xabar talab qilinadi" }, { status: 400 });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY topilmadi" }, { status: 500 });
    }

    // Try multiple models in order of preference
    const MODELS = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b"
    ];

    let allErrors: string[] = [];

    for (const modelName of MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: finalSystemPrompt }],
            },
            contents,
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ reply: text, message: text }, { status: 200 });
          }
          allErrors.push(`${modelName}: AI javob qaytarmadi`);
        } else {
          const errData = await res.json().catch(() => ({}));
          const errStr = errData?.error?.message || `Status ${res.status}`;
          allErrors.push(`${modelName}: ${errStr}`);
          continue;
        }
      } catch (e: any) {
        allErrors.push(`${modelName}: ${e?.message || "Tarmoq xatosi"}`);
        continue;
      }
    }

    return NextResponse.json({ error: `AI xatosi: ${allErrors.join(" | ")}` }, { status: 500 });
  } catch (error: any) {
    console.error("API Xatosi:", error?.message || error);
    return NextResponse.json({ error: `Serverda xatolik: ${error?.message || "Noma'lum"}` }, { status: 500 });
  }
}
