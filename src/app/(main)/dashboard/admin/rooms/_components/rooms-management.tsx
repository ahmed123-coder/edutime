"use client";

import { useState, useEffect } from "react";

import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Building2, Users, DollarSign, MapPin } from "lucide-react";
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

interface Room {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  capacity: number;
  area?: number;
  hourlyRate: number;
  equipment?: string[];
  amenities?: string[];
  photos?: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  _count: {
    bookings: number;
  };
}

interface RoomsResponse {
  rooms: Room[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(organizationFilter && { organizationId: organizationFilter }),
        ...(activeFilter && { active: activeFilter }),
      });

      const response = await fetch(`/api/rooms?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data: RoomsResponse = await response.json();
      setRooms(data.rooms);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, search, organizationFilter, activeFilter]);

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete room");
      }

      toast.success("Room deleted successfully");
      fetchRooms(); // Refresh the list
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete room");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Salles</h1>
          <p className="text-muted-foreground">Gérer les salles de formation et espaces dans toutes les organisations</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-organizations">All organizations</SelectItem>
                {/* TODO: Add organization options dynamically */}
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All statuses</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rooms ({pagination.total})</CardTitle>
          <CardDescription>
            Showing {rooms.length} of {pagination.total} rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center">
                    Loading rooms...
                  </TableCell>
                </TableRow>
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center">
                    No rooms found
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{room.name}</div>
                          {room.description && (
                            <div className="text-muted-foreground line-clamp-1 text-sm">{room.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={room.organization.logo} alt={room.organization.name} />
                          <AvatarFallback>
                            <Building2 className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{room.organization.name}</div>
                          <div className="text-muted-foreground text-xs">@{room.organization.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="text-muted-foreground h-4 w-4" />
                        <span>{room.capacity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="text-muted-foreground h-4 w-4" />
                        <span>{formatCurrency(room.hourlyRate)}/hr</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {room.area ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="text-muted-foreground h-4 w-4" />
                          <span>{room.area}m²</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{room._count.bookings} bookings</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={room.active ? "default" : "destructive"}>
                        {room.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(room.createdAt)}</TableCell>
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
                            Edit Room
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRoom(room.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Room
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
    </div>
  );
}
