"use client";

import { useState, useEffect } from "react";

import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Building2,
  Users,
  DollarSign,
  MapPin,
  Calendar,
  Wifi,
  Car,
  Coffee,
  Trash2,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ImageGallery } from "@/components/image-gallery";

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

const amenityIcons: { [key: string]: any } = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  projector: Building2,
  whiteboard: Building2,
  ac: Building2,
};

export function RoomsManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
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

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      const response = await fetch(`/api/rooms/${roomToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete room");
      }

      toast.success("Room deleted successfully");
      fetchRooms(); // Refresh the list
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete room");
    }
  };

  const renderAmenities = (amenities?: string[]) => {
    if (!amenities || amenities.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1">
        {amenities.slice(0, 3).map((amenity, index) => {
          const IconComponent = amenityIcons[amenity.toLowerCase()] || Building2;
          return (
            <div key={index} className="text-muted-foreground flex items-center gap-1 text-xs">
              <IconComponent className="h-3 w-3" />
              <span className="capitalize">{amenity}</span>
            </div>
          );
        })}
        {amenities.length > 3 && <span className="text-muted-foreground text-xs">+{amenities.length - 3} more</span>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Rooms</h1>
          <p className="text-muted-foreground">Manage your training rooms and spaces</p>
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
          <CardDescription>Filter and search your rooms</CardDescription>
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

      {/* Rooms List */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-8 text-center">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="py-8 text-center">No rooms found</div>
        ) : (
          rooms.map((room) => (
            <Card key={room.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-muted flex h-12 w-12 items-center justify-center rounded">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{room.name}</CardTitle>
                        <p className="text-muted-foreground">{room.organization.name}</p>
                      </div>
                    </div>
                    {room.description && (
                      <CardDescription className="text-base mt-2">
                        {room.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={room.active ? "default" : "destructive"}>
                      {room.active ? "Active" : "Inactive"}
                    </Badge>
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
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setRoomToDelete(room);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Room
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Room Details */}
                  <div className="space-y-6">
                    {/* Room Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="text-muted-foreground h-5 w-5" />
                          <div className="text-2xl font-bold text-primary">{room.capacity}</div>
                        </div>
                        <div className="text-muted-foreground text-sm">Capacity</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="text-muted-foreground h-5 w-5" />
                          <div className="text-2xl font-bold text-primary">{formatCurrency(room.hourlyRate)}</div>
                        </div>
                        <div className="text-muted-foreground text-sm">Hourly Rate</div>
                      </div>
                      {room.area && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="text-muted-foreground h-5 w-5" />
                            <div className="text-2xl font-bold text-primary">{room.area}</div>
                          </div>
                          <div className="text-muted-foreground text-sm">Area (m²)</div>
                        </div>
                      )}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="text-muted-foreground h-5 w-5" />
                          <div className="text-2xl font-bold text-primary">{room._count.bookings}</div>
                        </div>
                        <div className="text-muted-foreground text-sm">Total Bookings</div>
                      </div>
                    </div>

                    {/* Amenities */}
                    {renderAmenities(room.amenities) && (
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Amenities</h4>
                        {renderAmenities(room.amenities)}
                      </div>
                    )}

                    {/* Equipment */}
                    {room.equipment && room.equipment.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Equipment</h4>
                        <div className="flex flex-wrap gap-2">
                          {room.equipment.map((equipmentId, index) => (
                            <Badge key={index} variant="outline" className="px-3 py-1">
                              {equipmentId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-muted-foreground text-sm">
                        Created {formatDate(room.createdAt)}
                      </span>
                      <div className="text-sm text-muted-foreground">
                        {room.photos?.length || 0} images
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Image Gallery */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Room Images</h4>
                    {room.photos && room.photos.length > 0 ? (
                      <ImageGallery
                        images={room.photos}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <p className="text-muted-foreground">No images available for this room</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Page {pagination.page} of {pagination.pages}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === pagination.pages}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{roomToDelete?.name}"? This action cannot be undone and will permanently remove the room from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoomToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
