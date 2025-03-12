"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

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
        odd: parseFloat(formData.odd),
        price: parseFloat(formData.price),
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="game" className="text-white">
          Jogo
        </Label>
        <Input
          id="game"
          value={formData.game}
          onChange={(e) => setFormData({ ...formData, game: e.target.value })}
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Descrição
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="odd" className="text-white">
            Odd
          </Label>
          <Input
            id="odd"
            type="number"
            step="0.01"
            value={formData.odd}
            onChange={(e) => setFormData({ ...formData, odd: e.target.value })}
            className="bg-gray-800 border-gray-700"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-white">
            Preço
          </Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="bg-gray-800 border-gray-700"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gameDate" className="text-white">
          Data do Jogo
        </Label>
        <Input
          id="gameDate"
          type="datetime-local"
          value={formData.gameDate}
          onChange={(e) =>
            setFormData({ ...formData, gameDate: e.target.value })
          }
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageTip" className="text-white">
          URL da Imagem Principal
        </Label>
        <Input
          id="imageTip"
          type="url"
          value={formData.imageTip}
          onChange={(e) =>
            setFormData({ ...formData, imageTip: e.target.value })
          }
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageTipBlur" className="text-white">
          URL da Imagem Borrada
        </Label>
        <Input
          id="imageTipBlur"
          type="url"
          value={formData.imageTipBlur}
          onChange={(e) =>
            setFormData({ ...formData, imageTipBlur: e.target.value })
          }
          className="bg-gray-800 border-gray-700"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="giveAccessToLastBuyers"
            checked={formData.giveAccessToLastBuyers}
            onChange={(e) =>
              setFormData({
                ...formData,
                giveAccessToLastBuyers: e.target.checked,
              })
            }
            className="rounded border-gray-700 bg-gray-800"
          />
          <Label
            htmlFor="giveAccessToLastBuyers"
            className="text-white cursor-pointer"
          >
            Dar acesso gratuito aos últimos compradores que tiveram RED
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#2A9259] hover:bg-[#2A9259]/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando...
          </>
        ) : (
          "Criar Tip"
        )}
      </Button>
    </form>
  );
}
