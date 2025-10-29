"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Receipt, TrendingUp, Building, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AdminBillingData {
  summary: {
    totalPlatformRevenue: number;
    totalCommissionEarned: number;
    totalSubscriptionRevenue: number;
    totalOwnerRevenue: number;
    totalAdminRevenue: number;
  };
  bookings: any[];
  payments: any[];
  subscriptionPayments: any[];
}

export default function AdminBillingPage() {
  const [billingData, setBillingData] = useState<AdminBillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/billing');
      if (!response.ok) throw new Error('Failed to fetch billing data');
      
      const data = await response.json();
      setBillingData(data);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de facturation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune donnée de facturation disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Facturation Plateforme</h1>
        <p className="text-muted-foreground">Vue d'ensemble des revenus de la plateforme</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Plateforme</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalPlatformRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Gagnée</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalCommissionEarned.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Commission réservations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalSubscriptionRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Revenus abonnements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Propriétaires</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalOwnerRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Revenus centres</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Admin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalAdminRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Commission + abonnements</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Platform Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations Plateforme</CardTitle>
          <CardDescription>Dernières réservations sur toute la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.bookings.slice(0, 10).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{booking.organization.name} - {booking.room.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Number(booking.totalAmount).toFixed(2)}€</p>
                  <p className="text-sm text-muted-foreground">Commission: {Number(booking.commission).toFixed(2)}€</p>
                  <Badge variant={booking.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Subscription Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Paiements d'Abonnement</CardTitle>
          <CardDescription>Revenus des abonnements de toutes les organisations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.subscriptionPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{payment.subscription.organization.name}</p>
                  <p className="text-sm text-muted-foreground">{payment.subscription.package.name} - {payment.subscription.package.plan}</p>
                  <p className="text-xs text-muted-foreground">
                    Échéance: {new Date(payment.dueDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Number(payment.amount).toFixed(2)}€</p>
                  <Badge variant={payment.status === 'PAID' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}