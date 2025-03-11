"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, History, Settings } from "lucide-react";
import CreateTip from "../_components/admin/CreateTip";
import TipsList from "../_components/admin/TipsList";
import UsersList from "../_components/admin/UsersList";
import SettingsPanel from "../_components/admin/SettingsPanel";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("tips");

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Painel Administrativo
          </h1>
        </div>

        <Tabs defaultValue="tips" className="space-y-4">
          <TabsList className="bg-gray-900/60 backdrop-blur-sm border border-gray-800">
            <TabsTrigger
              value="tips"
              className="data-[state=active]:bg-[#2A9259]"
            >
              Tips
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-[#2A9259]"
            >
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-[#2A9259]"
            >
              <History className="mr-2 h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[#2A9259]"
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tips">
            <div>
              <Card className="bg-gray-900/60 backdrop-blur-sm border border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Criar Nova Tip</CardTitle>
                </CardHeader>
                <CardContent>
                  <CreateTip />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-gray-900/60 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <UsersList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="bg-gray-900/60 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Histórico de Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <TipsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-900/60 backdrop-blur-sm border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <SettingsPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
