import Image from "next/image";
import {
  Calendar,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Tip {
  id: string;
  description: string;
  game: string;
  odd: number;
  imageTip: string;
  imageTipBlur: string;
  gameDate: string;
  status: string;
}

interface TipCardProps {
  tip: Tip;
}

export default function TipCard({ tip }: TipCardProps) {
  // Formatar a data para exibição
  const formattedDate = new Date(tip.gameDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Determinar as cores e ícones com base no status
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "green":
        return {
          borderColor: "border-[#2A9259]",
          bgColor: "bg-[#2A9259]/10",
          textColor: "text-[#2A9259]",
          icon: <CheckCircle className="w-5 h-5 text-[#2A9259]" />,
          label: "GREEN",
          badgeColor: "bg-[#2A9259]/20 border-[#2A9259]/30",
        };
      case "red":
        return {
          borderColor: "border-red-500",
          bgColor: "bg-red-500/10",
          textColor: "text-red-500",
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          label: "RED",
          badgeColor: "bg-red-500/20 border-red-500/30",
        };
      default:
        return {
          borderColor: "border-yellow-500",
          bgColor: "bg-yellow-500/10",
          textColor: "text-yellow-500",
          icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
          label: "PENDENTE",
          badgeColor: "bg-yellow-500/20 border-yellow-500/30",
        };
    }
  };

  const statusConfig = getStatusConfig(tip.status);

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg bg-[#121A25] ${statusConfig.borderColor} border transition-all duration-300 hover:shadow-xl mt-5`}
    >
      {/* Cabeçalho com status */}
      <div
        className={`px-4 py-2 flex justify-between items-center ${statusConfig.bgColor}`}
      >
        <div className="flex items-center gap-2">
          {statusConfig.icon}
          <span className={`font-bold ${statusConfig.textColor}`}>
            {statusConfig.label}
          </span>
        </div>
        <div
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.badgeColor} ${statusConfig.textColor} border`}
        >
          Odd: {tip.odd.toFixed(2)}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="p-4">
        {/* Descrição e jogo */}
        <h3 className="font-bold text-white text-lg mb-2">{tip.description}</h3>
        <div className="flex items-center gap-2 text-gray-400 mb-3">
          <Target className="w-4 h-4" />
          <span className="text-sm">{tip.game}</span>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Odd: {tip.odd.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
