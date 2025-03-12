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
import { Loader2, Gift, Eye, ArrowUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const sortedUsers = [...users].sort((a, b) => {
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
    const statusConfig = {
      green: { className: "bg-[#2A9259]/20 text-[#2A9259]", label: "GREEN" },
      red: { className: "bg-red-500/20 text-red-500", label: "RED" },
      pending: {
        className: "bg-yellow-500/20 text-yellow-500",
        label: "PENDENTE",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-[#2A9259]" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-900/60 hover:bg-gray-800/50 ">
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-gray-800/50"
                  onClick={() => handleSort("name")}
                >
                  Nome
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-gray-800/50"
                  onClick={() => handleSort("email")}
                >
                  Email
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-gray-800/50"
                  onClick={() => handleSort("tipsPurchased")}
                >
                  Tips Compradas
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-white">
                <Button
                  variant="ghost"
                  className="text-white  hover:text-[#2A9259] p-0 h-auto font-medium flex items-center gap-1 hover:bg-gray-800/50"
                  onClick={() => handleSort("created_at")}
                >
                  Criação da Conta
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow
                key={user.id}
                className="border-gray-800 hover:bg-gray-800/50"
              >
                <TableCell className="text-white">{user.name}</TableCell>
                <TableCell className="text-white">{user.email}</TableCell>
                <TableCell className="text-white">
                  {user.tipsPurchased}
                </TableCell>
                <TableCell className="text-white">
                  {formatDate(user.created_at)}
                </TableCell>
                <TableCell className="text-white">
                  <Button
                    size="icon"
                    className="bg-[#2A9259]"
                    onClick={() => fetchUserTips(user.id, user.name)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>
              Tips de {selectedUserName} [{numberOfTips}]
            </DialogTitle>
          </DialogHeader>

          {isLoadingTips ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-[#2A9259]" />
            </div>
          ) : selectedUserTips.length === 0 ? (
            <p className="text-gray-400 text-center py-4">
              Este usuário não possui tips.
            </p>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollable-content">
              {selectedUserTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-gray-800/50 p-4 rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{tip.game}</h3>
                      <p className="text-sm text-[#2A9259]">
                        {tip.description}
                      </p>
                    </div>
                    {getStatusBadge(tip.status)}
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Data: {formatDate(tip.gameDate)}</span>
                    <span>Odd: {tip.odd.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
