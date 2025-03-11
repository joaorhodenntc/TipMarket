"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Menu,
  Home,
  FileText,
  LogOut,
  User,
  LogIn,
  UserPlus,
  ChevronDown,
  History,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [user, setUser] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Detecta se é dispositivo móvel
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Detecta scroll para mudar o estilo do header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (session?.user?.name) {
      setUser(session.user.name);
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  // Obtém as iniciais do nome do usuário para o avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-sm shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Menu para dispositivos móveis */}
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="bg-gray-900 border-gray-800 text-white"
              >
                <SheetHeader>
                  <SheetTitle className="text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  {user && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-800/50 rounded-lg">
                      <Avatar className="h-10 w-10 border border-gray-700 bg-gray-800">
                        <AvatarFallback className="bg-[#2A9259] text-white">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-white">{user}</p>
                        <p className="text-xs text-gray-400">Usuário</p>
                      </div>
                    </div>
                  )}

                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Home className="h-4 w-4 text-gray-400" />
                    <span>Início</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Minhas Tips</span>
                  </Link>

                  <Link
                    href="/historico"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <History className="h-4 w-4 text-gray-400" />
                    <span>Histórico Tips</span>
                  </Link>

                  {user ? (
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sair</span>
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        <LogIn className="h-4 w-4 text-gray-400" />
                        <span>Login</span>
                      </Link>

                      <Link
                        href="/register"
                        className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#2A9259] hover:bg-[#1f6940] transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Registro</span>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            /* Menu dropdown para desktop */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-gray-800/50 px-3"
                >
                  <Menu className="h-4 w-4" />
                  <span>Menu</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-800 text-white min-w-[180px]">
                <DropdownMenuLabel className="text-gray-400">
                  Opções
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="focus:bg-gray-800 cursor-pointer">
                  <Link href="/" className="flex items-center gap-2 w-full">
                    <Home className="h-4 w-4 text-gray-400" />
                    <span>Início</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-800 cursor-pointer">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 w-full"
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Minhas Tips</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-800 cursor-pointer">
                  <Link
                    href="/historico"
                    className="flex items-center gap-2 w-full"
                  >
                    <History className="h-4 w-4 text-gray-400" />
                    <span>Histórico Tips</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:bg-gray-800 focus:text-red-400 cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Área do usuário */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-gray-800/50 px-3"
                >
                  <Avatar className="h-7 w-7 border border-gray-700 bg-gray-800">
                    <AvatarFallback className="bg-[#2A9259] text-white text-xs">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {user}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-70 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-gray-900 border-gray-800 text-white"
              >
                <DropdownMenuLabel className="text-gray-400">
                  Minha Conta
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem className="focus:bg-gray-800 cursor-pointer">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 w-full"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-800 cursor-pointer">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 w-full"
                  >
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span>Minhas Tips</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-400 focus:bg-gray-800 focus:text-red-400 cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition-colors text-sm hidden sm:block"
              >
                Login
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-[#2A9259] hover:bg-[#1f6940] text-white border-none"
                >
                  Registro
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
