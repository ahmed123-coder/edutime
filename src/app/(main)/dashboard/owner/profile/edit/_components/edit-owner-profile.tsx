"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, User, Mail, Phone, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function EditOwnerProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "Ahmed Ben Ali",
    email: "ahmed.benali@example.com",
    phone: "+216 98 123 456",
    avatar: "",
    speciality: "Formation et développement professionnel",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/owner/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.back();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modifier mon profil</h1>
          <p className="text-muted-foreground">Gérer mes informations personnelles</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Photo de profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="text-lg">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Mes détails personnels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speciality" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Spécialité
              </Label>
              <Input
                id="speciality"
                value={formData.speciality}
                onChange={(e) => handleInputChange("speciality", e.target.value)}
                placeholder="Domaine d'expertise..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}