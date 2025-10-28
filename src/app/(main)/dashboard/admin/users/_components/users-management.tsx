"use client";

import { useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils";

import { CreateUserModal } from "./create-user-modal";
import { EditUserModal } from "./edit-user-modal";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  verified: boolean;
  avatar?: string;
  speciality?: string;
  createdAt: string;
  updatedAt: string;
  organizations?: {
    id: string;
    role: string;
    createdAt: string;
    organization: {
      id: string;
      name: string;
      type: string;
      verified: boolean;
      active: boolean;
      subscriptions: {
        endDate: string;
        package: {
          name: string;
          plan: string;
        };
      }[];
    };
  }[];
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const roleColors = {
  ADMIN: "bg-red-100 text-red-800",
  CENTER_OWNER: "bg-blue-100 text-blue-800",
  TRAINING_MANAGER: "bg-purple-100 text-purple-800",
  TEACHER: "bg-green-100 text-green-800",
  PARTNER: "bg-orange-100 text-orange-800",
};

export function UsersManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");
  const [verifiedFilter, setVerifiedFilter] = useState(searchParams.get("verified") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(verifiedFilter && { verified: verifiedFilter }),
      });

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) {
        throw new Error("Échec de la récupération des utilisateurs");
      }

      const data: UsersResponse = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Échec de la récupération des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  // Update state when URL parameters change (for sidebar navigation)
  useEffect(() => {
    const urlRole = searchParams.get("role") || "";
    const urlSearch = searchParams.get("search") || "";
    const urlVerified = searchParams.get("verified") || "";
    const urlPage = parseInt(searchParams.get("page") || "1");

    setRoleFilter(urlRole);
    setSearch(urlSearch);
    setVerifiedFilter(urlVerified);
    setPage(urlPage);
  }, [searchParams]);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, verifiedFilter]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);
    if (roleFilter) params.set("role", roleFilter);
    if (verifiedFilter) params.set("verified", verifiedFilter);

    // Update URL without triggering navigation
    const newUrl = `/dashboard/admin/users${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [page, search, roleFilter, verifiedFilter]);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Échec de la suppression de l'utilisateur");
      }

      toast.success("Utilisateur supprimé avec succès");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error instanceof Error ? error.message : "Échec de la suppression de l'utilisateur");
    }
  };

  const handleEditUser = (userId: string) => {
    setEditUserId(userId);
    setEditModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">Gérer les utilisateurs de la plateforme, les rôles et les permissions</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un Utilisateur
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrer et rechercher des utilisateurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher des utilisateurs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select
              value={roleFilter || "all-roles"}
              onValueChange={(value) => setRoleFilter(value === "all-roles" ? "" : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-roles">Tous les rôles</SelectItem>
                <SelectItem value="ADMIN">Administrateurs</SelectItem>
                <SelectItem value="CENTER_OWNER">Propriétaires de centres</SelectItem>
                <SelectItem value="TRAINING_MANAGER">Gestionnaires de formation</SelectItem>
                <SelectItem value="TEACHER">Enseignants</SelectItem>
                <SelectItem value="PARTNER">Partenaires</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={verifiedFilter || "all-statuses"}
              onValueChange={(value) => setVerifiedFilter(value === "all-statuses" ? "" : value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">Tous les statuts</SelectItem>
                <SelectItem value="true">Vérifiés</SelectItem>
                <SelectItem value="false">Non vérifiés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Utilisateurs ({pagination.total})</CardTitle>
              <CardDescription>
                Affichage de {users.length} sur {pagination.total} utilisateurs
                {(roleFilter || search || verifiedFilter) && (
                  <span className="ml-2 text-xs">
                    • Filtré : {roleFilter && `Rôle : ${roleFilter.replace("_", " ")}`}
                    {search && ` • Recherche : ${search}`}
                    {verifiedFilter && ` • Statut : ${verifiedFilter === "true" ? "Vérifié" : "Non vérifié"}`}
                  </span>
                )}
              </CardDescription>
            </div>
            {(roleFilter || search || verifiedFilter) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("");
                  setVerifiedFilter("");
                  setPage(1);
                }}
              >
                Effacer les filtres
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Centres assignés</TableHead>
                <TableHead>Abonnement</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Créé</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    Chargement des utilisateurs...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-muted-foreground text-sm">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                        {user.role.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.verified ? "default" : "secondary"}>
                        {user.verified ? "Vérifié" : "Non vérifié"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.organizations && user.organizations.length > 0 ? (
                        <div className="space-y-1">
                          {user.organizations.map((membership) => (
                            <div key={membership.id} className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={membership.role === "OWNER" ? "border-yellow-500 text-yellow-700" : ""}
                              >
                                {membership.organization.name}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {membership.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Aucune affectation</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.organizations?.[0]?.organization?.subscriptions?.[0] ? (
                        <div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {user.organizations[0].organization.subscriptions[0].package.plan}
                          </Badge>
                          <div className="text-muted-foreground mt-1 text-xs">
                            Jusqu'au {formatDate(user.organizations[0].organization.subscriptions[0].endDate)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{user.speciality || "-"}</TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier l'utilisateur
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer l'utilisateur
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Page {pagination.page} sur {pagination.pages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      <CreateUserModal open={createModalOpen} onOpenChange={setCreateModalOpen} onUserCreated={fetchUsers} />

      {/* Edit User Modal */}
      <EditUserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        userId={editUserId}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
}
