"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const createUserSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: z.enum(["ADMIN", "CENTER_OWNER", "TRAINING_MANAGER", "TEACHER", "PARTNER"]),
  speciality: z.string().max(100).optional().or(z.literal("")),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

export function CreateUserModal({ open, onOpenChange, onUserCreated }: CreateUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      password: "",
      role: "TEACHER",
      speciality: "",
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setIsLoading(true);

      // Clean up empty optional fields
      const cleanData = {
        ...data,
        phone: data.phone || undefined,
        speciality: data.speciality || undefined,
      };

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Échec de la création de l'utilisateur");
      }

      toast.success("Utilisateur créé avec succès");
      form.reset();
      onOpenChange(false);
      onUserCreated();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error instanceof Error ? error.message : "Échec de la création de l'utilisateur");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer un Nouvel Utilisateur</DialogTitle>
          <DialogDescription>
            Ajouter un nouvel utilisateur à la plateforme. Il recevra un email pour vérifier son compte.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom Complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrer le nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Entrer l'adresse email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrer le numéro de téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de Passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Entrer le mot de passe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Administrateur</SelectItem>
                        <SelectItem value="CENTER_OWNER">Propriétaire de Centre</SelectItem>
                        <SelectItem value="TRAINING_MANAGER">Gestionnaire de Formation</SelectItem>
                        <SelectItem value="TEACHER">Enseignant</SelectItem>
                        <SelectItem value="PARTNER">Partenaire</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spécialité (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Entrer la spécialité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création..." : "Créer l'Utilisateur"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
