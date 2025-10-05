'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Eye, Building2, Users, DollarSign, MapPin, Calendar, Wifi, Car, Coffee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

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
  const [search, setSearch] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(organizationFilter && { organizationId: organizationFilter }),
        ...(activeFilter && { active: activeFilter }),
      });

      const response = await fetch(`/api/rooms?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }

      const data: RoomsResponse = await response.json();
      setRooms(data.rooms);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, search, organizationFilter, activeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderAmenities = (amenities?: string[]) => {
    if (!amenities || amenities.length === 0) return null;
    
    return (
      <div className="flex gap-1 flex-wrap">
        {amenities.slice(0, 3).map((amenity, index) => {
          const IconComponent = amenityIcons[amenity.toLowerCase()] || Building2;
          return (
            <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
              <IconComponent className="h-3 w-3" />
              <span className="capitalize">{amenity}</span>
            </div>
          );
        })}
        {amenities.length > 3 && (
          <span className="text-xs text-muted-foreground">+{amenities.length - 3} more</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Rooms</h1>
          <p className="text-muted-foreground">
            Manage your training rooms and spaces
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
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

      {/* Rooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-8">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="col-span-full text-center py-8">
            No rooms found
          </div>
        ) : (
          rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{room.organization.name}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Room
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Description */}
                {room.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {room.description}
                  </p>
                )}

                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{room.capacity} people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{formatCurrency(room.hourlyRate)}/hr</span>
                  </div>
                  {room.area && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{room.area}m²</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{room._count.bookings} bookings</span>
                  </div>
                </div>

                {/* Amenities */}
                {renderAmenities(room.amenities)}

                {/* Equipment */}
                {room.equipment && room.equipment.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Equipment: </span>
                    <span className="text-muted-foreground">
                      {room.equipment.slice(0, 2).join(', ')}
                      {room.equipment.length > 2 && ` +${room.equipment.length - 2} more`}
                    </span>
                  </div>
                )}

                {/* Status and Date */}
                <div className="flex justify-between items-center">
                  <Badge variant={room.active ? 'default' : 'destructive'} className="text-xs">
                    {room.active ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Created {formatDate(room.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
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
    </div>
  );
}
