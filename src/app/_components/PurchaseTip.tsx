"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
        setImageSrc(tipData.imageTipBlur); // Inicia com a imagem borrada

        // 2. Busca as tips compradas pelo usuário
        if (!userId) return;

        const userTipsResponse = await fetch("/api/tips/user", {
          headers: { "user-id": userId }, // Substituir pelo userId real
        });
        const userTips = await userTipsResponse.json();

        // 3. Verifica se a tip do dia está na lista de compradas
        const purchasedTip = userTips.find(
          (userTip: Tip) => userTip.id === tipData.id
        );

        console.log(tip);

        if (purchasedTip) {
          setHasPurchased(true);
          setImageSrc(purchasedTip.imageTip); // Altera para a imagem real
        }
      } catch (error) {
        console.error("Erro ao buscar as tips:", error);
        setMessage("Erro ao carregar as tips.");
      }
    };

    fetchData();
  }, [session]);

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
          onClick={async () => {
            const response = await fetch("/api/checkout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: session?.user.id,
                tip_id: tip?.id,
                amount: 20,
              }),
            });

            const data = await response.json();

            console.log(data);
            if (data.url) {
              window.location.href = data.url;
            }
          }}
        >
          COMPRAR AGORA
        </Button>
      )}
    </div>
  );
}
