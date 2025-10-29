"use client";

import { useState, useEffect } from "react";
import { DollarSign, CreditCard, Receipt, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BillingData {
  summary: {
    totalRevenue: number;
    totalCommissionPaid: number;
    totalSubscriptionCosts: number;
    netRevenue: number;
  };
  bookings: any[];
  payments: any[];
  subscriptionPayments: any[];
}

export default function OwnerBillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/owner/billing');
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
        <h1 className="text-3xl font-bold tracking-tight">Facturation</h1>
        <p className="text-muted-foreground">Gérer vos revenus et paiements</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Revenus des réservations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Payée</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalCommissionPaid.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Commission plateforme</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonnements</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.totalSubscriptionCosts.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Coûts d'abonnement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Net</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{billingData.summary.netRevenue.toFixed(2)}€</div>
            <p className="text-xs text-muted-foreground">Après déductions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Réservations Récentes</CardTitle>
          <CardDescription>Vos dernières réservations et paiements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.bookings.slice(0, 10).map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{booking.room.name}</p>
                  <p className="text-sm text-muted-foreground">{booking.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{Number(booking.totalAmount).toFixed(2)}€</p>
                  <Badge variant={booking.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Paiements d'Abonnement</CardTitle>
          <CardDescription>Historique de vos paiements d'abonnement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData.subscriptionPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{payment.subscription.package.name}</p>
                  <p className="text-sm text-muted-foreground">{payment.subscription.organization.name}</p>
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