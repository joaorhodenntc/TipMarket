"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "../_components/Header";

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
              <div
                key={tip.id}
                className={`border rounded-lg p-4 mb-4 shadow-md bg-[#121A25] text-white ${
                  tip.status == "green" ? "border-[#2A9259]" : ""
                }`}
              >
                <p className="font-bold">{tip.description}</p>
                <p className="text-sm text-gray-500 ">{tip.game}</p>
                <p className="text-sm text-gray-500">Odd: {tip.odd}</p>
                <p className="text-sm text-gray-500">
                  Data: {new Date(tip.gameDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  Status:
                  {tip.status == "green" ? (
                    <span className="font-bold">GREEN ✅</span>
                  ) : tip.status == "red" ? (
                    <span className="font-bold">RED 🔻</span>
                  ) : (
                    " Pendente"
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
