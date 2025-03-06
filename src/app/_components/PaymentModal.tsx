"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    MercadoPago: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  tipId: string;
  amount: number;
}

export default function PaymentModal({
  isOpen,
  onClose,
  userId,
  tipId,
  amount,
}: PaymentModalProps) {
  const [status, setStatus] = useState<string>("pending");
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card" | null>(
    null
  );
  const [cpf, setCpf] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardExpirationMonth: "",
    cardExpirationYear: "",
    securityCode: "",
    cardholderName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [qrCodeData, setQrCodeData] = useState<{
    qr_code: string;
    qr_code_base64: string;
  } | null>(null);

  const handlePixPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          tipId,
          amount,
          payment_type: "pix",
          cpf: cpf.replace(/\D/g, ""), // Remove caracteres não numéricos
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setQrCodeData({
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64,
      });
    } catch (error: any) {
      console.error("Erro ao gerar PIX:", error);
      setError(error.message || "Erro ao gerar PIX");
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const mp = new window.MercadoPago(
        "TEST-dda312b0-3b99-40f1-8fb5-c8d0177d07d5"
      );

      // Primeiro, identifica o tipo de cartão
      const cardNumber = cardData.cardNumber.replace(/\s/g, "");
      const paymentMethod = await mp.getPaymentMethods({
        bin: cardNumber.substring(0, 6),
      });

      if (!paymentMethod.results || paymentMethod.results.length === 0) {
        throw new Error("Cartão não suportado");
      }

      const payment_method_id = paymentMethod.results[0].id;

      // Depois, gera o token do cartão
      const cardTokenResult = await mp.createCardToken({
        cardNumber: cardNumber,
        cardholderName: cardData.cardholderName,
        cardExpirationMonth: cardData.cardExpirationMonth,
        cardExpirationYear: "20" + cardData.cardExpirationYear,
        securityCode: cardData.securityCode,
        identificationType: "CPF",
        identificationNumber: "12345678909",
      });

      if (!cardTokenResult.id) {
        throw new Error("Erro ao gerar token do cartão");
      }

      // Envia o token para o backend
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          tipId,
          amount,
          payment_type: "card",
          token: cardTokenResult.id,
          payment_method_id: payment_method_id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setStatus("rejected");
        return;
      }

      if (data.status === "approved") {
        setStatus("success");
        setTimeout(() => {
          onClose();
          router.refresh();
        }, 2000);
      } else {
        setError("Pagamento não aprovado. Por favor, tente novamente.");
        setStatus("rejected");
      }
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error);
      setError(error.message || "Erro ao processar pagamento");
      setStatus("rejected");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      setCpf(value);
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#121A25] border-[#2A9259]">
        <DialogHeader>
          <DialogTitle className="text-white text-center">
            Escolha a forma de pagamento
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {status === "pending" && !paymentMethod && (
            <div className="flex gap-4 w-full">
              <Button
                onClick={() => setPaymentMethod("pix")}
                className="flex-1 bg-[#2A9259] hover:bg-[#1f6940] text-white"
              >
                PIX
              </Button>
              <Button
                onClick={() => setPaymentMethod("card")}
                className="flex-1 bg-[#2A9259] hover:bg-[#1f6940] text-white"
              >
                Cartão
              </Button>
            </div>
          )}

          {status === "pending" && paymentMethod === "pix" && !qrCodeData && (
            <form onSubmit={handlePixPayment} className="w-full space-y-4">
              <div>
                <Input
                  name="cpf"
                  placeholder="CPF"
                  value={cpf}
                  onChange={handleInputChange}
                  maxLength={11}
                  required
                  className="bg-[#1A2430] text-white border-[#2A9259]"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2A9259] hover:bg-[#1f6940] text-white"
              >
                {loading ? "Gerando PIX..." : "Gerar PIX"}
              </Button>
              <Button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="w-full bg-transparent border border-[#2A9259] text-white hover:bg-[#1f6940]"
              >
                Voltar
              </Button>
            </form>
          )}

          {status === "pending" && paymentMethod === "pix" && qrCodeData && (
            <div className="text-center">
              <img
                src={`data:image/jpeg;base64,${qrCodeData.qr_code_base64}`}
                alt="QR Code"
                className="mx-auto mb-4"
                width={200}
              />
              <p className="text-white mb-4">
                Escaneie o QR Code acima com seu aplicativo do banco ou
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(qrCodeData.qr_code);
                  }}
                  className="w-full bg-[#2A9259] hover:bg-[#1f6940] text-white"
                >
                  Copiar código PIX
                </Button>
                <Button
                  onClick={() => {
                    setQrCodeData(null);
                    setPaymentMethod(null);
                  }}
                  className="w-full bg-transparent border border-[#2A9259] text-white hover:bg-[#1f6940]"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}

          {status === "pending" && paymentMethod === "card" && (
            <form onSubmit={handleCardPayment} className="w-full space-y-4">
              <div>
                <Input
                  name="cardNumber"
                  placeholder="Número do Cartão"
                  value={cardData.cardNumber}
                  onChange={handleInputChange}
                  maxLength={16}
                  required
                  className="bg-[#1A2430] text-white border-[#2A9259]"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  name="cardExpirationMonth"
                  placeholder="Mês (MM)"
                  value={cardData.cardExpirationMonth}
                  onChange={handleInputChange}
                  maxLength={2}
                  required
                  className="bg-[#1A2430] text-white border-[#2A9259]"
                />
                <Input
                  name="cardExpirationYear"
                  placeholder="Ano (AA)"
                  value={cardData.cardExpirationYear}
                  onChange={handleInputChange}
                  maxLength={2}
                  required
                  className="bg-[#1A2430] text-white border-[#2A9259]"
                />
                <Input
                  name="securityCode"
                  placeholder="CVV"
                  value={cardData.securityCode}
                  onChange={handleInputChange}
                  maxLength={4}
                  required
                  className="bg-[#1A2430] text-white border-[#2A9259]"
                />
              </div>
              <div>
                <Input
                  name="cardholderName"
                  placeholder="Nome no Cartão"
                  value={cardData.cardholderName}
                  onChange={handleInputChange}
                  required
                  className="bg-[#1A2430] text-white border-[#2A9259]"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2A9259] hover:bg-[#1f6940] text-white"
              >
                {loading ? "Processando..." : "Pagar"}
              </Button>
              <Button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="w-full bg-transparent border border-[#2A9259] text-white hover:bg-[#1f6940]"
              >
                Voltar
              </Button>
            </form>
          )}

          {status === "success" && (
            <div className="text-center">
              <p className="text-[#2A9259] text-xl font-bold">
                Pagamento Confirmado!
              </p>
              <p className="text-white mt-2">
                Sua tip será liberada em instantes...
              </p>
            </div>
          )}

          {status === "rejected" && (
            <div className="text-center">
              <p className="text-red-500 text-xl font-bold">
                Pagamento Rejeitado
              </p>
              <p className="text-white mt-2">
                {error || "Tente novamente ou entre em contato com o suporte."}
              </p>
              <Button
                onClick={() => {
                  setStatus("pending");
                  setPaymentMethod(null);
                  setError("");
                }}
                className="mt-4 w-full bg-[#2A9259] hover:bg-[#1f6940] text-white"
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {error && status === "pending" && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
