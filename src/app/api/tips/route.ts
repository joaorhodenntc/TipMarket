import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tips = await prisma.tip.findMany({
      select: {
        id: true,
        imageTipBlur: true,
        dateGame: true,
        hourGame: true,
      },
    });

    return NextResponse.json(tips, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar tips:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
