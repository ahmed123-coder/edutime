"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    documents: null as File | null,
    role: "OWNER",
    verified: true,
    password: "",
  });

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        router.back();
      } else {
        console.error("Failed to update user:", await response.text());
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold tracking-tight">
            Modifier le profil propriétaire
          </h1>
          <p className="text-muted-foreground">
            Gérer les informations du portfolio du propriétaire
          </p>
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
                <AvatarImage src={formData.avatar || "/placeholder-avatar.jpg"} />
                <AvatarFallback className="text-lg">AB</AvatarFallback>
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
            <CardTitle>Informations utilisateur</CardTitle>
            <CardDescription>Détails de base du propriétaire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange("name", e.target.value)
                }
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
