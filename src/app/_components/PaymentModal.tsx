"use client";
import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  QrCode,
  Copy,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";

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
  onPaymentSuccess: () => Promise<void>;
}

export default function PaymentModal({
  isOpen,
  onClose,
  userId,
  tipId,
  amount,
  onPaymentSuccess,
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
  const [copied, setCopied] = useState(false);

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

      // Aguarda o pagamento ser confirmado
      const checkPayment = setInterval(async () => {
        const statusResponse = await fetch(
          `/api/payment/status/${data.payment_id}`
        );
        const statusData = await statusResponse.json();

        if (statusData.status === "approved") {
          clearInterval(checkPayment);
          await onPaymentSuccess();
          setStatus("success");
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }, 5000);
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
        await onPaymentSuccess();
        setStatus("success");
        setTimeout(() => {
          onClose();
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
      // Formata o CPF enquanto digita
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        .substring(0, 14);
      setCpf(formattedValue);
    } else if (name === "cardNumber") {
      // Formata o número do cartão em grupos de 4
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .substring(0, 19);
      setCardData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const copyToClipboard = () => {
    if (qrCodeData) {
      navigator.clipboard.writeText(qrCodeData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#121A25] border-[#2A9259] max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2A9259]/20 to-[#121A25] p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-xl font-medium">
              {status === "pending" &&
                !paymentMethod &&
                "Escolha a forma de pagamento"}
              {status === "pending" &&
                paymentMethod === "pix" &&
                !qrCodeData &&
                "Pagamento via PIX"}
              {status === "pending" &&
                paymentMethod === "pix" &&
                qrCodeData &&
                "QR Code PIX"}
              {status === "pending" &&
                paymentMethod === "card" &&
                "Pagamento com Cartão"}
              {status === "success" && "Pagamento Confirmado"}
              {status === "rejected" && "Pagamento Rejeitado"}
            </DialogTitle>
          </DialogHeader>

          <div className="text-center mt-2">
            <div className="inline-flex items-center bg-[#1A2430] px-4 py-1.5 rounded-full">
              <span className="text-[#2A9259] font-medium">R$ {amount}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {status === "pending" && !paymentMethod && (
            <div className="space-y-4">
              <p className="text-gray-400 text-sm text-center mb-4">
                Escolha como deseja realizar o pagamento para desbloquear a tip
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className="bg-[#1A2430] hover:bg-[#1A2430]/80 border border-[#2A9259]/30 rounded-xl p-4 transition-all duration-200 hover:border-[#2A9259] group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#2A9259]/10 flex items-center justify-center mb-3 group-hover:bg-[#2A9259]/20 transition-all duration-200">
                      <QrCode className="w-6 h-6 text-[#2A9259]" />
                    </div>
                    <span className="text-white font-medium">PIX</span>
                    <span className="text-gray-400 text-xs mt-1">
                      Pagamento instantâneo
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className="bg-[#1A2430] hover:bg-[#1A2430]/80 border border-[#2A9259]/30 rounded-xl p-4 transition-all duration-200 hover:border-[#2A9259] group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#2A9259]/10 flex items-center justify-center mb-3 group-hover:bg-[#2A9259]/20 transition-all duration-200">
                      <CreditCard className="w-6 h-6 text-[#2A9259]" />
                    </div>
                    <span className="text-white font-medium">Cartão</span>
                    <span className="text-gray-400 text-xs mt-1">
                      Crédito ou débito
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {status === "pending" && paymentMethod === "pix" && !qrCodeData && (
            <form onSubmit={handlePixPayment} className="space-y-4">
              <p className="text-gray-400 text-sm mb-4">
                Informe seu CPF para gerar o código PIX
              </p>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <Input
                  name="cpf"
                  placeholder="CPF (apenas números)"
                  value={cpf}
                  onChange={handleInputChange}
                  className="bg-[#1A2430] text-white border-[#2A9259]/50 focus:border-[#2A9259] pl-10 py-6"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2A9259] hover:bg-[#1f6940] text-white py-6 rounded-lg transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando PIX...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code PIX
                  </div>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="w-full bg-transparent border border-[#2A9259]/50 text-white hover:bg-[#1A2430] hover:border-[#2A9259] rounded-lg transition-all duration-200 flex items-center justify-center py-5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </form>
          )}

          {status === "pending" && paymentMethod === "pix" && qrCodeData && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block mx-auto">
                <img
                  src={`data:image/jpeg;base64,${qrCodeData.qr_code_base64}`}
                  alt="QR Code"
                  className="mx-auto"
                  width={180}
                  height={180}
                />
              </div>

              <div className="bg-[#1A2430] p-3 rounded-lg">
                <p className="text-gray-300 text-sm mb-2">
                  Escaneie o QR Code com o app do seu banco ou copie o código
                </p>

                <div className="relative">
                  <Button
                    onClick={copyToClipboard}
                    className={`w-full ${
                      copied ? "bg-green-600" : "bg-[#2A9259]"
                    } hover:bg-[#1f6940] text-white py-5 rounded-lg transition-all duration-200 flex items-center justify-center`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Código copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar código PIX
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="text-gray-400 text-sm p-3 bg-[#1A2430]/50 rounded-lg">
                <p>Após o pagamento, a tip será liberada automaticamente</p>
              </div>

              <Button
                onClick={() => {
                  setQrCodeData(null);
                  setPaymentMethod(null);
                }}
                className="w-full bg-transparent border border-[#2A9259]/50 text-white hover:bg-[#1A2430] hover:border-[#2A9259] rounded-lg transition-all duration-200 flex items-center justify-center py-5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          )}

          {status === "pending" && paymentMethod === "card" && (
            <form onSubmit={handleCardPayment} className="space-y-4">
              <p className="text-gray-400 text-sm mb-4">
                Informe os dados do seu cartão para pagamento
              </p>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <CreditCard size={16} />
                </div>
                <Input
                  name="cardNumber"
                  placeholder="Número do Cartão"
                  value={cardData.cardNumber}
                  onChange={handleInputChange}
                  className="bg-[#1A2430] text-white border-[#2A9259]/50 focus:border-[#2A9259] pl-10 py-6"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <Calendar size={16} />
                  </div>
                  <Input
                    name="cardExpirationMonth"
                    placeholder="Mês (MM)"
                    value={cardData.cardExpirationMonth}
                    onChange={handleInputChange}
                    maxLength={2}
                    className="bg-[#1A2430] text-white border-[#2A9259]/50 focus:border-[#2A9259] pl-10 py-6"
                  />
                </div>
                <Input
                  name="cardExpirationYear"
                  placeholder="Ano (AA)"
                  value={cardData.cardExpirationYear}
                  onChange={handleInputChange}
                  maxLength={2}
                  className="bg-[#1A2430] text-white border-[#2A9259]/50 focus:border-[#2A9259] py-6"
                />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                    <ShieldCheck size={16} />
                  </div>
                  <Input
                    name="securityCode"
                    placeholder="CVV"
                    value={cardData.securityCode}
                    onChange={handleInputChange}
                    maxLength={4}
                    className="bg-[#1A2430] text-white border-[#2A9259]/50 focus:border-[#2A9259] pl-10 py-6"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                  <User size={16} />
                </div>
                <Input
                  name="cardholderName"
                  placeholder="Nome no Cartão"
                  value={cardData.cardholderName}
                  onChange={handleInputChange}
                  className="bg-[#1A2430] text-white border-[#2A9259]/50 focus:border-[#2A9259] pl-10 py-6"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2A9259] hover:bg-[#1f6940] text-white py-6 rounded-lg transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pagar R$ {amount}
                  </div>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => setPaymentMethod(null)}
                className="w-full bg-transparent border border-[#2A9259]/50 text-white hover:bg-[#1A2430] hover:border-[#2A9259] rounded-lg transition-all duration-200 flex items-center justify-center py-5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </form>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#2A9259]/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-[#2A9259]" />
              </div>

              <div>
                <p className="text-[#2A9259] text-xl font-bold">
                  Pagamento Confirmado!
                </p>
                <p className="text-gray-300 mt-2">
                  Sua tip será liberada em instantes...
                </p>
              </div>

              <div className="w-full max-w-[120px] h-1 bg-[#1A2430] mx-auto rounded-full overflow-hidden">
                <div className="h-full bg-[#2A9259] animate-progress"></div>
              </div>
            </div>
          )}

          {status === "rejected" && (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>

              <div>
                <p className="text-red-500 text-xl font-bold">
                  Pagamento Rejeitado
                </p>
                <p className="text-gray-300 mt-2">
                  {error ||
                    "Tente novamente ou entre em contato com o suporte."}
                </p>
              </div>

              <Button
                onClick={() => {
                  setStatus("pending");
                  setPaymentMethod(null);
                  setError("");
                }}
                className="w-full bg-[#2A9259] hover:bg-[#1f6940] text-white py-6 rounded-lg transition-all duration-200"
              >
                Tentar Novamente
              </Button>
            </div>
          )}

          {error && status === "pending" && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
