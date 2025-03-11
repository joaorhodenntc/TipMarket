"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface Settings {
  minTipsPerDay: number;
  maxTipsPerDay: number;
  defaultTipPrice: number;
  enableFreeTips: boolean;
  telegramGroupLink: string;
}

export default function SettingsPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    minTipsPerDay: 1,
    maxTipsPerDay: 3,
    defaultTipPrice: 20,
    enableFreeTips: true,
    telegramGroupLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar configurações");
      }
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minTipsPerDay" className="text-white">
              Mínimo de Tips por Dia
            </Label>
            <Input
              id="minTipsPerDay"
              type="number"
              min="1"
              value={settings.minTipsPerDay}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  minTipsPerDay: parseInt(e.target.value),
                })
              }
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTipsPerDay" className="text-white">
              Máximo de Tips por Dia
            </Label>
            <Input
              id="maxTipsPerDay"
              type="number"
              min="1"
              value={settings.maxTipsPerDay}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maxTipsPerDay: parseInt(e.target.value),
                })
              }
              className="bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultTipPrice" className="text-white">
            Preço Padrão das Tips
          </Label>
          <Input
            id="defaultTipPrice"
            type="number"
            min="0"
            value={settings.defaultTipPrice}
            onChange={(e) =>
              setSettings({
                ...settings,
                defaultTipPrice: parseInt(e.target.value),
              })
            }
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegramGroupLink" className="text-white">
            Link do Grupo do Telegram
          </Label>
          <Input
            id="telegramGroupLink"
            type="url"
            value={settings.telegramGroupLink}
            onChange={(e) =>
              setSettings({
                ...settings,
                telegramGroupLink: e.target.value,
              })
            }
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enableFreeTips"
            checked={settings.enableFreeTips}
            onCheckedChange={(checked) =>
              setSettings({
                ...settings,
                enableFreeTips: checked,
              })
            }
          />
          <Label htmlFor="enableFreeTips" className="text-white">
            Habilitar Tips Grátis
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
            Salvando...
          </>
        ) : (
          "Salvar Configurações"
        )}
      </Button>
    </form>
  );
}
