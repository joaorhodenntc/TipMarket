"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "../_components/Header";
import TipCard from "../_components/TipCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  const [currentPage, setCurrentPage] = useState(1);
  const tipsPerPage = 5;

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

        // Ordenando as tips pela data do jogo (mais recentes primeiro)
        const sortedTips = userTips.sort(
          (a: Tip, b: Tip) =>
            new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime()
        );

        setTips(sortedTips);
      } catch (error) {
        console.error("Erro ao carregar tips:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  // Cálculo da paginação
  const totalPages = Math.ceil(tips.length / tipsPerPage);
  const indexOfLastTip = currentPage * tipsPerPage;
  const indexOfFirstTip = indexOfLastTip - tipsPerPage;
  const currentTips = tips.slice(indexOfFirstTip, indexOfLastTip);

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            {currentTips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-8 pb-5">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`text-white opacity-50 ${
                          currentPage === 1
                            ? "pointer-events-none"
                            : "cursor-pointer hover:bg-[#2A9259]/20"
                        }`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;
                      // Mostrar primeira página, página atual, última página e páginas adjacentes
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              className={`cursor-pointer ${
                                currentPage === page
                                  ? "bg-[#2A9259] text-white"
                                  : "hover:bg-[#2A9259]/20"
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`text-white opacity-50 ${
                          currentPage === totalPages
                            ? "pointer-events-none"
                            : "cursor-pointer hover:bg-[#2A9259]/20"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
