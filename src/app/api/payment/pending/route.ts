import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import prisma from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const tipId = searchParams.get("tipId");

    if (!userId || !tipId) {
      return NextResponse.json(
        { error: "Usuário e tip são obrigatórios" },
        { status: 400 }
      );
    }

    // Busca a compra pendente
    const pendingPurchase = await prisma.purchase.findFirst({
      where: {
        user_id: userId,
        tip_id: tipId,
        status: "pending",
      },
    });

    if (!pendingPurchase) {
      return NextResponse.json(
        { error: "Nenhum pagamento pendente encontrado" },
        { status: 404 }
      );
    }

    if (!pendingPurchase.payment_id) {
      return NextResponse.json(
        { error: "ID do pagamento não encontrado" },
        { status: 404 }
      );
    }

    // Busca os detalhes do pagamento no Mercado Pago
    const payment = new Payment(client);
    const result = await payment.get({ id: pendingPurchase.payment_id });

    if (!result.point_of_interaction?.transaction_data) {
      return NextResponse.json(
        { error: "Dados do QR Code não disponíveis" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      qr_code: result.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        result.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: result.id,
    });
  } catch (error) {
    console.error("Erro ao buscar pagamento pendente:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pagamento pendente" },
      { status: 500 }
    );
  }
}
