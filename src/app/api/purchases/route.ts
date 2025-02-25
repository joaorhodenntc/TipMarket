import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { user_id, tip_id, amount } = await request.json();

    if (!user_id || !tip_id || amount == null) {
      return NextResponse.json(
        { error: "Campos obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se a compra já foi feita
    const existingPurchase = await prisma.purchase.findFirst({
      where: { user_id, tip_id },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: "Tip já foi comprada" },
        { status: 400 }
      );
    }

    // Cria a compra
    const purchase = await prisma.purchase.create({
      data: { user_id, tip_id, amount },
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error("Erro ao registrar compra:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
