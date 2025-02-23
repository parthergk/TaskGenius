import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const requiredBody = z.object({
    userId: z.string(),
    title: z.string(),
  });

  const parsedBody = requiredBody.safeParse(await req.json());

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsedBody.error.format() },
      { status: 400 }
    );
  }

  const { userId, title } = parsedBody.data;

  try {
    const task = await prisma.task.create({
      data: { userId, title },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
