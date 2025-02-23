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
    const findUser = await prisma.user.findFirst({
        where: {username}
    })

    if (!findUser?.username) {
        return NextResponse.json({message: 'invalid username'});
    }

    const hashpassword = await bcrypt.compare(passowrd, findUser.password);

    if (!hashpassword) {
        return NextResponse.json({message: 'invalid password'});   
    }

    return NextResponse.json(
      { message: "Your login successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "server side error you are not registerd" },
      { status: 500 }
    );
  }
}
