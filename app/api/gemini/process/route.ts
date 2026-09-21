import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Ensure this route takes max Vercel timeout (optional)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured in .env" },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Zukünftiger Prompt für E-Mails:
    // "Du bist ein Rechnungs-Assistent. Lies diese E-Mail, erkenne ob ein Anhang eine Rechnung ist..."
    
    // Für diesen Proof-of-Concept simulieren wir eine strukturierte Aufgabe:
    const prompt = `
      Simuliere die Prüfung eines Posteingangs. 
      Antworte exakt mit folgendem JSON-Format (keine Markdown Blocks, nur JSON):
      {
        "status": "success",
        "message": "Erfolgreich 3 E-Mails geprüft. 1 neue Rechnung gefunden und (simuliert) in Drive gespeichert.",
        "processedCount": 3,
        "invoicesFound": 1
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let resultData;
    const text = response.text || "";
    
    try {
      resultData = JSON.parse(text);
    } catch {
      // Fallback
      resultData = { status: "success", message: text };
    }

    return NextResponse.json(resultData);
  } catch (error) {
    console.error("Gemini Automation Error:", error);
    return NextResponse.json(
      { error: "Verarbeitung fehlgeschlagen: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    );
  }
}
