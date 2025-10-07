"use client";

import { Users, Building2, Calendar, CreditCard, TrendingUp, AlertTriangle, Activity, DollarSign } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord Admin</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme et outils de gestion</p>
        </div>
        <Badge variant="secondary" className="border-red-200 bg-red-50 text-red-700">
          Accès Admin
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-muted-foreground text-xs">+12% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Centres de Formation</CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-muted-foreground text-xs">+3 nouveaux cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réservations</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,924</div>
            <p className="text-muted-foreground text-xs">+18% par rapport au mois dernier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Plateforme</CardTitle>
            <DollarSign className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€45,231</div>
            <p className="text-muted-foreground text-xs">+25% par rapport au mois dernier</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Actions en Attente
            </CardTitle>
            <CardDescription>Éléments nécessitant une attention immédiate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Vérifications de Centres</p>
                <p className="text-muted-foreground text-sm">8 centres en attente d'approbation</p>
              </div>
              <Button size="sm" variant="outline">
                Examiner
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Avis Signalés</p>
                <p className="text-muted-foreground text-sm">3 avis signalés</p>
              </div>
              <Button size="sm" variant="outline">
                Modérer
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Litiges de Paiement</p>
                <p className="text-muted-foreground text-sm">2 litiges en attente</p>
              </div>
              <Button size="sm" variant="outline">
                Résoudre
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              État du Système
            </CardTitle>
            <CardDescription>Performance et statut de la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Temps de Réponse API</p>
                <p className="text-muted-foreground text-sm">Moyenne 120ms</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Bon
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Performance Base de Données</p>
                <p className="text-muted-foreground text-sm">Temps de requête 45ms</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Excellent
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Disponibilité Serveur</p>
                <p className="text-muted-foreground text-sm">99.9% ce mois</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Stable
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente de la Plateforme</CardTitle>
          <CardDescription>Dernières actions utilisateur et événements système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouveau centre de formation enregistré</p>
                <p className="text-muted-foreground text-xs">Formation Excellence - Tunis • Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Grande réservation terminée</p>
                <p className="text-muted-foreground text-xs">Réservation de €450 à TechSpace Sfax • Il y a 4 heures</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Litige de paiement ouvert</p>
                <p className="text-muted-foreground text-xs">Réservation #BK-2024-001234 • Il y a 6 heures</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Nouvelle vérification d'enseignant</p>
                <p className="text-muted-foreground text-xs">Ahmed Ben Ali a soumis ses documents • Il y a 8 heures</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
