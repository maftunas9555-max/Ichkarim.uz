import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GLOBAL_RULES = `

QATTIQ QOIDALAR (har doim amal qil):
- Javob O'ZBEK tilida bo'lsin.
- QISQA va ANIQ yoz. Maksimum 150-200 so'z.
- Faqat: 1) Muammo nima. 2) Amaliy yechim yoki vazifa.
- Ortiqcha kirish gap, falsafa, va muallif nomlarini yozma.
- Markdown ishlatib yoz (bold, bullet points).`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, message, systemPrompt } = body;

    const defaultPrompt = "Siz empatiyaga boy psixolog-maslahatchisiz.";
    const finalSystemPrompt = (systemPrompt || defaultPrompt) + GLOBAL_RULES;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      systemInstruction: finalSystemPrompt,
    });

    // Support both single message and messages array
    let history: { role: string; parts: { text: string }[] }[] = [];
    let lastMessage = "";

    if (messages && Array.isArray(messages) && messages.length > 0) {
      history = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));
      lastMessage = messages[messages.length - 1].content;
    } else if (message) {
      lastMessage = message;
    } else {
      return NextResponse.json({ error: "Xabar talab qilinadi" }, { status: 400 });
    }

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText, message: responseText }, { status: 200 });
  } catch (error: any) {
    console.error("Gemini API Xatosi:", error?.message || error);
    const errorMsg = error?.message || "Noma'lum xatolik";
    return NextResponse.json({ error: `Serverda xatolik: ${errorMsg}` }, { status: 500 });
  }
}

