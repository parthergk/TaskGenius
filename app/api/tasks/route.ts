import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

export async function POST(req: NextRequest){
    const requiredBody = z.object({
        userId: z.string(),
        title: z.string()
    })

    const parsedBody = requiredBody.safeParse(await req.json())

    if (!parsedBody.success) {
        return NextResponse.json({ error: "Missing fields" }, {status: 400});
    }

    const {userId, title} = parsedBody.data;

    const tasks = await prisma.task.create({
        data: {userId, title},
    })

    return NextResponse.json(tasks,{status:201});
}