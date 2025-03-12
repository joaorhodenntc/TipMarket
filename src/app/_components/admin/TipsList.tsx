"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
  TrendingUp,
  FileText,
  Search,
  Filter,
  ListFilter,
  Mail,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  type: "Comprador" | "Free";
}

interface Tip {
  id: string;
  game: string;
  description: string;
  odd: number;
  gameDate: string;
  status: "pending" | "green" | "red";
  users?: User[];
}

export default function TipsList() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const response = await fetch("/api/admin/tips");
      const data = await response.json();
      setTips(data);
    } catch (error) {
      console.error("Erro ao buscar tips:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    tipId: string,
    newStatus: "green" | "red" | "pending"
  ) => {
    try {
      const response = await fetch(`/api/admin/tips/${tipId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar status");
      }

      // Atualiza a lista de tips
      fetchTips();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleViewUsers = async (tip: Tip) => {
    try {
      const response = await fetch(`/api/admin/tips/${tip.id}/users`);
      const data = await response.json();
      setSelectedTip({ ...tip, users: data });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const filteredTips = tips.filter((tip) => {
    // Filtro por status
    if (statusFilter !== "all" && tip.status !== statusFilter) return false;

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tip.game.toLowerCase().includes(query) ||
        tip.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#2A9259]" />
        <p className="text-gray-400">Carregando tips...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#2A9259]/20 flex items-center justify-center">
            <FileText className="h-5 w-5 text-[#2A9259]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Gerenciar Tips</h2>
            <p className="text-gray-400 text-sm">
              Visualize e atualize o status das tips
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Buscar por jogo ou descrição..."
              className="pl-10 bg-gray-800 border-gray-700 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-800 border-gray-700 w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <SelectValue placeholder="Filtrar por status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="green">Green</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800/50 hover:bg-gray-800/70">
                <TableHead className="text-white font-medium">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Jogo</span>
                  </div>
                </TableHead>
                <TableHead className="text-white font-medium">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Descrição</span>
                  </div>
                </TableHead>
                <TableHead className="text-white font-medium">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Data</span>
                  </div>
                </TableHead>
                <TableHead className="text-white font-medium">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span>Odd</span>
                  </div>
                </TableHead>
                <TableHead className="text-white font-medium">
                  <div className="flex items-center gap-1">
                    <ListFilter className="h-4 w-4 text-gray-400" />
                    <span>Status</span>
                  </div>
                </TableHead>
                <TableHead className="text-white font-medium">Ações</TableHead>
                <TableHead className="text-white font-medium">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Compradores</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTips.length === 0 ? (
                <TableRow className="border-gray-800">
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-400"
                  >
                    {searchQuery || statusFilter !== "all"
                      ? "Nenhuma tip encontrada com os critérios de busca."
                      : "Nenhuma tip cadastrada."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTips.map((tip) => (
                  <TableRow
                    key={tip.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="text-white font-medium">
                      {tip.game}
                    </TableCell>
                    <TableCell className="text-[#2A9259]">
                      {tip.description}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {formatDate(tip.gameDate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="bg-gray-800/50 text-white border-gray-700"
                      >
                        {tip.odd.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tip.status === "green" ? (
                        <Badge className="bg-[#2A9259]/20 text-[#2A9259] border border-[#2A9259]/30 flex items-center gap-1 px-2 py-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>GREEN</span>
                        </Badge>
                      ) : tip.status === "red" ? (
                        <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 flex items-center gap-1 px-2 py-1">
                          <XCircle className="w-3 h-3" />
                          <span>RED</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex items-center gap-1 px-2 py-1">
                          <Clock className="w-3 h-3" />
                          <span>PENDENTE</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={
                            tip.status === "green" ? "default" : "outline"
                          }
                          className={`${
                            tip.status === "green"
                              ? "bg-[#2A9259] hover:bg-[#2A9259]/90 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-[#2A9259]/20 hover:border-[#2A9259]/50"
                          }`}
                          onClick={() => handleStatusChange(tip.id, "green")}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs">Green</span>
                        </Button>
                        <Button
                          size="sm"
                          variant={tip.status === "red" ? "default" : "outline"}
                          className={`${
                            tip.status === "red"
                              ? "bg-red-500 hover:bg-red-500/90 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50"
                          }`}
                          onClick={() => handleStatusChange(tip.id, "red")}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs">Red</span>
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            tip.status === "pending" ? "default" : "outline"
                          }
                          className={`${
                            tip.status === "pending"
                              ? "bg-yellow-500 hover:bg-yellow-500/90 text-white"
                              : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:bg-yellow-500/20 hover:border-yellow-500/50"
                          }`}
                          onClick={() => handleStatusChange(tip.id, "pending")}
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          <span className="text-xs">Pendente</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        className="bg-[#2A9259] hover:bg-[#2A9259]/80 text-white"
                        onClick={() => handleViewUsers(tip)}
                      >
                        <Users className="w-3 h-3 mr-1" />
                        <span className="text-xs">Ver</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Users className="h-5 w-5 text-[#2A9259]" />
              <span>Compradores da Tip</span>
              {selectedTip?.users && (
                <Badge className="ml-2 bg-gray-800 text-white">
                  {selectedTip.users.length} usuários
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Jogo</p>
                <p className="text-white font-medium">{selectedTip?.game}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Descrição</p>
                <p className="text-[#2A9259] font-medium">
                  {selectedTip?.description}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Data</p>
                <p className="text-white">
                  {selectedTip ? formatDate(selectedTip.gameDate) : ""}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <div className="mt-1">
                  {selectedTip?.status === "green" ? (
                    <Badge className="bg-[#2A9259]/20 text-[#2A9259] border border-[#2A9259]/30 flex items-center gap-1 px-2 py-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>GREEN</span>
                    </Badge>
                  ) : selectedTip?.status === "red" ? (
                    <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 flex items-center gap-1 px-2 py-1">
                      <XCircle className="w-3 h-3" />
                      <span>RED</span>
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex items-center gap-1 px-2 py-1">
                      <Clock className="w-3 h-3" />
                      <span>PENDENTE</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {selectedTip?.users && selectedTip.users.length > 0 ? (
            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800/80 hover:bg-gray-800">
                    <TableHead className="text-white font-medium">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>Nome</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-white font-medium">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>Email</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-white font-medium">
                      <div className="flex items-center gap-1">
                        <ListFilter className="h-4 w-4 text-gray-400" />
                        <span>Tipo</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTip.users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-gray-800/50 hover:bg-gray-800/30"
                    >
                      <TableCell className="text-white font-medium">
                        {user.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.type === "Comprador"
                              ? "bg-[#2A9259]/20 text-[#2A9259] border border-[#2A9259]/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          }
                        >
                          {user.type}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Nenhum comprador encontrado para esta tip
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-gray-700 text-white hover:bg-gray-800 hover:text-white"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
