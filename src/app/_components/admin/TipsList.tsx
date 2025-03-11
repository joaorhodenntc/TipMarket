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
import { Loader2, CheckCircle, XCircle, Clock, Users } from "lucide-react";
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
            <TableRow className="bg-gray-900/60">
              <TableHead className="text-white">Jogo</TableHead>
              <TableHead className="text-white">Data</TableHead>
              <TableHead className="text-white">Odd</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tips.map((tip) => (
              <TableRow
                key={tip.id}
                className="border-gray-800 cursor-pointer hover:bg-gray-800/50"
                onClick={() => handleViewUsers(tip)}
              >
                <TableCell className="text-white">{tip.game}</TableCell>
                <TableCell className="text-white">
                  {formatDate(tip.gameDate)}
                </TableCell>
                <TableCell className="text-white">{tip.odd}</TableCell>
                <TableCell>
                  <Badge
                    variant="default"
                    className={
                      tip.status === "green"
                        ? "bg-[#2A9259] hover:bg-[#2A9259]/90"
                        : tip.status === "red"
                        ? "bg-red-500 hover:bg-red-500/90"
                        : "bg-gray-500 hover:bg-gray-500/90"
                    }
                  >
                    {tip.status === "green" ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : tip.status === "red" ? (
                      <XCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 mr-1" />
                    )}
                    {tip.status === "green"
                      ? "Green"
                      : tip.status === "red"
                      ? "Red"
                      : "Pendente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className={`${
                        tip.status === "green"
                          ? "bg-[#2A9259] hover:bg-[#2A9259]/90"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => handleStatusChange(tip.id, "green")}
                    >
                      Green
                    </Button>
                    <Button
                      size="sm"
                      className={`${
                        tip.status === "red"
                          ? "bg-red-500 hover:bg-red-500/90"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => handleStatusChange(tip.id, "red")}
                    >
                      Red
                    </Button>
                    <Button
                      size="sm"
                      className={`${
                        tip.status === "pending"
                          ? "bg-gray-500 hover:bg-gray-500/90"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      onClick={() => handleStatusChange(tip.id, "pending")}
                    >
                      Pendente
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-800">
          <DialogHeader>
            <DialogTitle>Compradores da Tip</DialogTitle>
          </DialogHeader>
          {selectedTip?.users && selectedTip.users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">Email</TableHead>
                  <TableHead className="text-white">Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTip.users.map((user) => (
                  <TableRow key={user.id} className="border-gray-800">
                    <TableCell className="text-white">{user.name}</TableCell>
                    <TableCell className="text-white">{user.email}</TableCell>
                    <TableCell className="text-white">{user.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-gray-400">
              Nenhum comprador encontrado
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
