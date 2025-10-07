"use client";

import { useState, useEffect } from "react";

import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Building2, Users, Calendar, Crown, UserPlus } from "lucide-react";
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

import { AssignOwnerModal } from "./assign-owner-modal";
import { CreateOrganizationModal } from "./create-organization-modal";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  type: string;
  subscription: string;
  subscriptionEnd?: string;
  address: any;
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  members: {
    id: string;
    role: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  }[];
  _count: {
    members: number;
    rooms: number;
    bookings: number;
  };
}

interface OrganizationsResponse {
  organizations: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const typeColors = {
  TRAINING_CENTER: "bg-blue-100 text-blue-800",
  PARTNER_SERVICE: "bg-purple-100 text-purple-800",
};

const subscriptionColors = {
  ESSENTIAL: "bg-gray-100 text-gray-800",
  PRO: "bg-green-100 text-green-800",
  PREMIUM: "bg-yellow-100 text-yellow-800",
};

export function OrganizationsManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [assignOwnerModalOpen, setAssignOwnerModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(typeFilter && { type: typeFilter }),
        ...(verifiedFilter && { verified: verifiedFilter }),
        ...(activeFilter && { active: activeFilter }),
      });

      const response = await fetch(`/api/organizations?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const data: OrganizationsResponse = await response.json();
      setOrganizations(data.organizations);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page, search, typeFilter, verifiedFilter, activeFilter]);

  const handleDeleteOrganization = async (organizationId: string) => {
    if (!confirm("Are you sure you want to delete this organization? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/organizations/${organizationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete organization");
      }

      toast.success("Organization deleted successfully");
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error deleting organization:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete organization");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAddress = (address: any) => {
    if (!address) return "-";
    return `${address.city}, ${address.state}`;
  };

  const handleAssignOwner = (organization: Organization) => {
    setSelectedOrganization(organization);
    setAssignOwnerModalOpen(true);
  };

  const handleOwnerAssigned = () => {
    fetchOrganizations(); // Refresh the list to show updated owner information
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Organisations</h1>
          <p className="text-muted-foreground">Gérer les centres de formation et organisations partenaires</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une Organisation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtrer et rechercher des organisations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher des organisations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">Tous les types</SelectItem>
                <SelectItem value="TRAINING_CENTER">Centre de Formation</SelectItem>
                <SelectItem value="PARTNER_SERVICE">Service Partenaire</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par vérification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">Tous les statuts</SelectItem>
                <SelectItem value="true">Vérifiées</SelectItem>
                <SelectItem value="false">Non vérifiées</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">Tous les statuts</SelectItem>
                <SelectItem value="true">Actives</SelectItem>
                <SelectItem value="false">Inactives</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Organisations ({pagination.total})</CardTitle>
          <CardDescription>
            Affichage de {organizations.length} sur {pagination.total} organisations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Owners</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center">
                    Loading organizations...
                  </TableCell>
                </TableRow>
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center">
                    No organizations found
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={org.logo} alt={org.name} />
                          <AvatarFallback>
                            <Building2 className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-muted-foreground text-sm">@{org.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={typeColors[org.type as keyof typeof typeColors]}>
                        {org.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={subscriptionColors[org.subscription as keyof typeof subscriptionColors]}>
                        {org.subscription}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {org.members.length > 0 ? (
                          <div className="flex -space-x-1">
                            {org.members.slice(0, 3).map((member) => (
                              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                                <AvatarImage src={member.user.avatar} alt={member.user.name} />
                                <AvatarFallback className="text-xs">
                                  {member.user.name?.charAt(0)?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {org.members.length > 3 && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                                +{org.members.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No owners</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatAddress(org.address)}</TableCell>
                    <TableCell>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {org._count.members}
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {org._count.rooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {org._count.bookings}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Badge variant={org.verified ? "default" : "secondary"}>
                          {org.verified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant={org.active ? "default" : "destructive"}>
                          {org.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(org.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Organization
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssignOwner(org)}>
                            <Crown className="mr-2 h-4 w-4" />
                            Assign Owner
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteOrganization(org.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Organization
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
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Organization Modal */}
      <CreateOrganizationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onOrganizationCreated={fetchOrganizations}
      />

      {/* Assign Owner Modal */}
      <AssignOwnerModal
        open={assignOwnerModalOpen}
        onOpenChange={setAssignOwnerModalOpen}
        organization={selectedOrganization}
        onOwnerAssigned={handleOwnerAssigned}
      />
    </div>
  );
}
