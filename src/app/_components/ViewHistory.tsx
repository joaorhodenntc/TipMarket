"use client";
import Link from "next/link";
import { History, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ViewHistory() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-4 mb-4">
      <Link
        href="/historico"
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 border border-gray-800 transition-all duration-300 hover:border-[#2A9259]/50 hover:shadow-lg hover:shadow-[#2A9259]/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full ${
                  isHovered ? "bg-[#2A9259]/20" : "bg-gray-800/80"
                } flex items-center justify-center transition-all duration-300`}
              >
                <History
                  className={`w-5 h-5 ${
                    isHovered ? "text-[#2A9259]" : "text-gray-400"
                  } transition-all duration-300`}
                />
              </div>
              <div>
                <h3 className="text-white font-medium">Histórico de Tips</h3>
                <p className="text-gray-400 text-sm">
                  Veja todas as tips anteriores
                </p>
              </div>
            </div>
            <ChevronRight
              className={`w-5 h-5 ${
                isHovered ? "text-[#2A9259]" : "text-gray-500"
              } transition-all duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
