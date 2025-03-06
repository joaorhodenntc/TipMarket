import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import prisma from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "ID do pagamento é obrigatório" },
        { status: 400 }
      );
    }

    const payment = new Payment(client);
    const result = await payment.get({ id: paymentId });

    if (!result.external_reference) {
      throw new Error("Referência externa não encontrada");
    }

    if (result.status === "approved") {
      // Verifica se a compra existe
      const purchase = await prisma.purchase.findFirst({
        where: {
          payment_id: paymentId,
        },
      });

      if (!purchase) {
        return NextResponse.json(
          { error: "Compra não encontrada" },
          { status: 404 }
        );
      }

      // Atualiza apenas a compra específica usando o payment_id
      await prisma.purchase.update({
        where: {
          id: purchase.id,
        },
        data: {
          status: "approved",
        },
      });

      return NextResponse.json({ status: "success" });
    }

    return NextResponse.json({ status: result.status });
  } catch (error) {
    console.error("Erro ao verificar status do pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao verificar status do pagamento" },
      { status: 500 }
    );
  }
}
