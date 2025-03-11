"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "../_components/Header";
import TipCard from "../_components/TipCard";

interface Tip {
  id: string;
  description: string;
  game: string;
  odd: number;
  imageTip: string;
  imageTipBlur: string;
  gameDate: string;
  status: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    const userId = session?.user.id;
    if (!userId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userTipsResponse = await fetch("/api/tips/user", {
          headers: { "user-id": userId },
        });
        const userTips = await userTipsResponse.json();

        setTips(userTips);
      } catch (error) {
        console.error("Erro ao carregar tips:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  return (
    <div>
      <Header />

      <div className="flex flex-col items-center justify-center gap-4 pt-10">
        <a href="/">
          <Image src="/logo.png" width={100} height={100} alt="Logo" />
        </a>
        <h1 className="text-2xl font-bold text-white">Minhas Tips</h1>

        {isLoading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : tips.length === 0 ? (
          <p className="text-gray-500">
            Você não possui nenhuma tip no momento.
          </p>
        ) : (
          <div className="w-10/12 lg:w-1/3 mt-3">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
