import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const requiredBody = z.object({
    username: z.string(),
    passowrd: z.string(),
  });

  const parsedBody = requiredBody.safeParse(await req.json());

  if (!parsedBody.success) {
    return NextResponse.json({ error: "invalid inputs" });
  }

  const { username, passowrd } = parsedBody.data;

  try {
    const hashpassword = await bcrypt.hash(passowrd, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashpassword,
      },
    });
    return NextResponse.json(
      { message: "Your register successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "server side error you are not registerd" },
      { status: 500 }
    );
  }
}
