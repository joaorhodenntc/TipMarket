"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <Image
          src="/logo.png"
          width={120}
          height={120}
          alt="Logo"
          className="mx-auto mb-6"
          priority
        />
        <h1 className="text-white text-4xl font-bold mb-4">Ops!</h1>
        <p className="text-gray-400 text-lg mb-8">
          A página que você está procurando não existe.
        </p>
        <p className="text-gray-500 mb-8">
          Você será redirecionado para a página inicial em alguns segundos...
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-white text-black hover:bg-gray-200"
        >
          <Home className="w-4 h-4 mr-2" />
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  );
}
