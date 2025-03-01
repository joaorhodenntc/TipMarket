"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.full_name) {
      setUser(session.user.full_name);
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex justify-between gap-4 p-4 ">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 text-[#a89c9c] hover:text-white">
          <CiMenuBurger size={20} />
          <span>Menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="ml-3">
          <DropdownMenuLabel>Opções</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/">Início</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/dashboard">Minhas Tips</Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {user ? (
        <span className="text-white">Olá, {user}</span>
      ) : (
        <div className="flex gap-4 text-[#a89c9c]">
          <a href="/login" className="hover:text-white">
            Login
          </a>
          <a href="/register" className="hover:text-white">
            Registro
          </a>
        </div>
      )}
    </div>
  );
}
