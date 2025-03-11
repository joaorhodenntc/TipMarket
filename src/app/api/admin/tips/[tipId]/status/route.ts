import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const { status } = await request.json();

    if (!status || !["green", "red", "pending"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const updatedTip = await prisma.tip.update({
      where: { id: params.tipId },
      data: { status },
    });

    return NextResponse.json(updatedTip);
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status" },
      { status: 500 }
    );
  }
}
