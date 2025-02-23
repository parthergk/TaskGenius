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

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { userId },
    });

    if (tasks.length === 0) {
      return NextResponse.json({ message: "No tasks found" }, { status: 404 });
    }

    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}