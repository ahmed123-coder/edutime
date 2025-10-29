"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, User, Mail, Phone, GraduationCap, Calendar, Shield, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  speciality: string | null;
  role: string;
  verified: boolean;
  createdAt: string;
  organizations?: any[];
}

interface Stats {
  organizations: number;
  bookings: number;
  revenue: number;
  avgRating: number;
}

interface OwnerPortfolioProps {
  isAdmin?: boolean;
}

export function OwnerPortfolio({ isAdmin = false }: OwnerPortfolioProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        fetch('/api/owner/profile'),
        fetch('/api/owner/stats')
      ]);
      
      if (!profileRes.ok || !statsRes.ok) throw new Error('Failed to fetch data');
      
      const [profileData, statsData] = await Promise.all([
        profileRes.json(),
        statsRes.json()
      ]);
      
      if (profileData.user) setUserData(profileData.user);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
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

  if (error || !userData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{error || 'No owner data available'}</p>
      </div>
    );
  }

  const editPath = isAdmin ? `/dashboard/admin/profile/edit?id=${userData.id}` : "/dashboard/owner/profile/edit";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {isAdmin ? "Portfolio Propriétaire" : "Mon Portfolio"}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Détails du portfolio du propriétaire" : "Gérer vos informations personnelles"}
          </p>
        </div>
        
        <Link href={editPath}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar || ''} />
                <AvatarFallback className="text-lg">
                  {userData.name ? userData.name.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold text-lg">{userData.name || 'Nom non défini'}</h3>
                <p className="text-muted-foreground text-sm">{userData.role}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={userData.verified ? "default" : "secondary"}>
                  <Shield className="h-3 w-3 mr-1" />
                  {userData.verified ? "Vérifié" : "Non vérifié"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
            <CardDescription>Détails de contact et informations personnelles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">{userData.phone || 'Non défini'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Spécialité</p>
                  <p className="text-sm text-muted-foreground">{userData.speciality || 'Non définie'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Membre depuis</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(userData.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.organizations || 0}</div>
            <p className="text-muted-foreground text-xs">Centres gérés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.bookings || 0}</div>
            <p className="text-muted-foreground text-xs">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.revenue ? `${stats.revenue}€` : '0€'}</div>
            <p className="text-muted-foreground text-xs">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgRating ? stats.avgRating.toFixed(1) : '0'}</div>
            <p className="text-muted-foreground text-xs">Sur 5 étoiles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}