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
import { Loader2, Gift, Eye } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  tipsPurchased: number;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-[#2A9259]" />
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-900/60">
            <TableHead className="text-white">Nome</TableHead>
            <TableHead className="text-white">Email</TableHead>
            <TableHead className="text-white">Tips Compradas</TableHead>
            <TableHead className="text-white">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="border-gray-800">
              <TableCell className="text-white">{user.name}</TableCell>
              <TableCell className="text-white">{user.email}</TableCell>
              <TableCell className="text-white">{user.tipsPurchased}</TableCell>
              <TableCell className="text-white">
                <Button size="icon" className="bg-[#2A9259]">
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
