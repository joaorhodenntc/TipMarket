"use client";
import { useState } from "react";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Loader2,
  Calendar,
  TrendingUp,
  DollarSign,
  FileText,
  ImageIcon,
  LinkIcon,
  Users,
} from "lucide-react";

export default function CreateTip() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    game: "",
    description: "",
    odd: "",
    price: "",
    gameDate: "",
    imageTip: "",
    imageTipBlur: "",
    giveAccessToLastBuyers: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ajustando o horário (subtraindo 3 horas)
      const gameDate = new Date(formData.gameDate);
      gameDate.setHours(gameDate.getHours() - 3);

      const formattedData = {
        ...formData,
        odd: Number.parseFloat(formData.odd),
        price: Number.parseFloat(formData.price),
        gameDate: gameDate.toISOString(),
      };

      console.log(formattedData);

      const response = await fetch("/api/admin/tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao criar tip");
      }

      // Limpar formulário
      setFormData({
        game: "",
        description: "",
        odd: "",
        gameDate: "",
        price: "",
        imageTip: "",
        imageTipBlur: "",
        giveAccessToLastBuyers: false,
      });
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 shadow-lg p-6 mx-auto text-white">
      <div className="mb-6 text-center">
        <h2 className="text-white text-2xl font-bold mb-2">Criar Nova Tip</h2>
        <p className="text-gray-400">
          Preencha os dados abaixo para criar uma nova tip para os usuários
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-[#2A9259]" />
            Informações Básicas
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="game" className="text-white flex items-center">
                <span>Jogo</span>
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="game"
                  value={formData.game}
                  onChange={(e) =>
                    setFormData({ ...formData, game: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 pl-10 focus:border-[#2A9259] focus:ring-[#2A9259]/20"
                  placeholder="Ex: Los Angeles Lakers vs Boston Celtics"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-white flex items-center"
              >
                <span>Descrição</span>
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <div className="relative">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 pl-10 pt-2 min-h-[100px] focus:border-[#2A9259] focus:ring-[#2A9259]/20"
                  placeholder="Ex: Bryan Rush Menos 7.5 Rebotes"
                  required
                />
                <div className="absolute top-2 left-0 flex items-center pl-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-[#2A9259]" />
            Valores e Data
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odd" className="text-white flex items-center">
                <span>Odd</span>
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="odd"
                  type="number"
                  step="0.01"
                  value={formData.odd}
                  onChange={(e) =>
                    setFormData({ ...formData, odd: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 pl-10 focus:border-[#2A9259] focus:ring-[#2A9259]/20"
                  placeholder="Ex: 1.85"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <TrendingUp className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-white flex items-center">
                <span>Preço</span>
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 pl-10 focus:border-[#2A9259] focus:ring-[#2A9259]/20"
                  placeholder="Ex: 20"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="gameDate"
                className="text-white flex items-center"
              >
                <span>Data do Jogo</span>
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="gameDate"
                  type="datetime-local"
                  value={formData.gameDate}
                  onChange={(e) =>
                    setFormData({ ...formData, gameDate: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 focus:border-[#2A9259] focus:ring-[#2A9259]/20 p-2"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <ImageIcon className="w-4 h-4 mr-2 text-[#2A9259]" />
            Imagens
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="imageTip"
                className="text-white flex items-center"
              >
                <span>URL da Imagem Principal</span>
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="imageTip"
                  type="url"
                  value={formData.imageTip}
                  onChange={(e) =>
                    setFormData({ ...formData, imageTip: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 pl-10 focus:border-[#2A9259] focus:ring-[#2A9259]/20"
                  placeholder="https://exemplo.com/imagem.jpg"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                URL da imagem completa que será mostrada após a compra
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="imageTipBlur"
                className="text-white flex items-center"
              >
                <span>URL da Imagem Borrada</span>
                <span className="text-red-400 ml-1">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="imageTipBlur"
                  type="url"
                  value={formData.imageTipBlur}
                  onChange={(e) =>
                    setFormData({ ...formData, imageTipBlur: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 pl-10 focus:border-[#2A9259] focus:ring-[#2A9259]/20"
                  placeholder="https://exemplo.com/imagem-borrada.jpg"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                URL da imagem borrada que será mostrada antes da compra
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <Users className="w-4 h-4 mr-2 text-[#2A9259]" />
            Opções Adicionais
          </h3>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="giveAccessToLastBuyers"
              checked={formData.giveAccessToLastBuyers}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  giveAccessToLastBuyers: checked as boolean,
                })
              }
              className="data-[state=checked]:bg-[#2A9259] data-[state=checked]:border-[#2A9259]"
            />
            <Label
              htmlFor="giveAccessToLastBuyers"
              className="text-white cursor-pointer text-sm"
            >
              Dar acesso gratuito aos últimos compradores que tiveram RED
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#2A9259] hover:bg-[#2A9259]/90 text-white py-6 font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-[#2A9259]/20"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Criando...
            </>
          ) : (
            "Criar Tip"
          )}
        </Button>
      </form>
    </div>
  );
}
