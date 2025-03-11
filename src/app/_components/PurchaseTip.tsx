"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PaymentModal from "./PaymentModal";
import { Calendar, Clock, ShoppingCart, Loader2 } from "lucide-react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + 3);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

interface Tip {
  id: string;
  imageTipBlur: string;
  imageTipClear?: string; // Essa propriedade só vem de /api/tips/user
  gameDate: string;
  price: number;
}

export default function PurchaseTip() {
  const { data: session } = useSession();
  const [tip, setTip] = useState<Tip | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    qrCode: string;
    qrCodeBase64: string;
    paymentId: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = session?.user.id;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Busca a tip do dia
        const tipResponse = await fetch("/api/tips");
        const tipData = await tipResponse.json();

        if (tipData.message) {
          setMessage(tipData.message);
          setIsLoading(false);
          return;
        }

        setTip(tipData);

        setImageSrc(tipData.imageTipBlur);

        // 2. Busca as tips compradas pelo usuário (apenas com pagamento aprovado)
        if (!userId) {
          setIsLoading(false);
          return;
        }

        const userTipsResponse = await fetch("/api/tips/user", {
          headers: { "user-id": userId },
        });
        const userTips = await userTipsResponse.json();

        // 3. Verifica se a tip do dia está na lista de compradas
        const purchasedTip = userTips.find(
          (userTip: Tip) => userTip.id === tipData.id
        );

        if (purchasedTip) {
          setHasPurchased(true);
          setImageSrc(purchasedTip.imageTip);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar as tips:", error);
        setMessage("Erro ao carregar as tips.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handlePurchase = async () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (tip) {
      try {
        const response = await fetch("/api/tips/user", {
          headers: { "user-id": session?.user.id || "" },
        });
        const userTips = await response.json();

        const purchasedTip = userTips.find(
          (userTip: Tip) => userTip.id === tip.id
        );

        if (purchasedTip) {
          setHasPurchased(true);
          setImageSrc(purchasedTip.imageTip);
        }
      } catch (error) {
        console.error("Erro ao atualizar tip:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#2A9259] mb-4" />
        <h2 className="text-xl font-medium">Carregando dica do dia...</h2>
      </div>
    );
  }

  if (message) {
    const isTipUnavailable = message.toLowerCase().includes("indisponível");

    return (
      <>
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 max-w-md mx-auto mt-10">
          <h1 className="text-white text-center text-xl font-medium">
            {message}
          </h1>

          {isTipUnavailable && (
            <div className="mt-6 flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 bg-gray-800/50 px-5 py-3 rounded-lg">
                <span className="text-[#2A9259] font-medium">
                  Procurando oportunidades
                </span>
                <div className="relative w-6 h-6">
                  <div className="absolute w-6 h-6 animate-ping rounded-full bg-[#2A9259]/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    🔍
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-sm mt-4 text-center">
                Nossa equipe está analisando os próximos jogos para trazer as
                melhores dicas para você.
                <br />
                Volte mais tarde!
              </p>
            </div>
          )}
        </div>
      </>
    );
  }

  if (!tip || !imageSrc) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 max-w-md mx-auto mt-10">
        <h1 className="text-white text-center text-xl font-medium">
          Carregando...
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 max-w-md mx-auto mt-7 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-4">
          {!hasPurchased ? (
            <div className="flex flex-col items-center justify-center mb-2">
              <div className="inline-flex items-center gap-2 bg-gray-800/50 px-4 py-1.5 rounded-full mb-3">
                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                  <Calendar size={14} className="text-[#2A9259]" />
                  <span>{formatDate(tip.gameDate)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <h1 className="text-white font-light text-3xl tracking-wide">
                  TIP
                </h1>
                <div className="relative">
                  <h1 className="text-[#2A9259] font-semibold text-3xl tracking-wide">
                    DISPONÍVEL
                  </h1>
                  <div className="absolute -top-1 -right-3 w-2 h-2 bg-[#2A9259] rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                Desbloqueie a dica do dia para ter acesso completo
              </p>
            </div>
          ) : (
            <div className="mb-2">
              <div className="inline-flex items-center gap-2 bg-gray-800/50 px-4 py-1.5 rounded-full mb-3">
                <div className="flex items-center gap-1.5 text-gray-300 text-sm">
                  <Calendar size={14} className="text-[#2A9259]" />
                  <span>{formatDate(tip.gameDate)}</span>
                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                  <Clock size={14} className="text-[#2A9259]" />
                  <span>{formatTime(tip.gameDate)}</span>
                </div>
              </div>
              <h1 className="text-white font-light text-3xl tracking-wide">
                TIP DO DIA:
              </h1>
              <div className="inline-flex items-center mt-2 bg-[#2A9259]/20 px-3 py-1 rounded-full">
                <span className="text-[#2A9259] text-sm font-medium">
                  Desbloqueado
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="relative rounded-lg overflow-hidden border border-gray-700 shadow-inner">
          <Image
            src={imageSrc || "/placeholder.svg"}
            width={1500}
            height={1500}
            quality={100}
            alt="Tip"
            className="w-full h-auto object-cover opacity-50"
          />
          {!hasPurchased && (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/70 flex items-end justify-center pb-4">
              <span className="text-gray-300 text-sm font-medium">
                Imagem desfocada • Compre para desbloquear
              </span>
            </div>
          )}
        </div>

        {!hasPurchased && (
          <Button
            variant="outline"
            className="w-full mt-5 bg-[#2A9259] border-none text-white font-medium py-6 hover:bg-[#2A9259]/90 hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={handlePurchase}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            COMPRAR AGORA
          </Button>
        )}

        {tip && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            userId={session?.user.id || ""}
            tipId={tip.id}
            amount={20}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    </>
  );
}
