"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PaymentModal from "./PaymentModal";

interface Tip {
  id: string;
  imageTipBlur: string;
  imageTipClear?: string; // Essa propriedade só vem de /api/tips/user
  dateGame: string;
  hourGame: string;
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

  useEffect(() => {
    const userId = session?.user.id;

    const fetchData = async () => {
      try {
        // 1. Busca a tip do dia
        const tipResponse = await fetch("/api/tips");
        const tipData = await tipResponse.json();

        if (tipData.message) {
          setMessage(tipData.message);
          return;
        }

        setTip(tipData);
        setImageSrc(tipData.imageTipBlur);

        // 2. Busca as tips compradas pelo usuário (apenas com pagamento aprovado)
        if (!userId) return;

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
      } catch (error) {
        console.error("Erro ao buscar as tips:", error);
        setMessage("Erro ao carregar as tips.");
      }
    };

    fetchData();
  }, [session, isPaymentModalOpen]);

  const handlePurchase = async () => {
    setIsPaymentModalOpen(true);
  };

  if (message) {
    return (
      <h1 className="text-white text-center mt-20 text-[20px]">{message}</h1>
    );
  }

  if (!tip || !imageSrc) {
    return (
      <h1 className="text-white text-center mt-20 text-[20px]">
        Carregando...
      </h1>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col mt-7">
      <div className="text-center -space-y-3">
        {!hasPurchased && (
          <div>
            <h1 className="text-white font-light text-[32px]">TIP</h1>
            <h1 className="text-[#2A9259] font-semibold text-[32px]">
              DISPONÍVEL
            </h1>
          </div>
        )}
        {hasPurchased && (
          <div>
            <h1 className="text-white font-light text-[32px]">TIP DO DIA:</h1>
          </div>
        )}
      </div>
      <div className="mt-5">
        <Image
          src={imageSrc}
          width={310}
          height={100}
          quality={100}
          alt="Tip"
        />
      </div>
      {!hasPurchased && (
        <Button
          variant="outline"
          className="w-[310px] mt-7 bg-[#2A9259] border-none text-white"
          onClick={handlePurchase}
        >
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
        />
      )}
    </div>
  );
}
