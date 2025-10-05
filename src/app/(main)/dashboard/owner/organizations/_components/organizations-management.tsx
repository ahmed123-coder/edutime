'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, MoreHorizontal, Edit, Eye, Building2, Users, Calendar, MapPin, Phone, Mail, Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  TRAINING_CENTER: 'bg-blue-100 text-blue-800',
  PARTNER_SERVICE: 'bg-purple-100 text-purple-800',
};

const subscriptionColors = {
  ESSENTIAL: 'bg-gray-100 text-gray-800',
  PRO: 'bg-green-100 text-green-800',
  PREMIUM: 'bg-yellow-100 text-yellow-800',
};

export function OrganizationsManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
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
        limit: '10',
        ...(search && { search }),
        ...(typeFilter && { type: typeFilter }),
      });

      const response = await fetch(`/api/organizations?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }

      const data: OrganizationsResponse = await response.json();
      setOrganizations(data.organizations);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page, search, typeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAddress = (address: any) => {
    if (!address) return '-';
    return `${address.street}, ${address.city}, ${address.state}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Organizations</h1>
          <p className="text-muted-foreground">
            Manage your training centers and organizations
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search your organizations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search organizations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All types</SelectItem>
                <SelectItem value="TRAINING_CENTER">Training Center</SelectItem>
                <SelectItem value="PARTNER_SERVICE">Partner Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-8">
            Loading organizations...
          </div>
        ) : organizations.length === 0 ? (
          <div className="col-span-full text-center py-8">
            No organizations found
          </div>
        ) : (
          organizations.map((org) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={org.logo} alt={org.name} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">@{org.slug}</p>
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
                        Edit Organization
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type and Subscription */}
                <div className="flex gap-2">
                  <Badge className={typeColors[org.type as keyof typeof typeColors]}>
                    {org.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={subscriptionColors[org.subscription as keyof typeof subscriptionColors]}>
                    {org.subscription}
                  </Badge>
                </div>

                {/* Description */}
                {org.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {org.description}
                  </p>
                )}

                {/* Contact Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{formatAddress(org.address)}</span>
                  </div>
                  {org.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{org.phone}</span>
                    </div>
                  )}
                  {org.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{org.email}</span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{org.website}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{org._count.members} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{org._count.rooms} rooms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{org._count.bookings} bookings</span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Badge variant={org.verified ? 'default' : 'secondary'} className="text-xs">
                      {org.verified ? 'Verified' : 'Unverified'}
                    </Badge>
                    <Badge variant={org.active ? 'default' : 'destructive'} className="text-xs">
                      {org.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Created {formatDate(org.createdAt)}
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
