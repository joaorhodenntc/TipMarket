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
  Eye,
  ArrowUpDown,
  Users,
  Search,
  Calendar,
  User,
  Mail,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  tipsPurchased: number;
  created_at: string;
}

interface Tip {
  id: string;
  game: string;
  description: string;
  odd: number;
  gameDate: string;
  status: "green" | "red" | "pending";
}

type SortField = "name" | "email" | "tipsPurchased" | "created_at";
type SortOrder = "asc" | "desc";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUserTips, setSelectedUserTips] = useState<Tip[]>([]);
  const [numberOfTips, setNumberOfTips] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const modifier = sortOrder === "asc" ? 1 : -1;

    switch (sortField) {
      case "name":
        return modifier * a.name.localeCompare(b.name);
      case "email":
        return modifier * a.email.localeCompare(b.email);
      case "tipsPurchased":
        return modifier * (a.tipsPurchased - b.tipsPurchased);
      case "created_at":
        return (
          modifier *
          (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        );
      default:
        return 0;
    }
  });

  const fetchUserTips = async (userId: string, userName: string) => {
    setIsLoadingTips(true);
    setSelectedUserName(userName);
    setIsModalOpen(true);

    try {
      const response = await fetch("/api/tips/user", {
        headers: { "user-id": userId },
      });
      const data = await response.json();
      setNumberOfTips(data.length);
      setSelectedUserTips(data);
    } catch (error) {
      console.error("Erro ao buscar tips do usuário:", error);
    } finally {
      setIsLoadingTips(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "green":
        return (
          <Badge className="bg-[#2A9259]/20 text-[#2A9259] border border-[#2A9259]/30 flex items-center gap-1 px-2 py-1">
            <CheckCircle className="w-3 h-3" />
            <span>GREEN</span>
          </Badge>
        );
      case "red":
        return (
          <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 flex items-center gap-1 px-2 py-1">
            <XCircle className="w-3 h-3" />
            <span>RED</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex items-center gap-1 px-2 py-1">
            <AlertTriangle className="w-3 h-3" />
            <span>PENDENTE</span>
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#2A9259]" />
        <p className="text-gray-400">Carregando usuários...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#2A9259]/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-[#2A9259]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Usuários</h2>
            <p className="text-gray-400 text-sm">
              Gerenciar usuários da plataforma
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-10 bg-gray-800 border-gray-700 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800/50 hover:bg-gray-800/70">
                <TableHead className="text-white font-medium">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-transparent"
                    onClick={() => handleSort("name")}
                  >
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    Nome
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${
                        sortField === "name"
                          ? "text-[#2A9259]"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                </TableHead>
                <TableHead className="text-white font-medium">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-transparent"
                    onClick={() => handleSort("email")}
                  >
                    <Mail className="h-4 w-4 mr-1 text-gray-400" />
                    Email
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${
                        sortField === "email"
                          ? "text-[#2A9259]"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                </TableHead>
                <TableHead className="text-white font-medium">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-transparent"
                    onClick={() => handleSort("tipsPurchased")}
                  >
                    <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                    Tips Compradas
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${
                        sortField === "tipsPurchased"
                          ? "text-[#2A9259]"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                </TableHead>
                <TableHead className="text-white font-medium">
                  <Button
                    variant="ghost"
                    className="text-white hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-transparent"
                    onClick={() => handleSort("created_at")}
                  >
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    Criação da Conta
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${
                        sortField === "created_at"
                          ? "text-[#2A9259]"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                </TableHead>
                <TableHead className="text-white font-medium text-right">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length === 0 ? (
                <TableRow className="border-gray-800">
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-400"
                  >
                    {searchQuery
                      ? "Nenhum usuário encontrado com os critérios de busca."
                      : "Nenhum usuário cadastrado."}
                  </TableCell>
                </TableRow>
              ) : (
                sortedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-gray-800 hover:bg-gray-800/50"
                  >
                    <TableCell className="text-white font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="bg-gray-800/50 text-white border-gray-700"
                        >
                          {user.tipsPurchased}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        {formatDate(user.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-[#2A9259] hover:bg-[#2A9259]/80 text-white"
                        onClick={() => fetchUserTips(user.id, user.name)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Ver Tips</span>
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
              <User className="h-5 w-5 text-[#2A9259]" />
              <span>Tips de {selectedUserName}</span>
              <Badge className="ml-2 bg-gray-800 text-white">
                {numberOfTips} tips
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {isLoadingTips ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#2A9259]" />
            </div>
          ) : selectedUserTips.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Este usuário não possui tips.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollable-content">
              {selectedUserTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-gray-700 transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h3 className="font-medium text-white">{tip.game}</h3>
                      <p className="text-sm text-[#2A9259] font-medium">
                        {tip.description}
                      </p>
                    </div>
                    {getStatusBadge(tip.status)}
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-3 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <span>{formatDate(tip.gameDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ArrowUpDown className="w-3 h-3 text-gray-500" />
                      <span>Odd: {tip.odd.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="ghost"
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
