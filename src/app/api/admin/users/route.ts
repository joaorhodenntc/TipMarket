import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // Verificar se o usuário está autenticado e é admin
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Buscar todos os usuários com suas compras e tips gratuitas
    const users = await prisma.user.findMany({
      where: {
        role: "user", // Excluir admins da lista
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        purchases: {
          where: {
            status: "approved",
          },
          include: {
            tip: {
              select: {
                status: true,
              },
            },
          },
        },
        free_tips: {
          where: {
            tip: {
              status: "pending", // Apenas tips pendentes contam como disponíveis
            },
          },
        },
      },
    });

    // Formatar a resposta
    const formattedUsers = users.map((user) => {
      const tipsPurchased = user.purchases.length;
      const tipsWithRed = user.purchases.filter(
        (purchase) => purchase.tip.status === "red"
      ).length;
      const hasFreeTip = user.free_tips.length > 0;

      return {
        id: user.id,
        name: user.full_name || "Sem nome",
        email: user.email,
        tipsPurchased,
        tipsWithRed,
        hasFreeTip,
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}
