import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    const requiredBody = z.object({
        topic: z.string().min(1, "Topic is required")
    });

    const parsedBody = requiredBody.safeParse(await req.json());

    if (!parsedBody.success) {
        return NextResponse.json({ error: "Task topic is required" }, { status: 400 });
    }

    const { topic } = parsedBody.data;

    const prompt = `Generate a list of 5 concise, actionable tasks for learning about ${topic}. Return only the tasks, no numbering or formatting.`;

    if (!process.env.GEN_AI_KEY) {
        return NextResponse.json({ error: "Server-side error" }, { status: 500 });
    }

    try {
        
        const genAI = new GoogleGenerativeAI(process.env.GEN_AI_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);

        const tasks = result.response.text() || "";

        if (!tasks) {
            return NextResponse.json({ error: "AI failed to generate tasks" }, { status: 500 });
        }

        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        console.error("AI Request Error:", error);
        return NextResponse.json({ error: "Server-side error: AI request failed" }, { status: 500 });
    }
}
