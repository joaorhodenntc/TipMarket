"use client"
import { RiTelegramLine } from "react-icons/ri"
import { Bell } from "lucide-react"
import { useState } from "react"

export default function TelegramGroup() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="max-w-md mx-auto mt-4 mb-8">
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-[#24A1DE]/10 flex items-center justify-center mr-3">
              <RiTelegramLine className="w-7 h-7 text-[#24A1DE]" />
            </div>
            <div className="h-10 border-l border-gray-700 mx-3"></div>
            <div className="flex flex-col">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Grupo oficial</p>
              <h3 className="text-white font-medium">Receba alertas em tempo real</h3>
            </div>
          </div>

          <div className="w-full bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
           

            <a
              href="https://google.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                className={`w-full py-3 px-4 bg-[#24A1DE]/10 hover:bg-[#24A1DE]/20 border border-[#24A1DE]/30 rounded-lg flex items-center justify-center transition-all duration-300 ${isHovered ? "translate-y-0" : "translate-y-0"}`}
              >
                <RiTelegramLine
                  className={`w-5 h-5 text-[#24A1DE] mr-2 transition-all duration-300 ${isHovered ? "scale-110" : "scale-100"}`}
                />
                <span className="text-white font-medium">
                  ENTRAR GRUPO <span className="text-[#24A1DE] font-bold">TELEGRAM</span>
                </span>
              </div>
              {isHovered && (
                <div className="absolute inset-0 bg-[#24A1DE]/5 rounded-lg animate-pulse pointer-events-none"></div>
              )}
            </a>

          </div>
        </div>
      </div>
    </div>
  )
}

