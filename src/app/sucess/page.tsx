"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/");
    }, 5000);
  }, [router]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-white text-[24px]">Pagamento confirmado!</h1>
      <p className="text-gray-400">
        Sua tip foi liberada. Você será redirecionado em instantes...
      </p>
    </div>
  );
}
