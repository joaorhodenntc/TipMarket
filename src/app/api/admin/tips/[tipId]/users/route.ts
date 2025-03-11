import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { tipId: string } }
) {
  try {
    const [purchaseUsers, freeTipUsers] = await Promise.all([
      prisma.purchase.findMany({
        where: { tip_id: params.tipId },
        select: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      }),
      prisma.freeTip.findMany({
        where: { tip_id: params.tipId },
        select: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const users = [
      ...purchaseUsers.map((p) => ({
        id: p.user.id,
        name: p.user.full_name,
        email: p.user.email,
        type: "Comprador",
      })),
      ...freeTipUsers.map((f) => ({
        id: f.user.id,
        name: f.user.full_name,
        email: f.user.email,
        type: "Free",
      })),
    ];

    return NextResponse.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}
