"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
  Loader2,
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
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
  speciality: string | null;
  role: string;
  verified: boolean;
}

export function EditOwnerProfile() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = searchParams.get('id');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
    speciality: "",
    role: "CENTER_OWNER",
    verified: false,
  });

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    } else {
      // Fetch first CENTER_OWNER if no ID provided
      fetchOwnerData();
    }
  }, [userId]);

  const fetchUserData = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      setUserData(data.user);
      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        avatar: data.user.avatar || '',
        speciality: data.user.speciality || '',
        role: data.user.role || 'CENTER_OWNER',
        verified: data.user.verified || false,
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données utilisateur",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOwnerData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users?role=CENTER_OWNER&limit=1');
      if (!response.ok) throw new Error('Failed to fetch owner data');
      
      const data = await response.json();
      if (data.users && data.users.length > 0) {
        const user = data.users[0];
        setUserData(user);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          avatar: user.avatar || '',
          speciality: user.speciality || '',
          role: user.role || 'CENTER_OWNER',
          verified: user.verified || false,
        });
      }
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du propriétaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', 'avatar');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData(prev => ({ ...prev, avatar: data.url }));
      
      toast({
        title: "Succès",
        description: "Photo uploadée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de l'upload de la photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Seuls les fichiers image sont autorisés",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La taille du fichier doit être inférieure à 5MB",
          variant: "destructive",
        });
        return;
      }
      
      handlePhotoUpload(file);
    }
  };

  const handleSave = async () => {
    if (!userData) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userData.id,
          name: formData.name,
          phone: formData.phone,
          speciality: formData.speciality,
          avatar: formData.avatar,
          verified: formData.verified,
        }),
      });
      
      if (response.ok) {
        toast({
          title: "Succès",
          description: "Profil mis à jour avec succès",
        });
        router.back();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucune donnée utilisateur disponible</p>
      </div>
    );
  }

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
                <AvatarImage src={formData.avatar || ''} />
                <AvatarFallback className="text-lg">
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {isUploading ? 'Upload...' : 'Changer la photo'}
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
                disabled
                className="bg-muted"
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
        <Button onClick={handleSave} disabled={isLoading || isUploading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isLoading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
