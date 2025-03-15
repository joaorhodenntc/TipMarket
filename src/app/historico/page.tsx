"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Header from "../_components/Header";
import {
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  date: string;
  teams: string;
  description: string;
  odd: number;
  result: "green" | "red" | "pending";
}

export default function HistoricoPage() {
  const { data: session } = useSession();
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tipsPerPage = 5;

  // Função para obter os meses disponíveis
  const getAvailableMonths = () => {
    const months = tips.map((tip) => {
      // Convertendo a string de data (DD/MM/YYYY) para Date
      const [day, month, year] = tip.date.split("/");
      return `${year}-${month.padStart(2, "0")}`;
    });
    return Array.from(new Set(months)).sort((a, b) => b.localeCompare(a));
  };

  // Função para formatar o nome do mês
  const formatMonth = (monthKey: string) => {
    if (monthKey === "all") return "Todos os meses";
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date
      .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      .replace(/^[a-z]/, (letra) => letra.toUpperCase());
  };

  useEffect(() => {
    const fetchTips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/tips/history");
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const formattedTips = data.map((tip: any) => ({
          id: tip.id,
          date: new Date(tip.gameDate).toLocaleDateString("pt-BR"),
          teams: tip.game,
          description: tip.description,
          odd: tip.odd,
          result: tip.status,
        }));

        setTips(formattedTips);
      } catch (error) {
        console.error("Erro ao buscar histórico de tips:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTips();
  }, []);

  const filteredTips = tips.filter((tip) => {
    // Filtro por mês
    if (selectedMonth !== "all") {
      const [day, month, year] = tip.date.split("/");
      const tipMonthKey = `${year}-${month.padStart(2, "0")}`;
      if (tipMonthKey !== selectedMonth) return false;
    }

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tip.teams.toLowerCase().includes(query) ||
        tip.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Cálculo da paginação
  const totalPages = Math.ceil(filteredTips.length / tipsPerPage);
  const indexOfLastTip = currentPage * tipsPerPage;
  const indexOfFirstTip = indexOfLastTip - tipsPerPage;
  const currentTips = filteredTips.slice(indexOfFirstTip, indexOfLastTip);

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Estatísticas do mês selecionado
  const getMonthStats = () => {
    const tipsToCount = selectedMonth === "all" ? tips : filteredTips;
    const totalTips = tipsToCount.length;
    const greenTips = tipsToCount.filter(
      (tip) => tip.result === "green"
    ).length;
    const completedTips = tipsToCount.filter(
      (tip) => tip.result !== "pending"
    ).length;
    const winRate =
      completedTips > 0 ? Math.round((greenTips / completedTips) * 100) : 0;

    return {
      total: totalTips,
      green: greenTips,
      winRate: winRate,
    };
  };

  const monthStats = getMonthStats();

  const getResultBadge = (result: string) => {
    switch (result) {
      case "green":
        return (
          <div className="flex items-center gap-1 bg-[#2A9259]/20 text-[#2A9259] px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>GREEN</span>
          </div>
        );
      case "red":
        return (
          <div className="flex items-center gap-1 bg-red-500/20 text-red-500 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            <span>RED</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            <span>PENDENTE</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/">
            <Image src="/logo.png" width={100} height={100} alt="Logo" />
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl font-bold mb-2 text-center">
            Histórico de Tips
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Confira o histórico completo de todas as nossas tips e seus
            resultados
          </p>

          {/* Filtros */}
          <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    placeholder="Buscar por equipe ou jogador..."
                    className="pl-10 bg-gray-800 border-gray-700"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="text-gray-500 h-4 w-4" />
                <Select
                  value={selectedMonth}
                  onValueChange={(value) => {
                    setSelectedMonth(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-gray-500">
                    <SelectValue placeholder="Filtrar por mês" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-500">
                    <SelectItem value="all">Todos os meses</SelectItem>
                    {getAvailableMonths().map((month) => (
                      <SelectItem key={month} value={month}>
                        {formatMonth(month)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lista de Tips */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="h-10 w-10 border-4 border-[#2A9259]/30 border-t-[#2A9259] rounded-full animate-spin"></div>
            </div>
          ) : filteredTips.length === 0 ? (
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-800">
              <p className="text-gray-400">
                Nenhuma tip encontrada com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all duration-300"
                >
                  <div className="flex flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-full text-xs text-gray-300">
                          <Calendar className="w-3 h-3 text-[#2A9259]" />
                          <span>{tip.date}</span>
                        </div>
                        {getResultBadge(tip.result)}
                      </div>

                      <h3 className="text-white font-medium mb-1">
                        {tip.teams}
                      </h3>
                      <p className="text-[#2A9259] text-sm font-medium">
                        {tip.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <TrendingUp className="w-4 h-4" />
                          <span>Odd</span>
                        </div>
                        <span className="text-white font-medium">
                          {tip.odd.toFixed(2)}
                        </span>
                      </div>

                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          tip.result === "green"
                            ? "bg-[#2A9259]/20 text-[#2A9259]"
                            : tip.result === "red"
                            ? "bg-red-500/20 text-red-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {tip.result === "green" ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : tip.result === "red" ? (
                          <XCircle className="w-6 h-6" />
                        ) : (
                          <Clock className="w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-8">
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

          {/* Estatísticas */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800 text-center">
              <h3 className="text-gray-400 text-sm mb-1">Total de Tips</h3>
              <p className="text-white text-2xl font-bold">
                {monthStats.total}
              </p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800 text-center">
              <h3 className="text-gray-400 text-sm mb-1">Green</h3>
              <p className="text-[#2A9259] text-2xl font-bold">
                {monthStats.green}
              </p>
            </div>

            <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800 text-center">
              <h3 className="text-gray-400 text-sm mb-1">Assertividade</h3>
              <p className="text-white text-2xl font-bold">
                {monthStats.winRate}%
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
