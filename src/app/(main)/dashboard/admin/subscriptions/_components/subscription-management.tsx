"use client";

import { useState, useEffect } from "react";

import { Plus, Package, Users, Calendar, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AssignSubscriptionModal } from "./assign-subscription-modal";
import { CreatePackageModal } from "./create-package-modal";
import { PackageManagement } from "./package-management";
import { SubscriptionList } from "./subscription-list";

interface Stats {
  totalPackages: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  expiringThisMonth: number;
}

export function SubscriptionManagement() {
  const [stats, setStats] = useState<Stats>({
    totalPackages: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    expiringThisMonth: 0,
  });
  const [createPackageOpen, setCreatePackageOpen] = useState(false);
  const [assignSubscriptionOpen, setAssignSubscriptionOpen] = useState(false);

  const fetchStats = async () => {
    try {
      // This would be implemented in a real API endpoint
      // For now, using mock data
      setStats({
        totalPackages: 3,
        activeSubscriptions: 25,
        monthlyRevenue: 15000,
        expiringThisMonth: 5,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Abonnements</h1>
          <p className="text-muted-foreground">Gérer les forfaits d'abonnement et les abonnements d'organisations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreatePackageOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Créer un Forfait
          </Button>
          <Button onClick={() => setAssignSubscriptionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assigner un Abonnement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forfaits</CardTitle>
            <Package className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages}</div>
            <p className="text-muted-foreground text-xs">Plans d'abonnement disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements Actifs</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-muted-foreground text-xs">Abonnements actuellement actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} TND</div>
            <p className="text-muted-foreground text-xs">Total des revenus récurrents mensuels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expire Bientôt</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringThisMonth}</div>
            <p className="text-muted-foreground text-xs">Abonnements expirant ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Forfaits</TabsTrigger>
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <PackageManagement onPackageCreated={fetchStats} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionList onSubscriptionAssigned={fetchStats} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreatePackageModal open={createPackageOpen} onOpenChange={setCreatePackageOpen} onPackageCreated={fetchStats} />

      <AssignSubscriptionModal
        open={assignSubscriptionOpen}
        onOpenChange={setAssignSubscriptionOpen}
        onSubscriptionAssigned={fetchStats}
      />
    </div>
  );
}
