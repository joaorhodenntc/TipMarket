import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import prisma from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, tipId, amount, payment_type } = body;


    // Busca os dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Separa o nome completo em primeiro nome e sobrenome
    const nameParts = user.full_name?.split(" ") || ["User", "Test"];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Test";

    const payment = new Payment(client);

    if (payment_type === "pix") {
      const result = await payment.create({
        body: {
          transaction_amount: amount,
          payment_method_id: "pix",
          payer: {
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            identification: {
              type: "CPF",
              number: body.cpf || "12345678909",
            },
          },
          description: "Compra de Tip",
          external_reference: `${userId}-${tipId}`,
        },
      });

      if (!result.point_of_interaction?.transaction_data || !result.id) {
        throw new Error("Dados do QR Code não disponíveis");
      }

      // Cria o registro de compra pendente
      await prisma.purchase.create({
        data: {
          user_id: userId,
          tip_id: tipId,
          amount: amount,
          status: "pending",
          payment_id: result.id?.toString(),
        },
      });

      // Retorna os dados do QR Code
      return NextResponse.json({
        qr_code: result.point_of_interaction.transaction_data.qr_code,
        qr_code_base64:
          result.point_of_interaction.transaction_data.qr_code_base64,
        payment_id: result.id,
      });
    } else {
      // Pagamento com cartão
      const result = await payment.create({
        body: {
          transaction_amount: amount,
          token: body.token,
          payment_method_id: body.payment_method_id,
          installments: 1,
          payer: {
            email: user.email,
            first_name: firstName,
            last_name: lastName,
            identification: {
              type: "CPF",
              number: "12345678909",
            },
          },
          description: "Compra de Tip",
          external_reference: `${userId}-${tipId}`,
        },
      });

      if (!result.id) {
        throw new Error("Erro ao processar pagamento");
      }

      // Cria o registro de compra pendente
      await prisma.purchase.create({
        data: {
          user_id: userId,
          tip_id: tipId,
          amount: amount,
          status: result.status === "approved" ? "approved" : "pending",
          payment_id: result.id?.toString(),
        },
      });

      // Retorna o status do pagamento
      return NextResponse.json({
        status: result.status,
        payment_id: result.id,
      });
    }
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}
