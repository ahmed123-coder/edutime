"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Room {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  capacity: number;
  area?: number;
  hourlyRate: number;
  equipment: string[];
  amenities: string[];
  photos: string[];
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

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UseRoomDataOptions {
  fetchBookings?: (roomIds: string[]) => Promise<void>;
  organizationHours?: any;
  setOrganizationHours?: (hours: any) => void;
}

export function useRoomData(options: UseRoomDataOptions = {}) {
  const { fetchBookings, organizationHours, setOrganizationHours } = options;
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchOrganizations = async () => {
    if (!session?.user?.id) return;

    try {
      const params = new URLSearchParams({
        ownerId: session.user.id,
      });

      const response = await fetch(`/api/organizations?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const data = await response.json();
      setOrganizations(data.organizations.map((org: any) => ({
        id: org.id,
        name: org.name,
        slug: org.slug,
      })));

      // Set organization hours from the first organization if not already set
      if (data.organizations.length > 0 && !organizationHours && setOrganizationHours) {
        setOrganizationHours(data.organizations[0].hours);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchRooms = async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(organizationFilter && { organizationId: organizationFilter }),
      });

      const response = await fetch(`/api/rooms?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data: RoomsResponse = await response.json();
      setRooms(data.rooms);
      setPagination(data.pagination);

      // Fetch organization hours if we have rooms and haven't fetched yet
      if (data.rooms.length > 0 && !organizationHours && setOrganizationHours) {
        const orgResponse = await fetch(`/api/organizations/${data.rooms[0].organizationId}`);
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          setOrganizationHours(orgData.organization.hours);
        }
      }

      // Fetch existing bookings for these rooms
      if (fetchBookings) {
        await fetchBookings(data.rooms.map(room => room.id));
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [session?.user?.id]);

  useEffect(() => {
    fetchRooms();
  }, [page, search, organizationFilter, session?.user?.id]);

  return {
    rooms,
    setRooms,
    organizations,
    setOrganizations,
    loading,
    setLoading,
    search,
    setSearch,
    organizationFilter,
    setOrganizationFilter,
    page,
    setPage,
    pagination,
    setPagination,
    fetchOrganizations,
    fetchRooms,
  };
}