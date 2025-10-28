"use client";

import { useState } from "react";

import { useBookings } from "@/hooks/use-bookings";

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

export function useBookingData(selectedRoom: Room | null) {
  const { fetchBookings: fetchBookingsApi } = useBookings({});

  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingConflicts, setBookingConflicts] = useState<any[][]>([]);
  const [draggedBooking, setDraggedBooking] = useState<any>(null);
  const [dragStartPosition, setDragStartPosition] = useState<{ day: Date; hour: number } | null>(null);

  // Helper function to detect overlapping bookings (conflicts)
  const detectBookingConflicts = (bookings: any[]) => {
    const conflicts: { [key: string]: any[] } = {};

    // Group bookings by room and date
    bookings.forEach(booking => {
      const key = `${booking.roomId}-${booking.date}`;
      if (!conflicts[key]) {
        conflicts[key] = [];
      }
      conflicts[key].push(booking);
    });

    // Find overlaps within each group
    const overlappingGroups: any[][] = [];
    Object.values(conflicts).forEach((roomBookings: any[]) => {
      // Sort by start time
      roomBookings.sort((a, b) => {
        const aStart = new Date(`${a.date}T${a.startTime}`).getTime();
        const bStart = new Date(`${b.date}T${b.startTime}`).getTime();
        return aStart - bStart;
      });

      // Find overlapping bookings
      for (let i = 0; i < roomBookings.length; i++) {
        const current = roomBookings[i];
        const currentStart = new Date(`${current.date}T${current.startTime}`).getTime();
        const currentEnd = new Date(`${current.date}T${current.endTime}`).getTime();

        const overlappingBookings = [current];

        for (let j = i + 1; j < roomBookings.length; j++) {
          const next = roomBookings[j];
          const nextStart = new Date(`${next.date}T${next.startTime}`).getTime();
          const nextEnd = new Date(`${next.date}T${next.endTime}`).getTime();

          // Check for overlap
          if (currentStart < nextEnd && currentEnd > nextStart) {
            overlappingBookings.push(next);
          } else {
            // Since bookings are sorted, no more overlaps possible
            break;
          }
        }

        if (overlappingBookings.length > 1) {
          // Check if this group is already in overlappingGroups
          const exists = overlappingGroups.some(group =>
            group.every(b => overlappingBookings.some(ob => ob.id === b.id)) &&
            overlappingBookings.every(ob => group.some(b => b.id === ob.id))
          );

          if (!exists) {
            overlappingGroups.push(overlappingBookings);
          }
        }
      }
    });

    return overlappingGroups;
  };

  const fetchBookings = async (roomIds: string[]) => {
    console.log("🔍 fetchBookings called with roomIds:", roomIds);
    if (roomIds.length === 0) return;

    const result = await fetchBookingsApi(roomIds);

    if (result.success) {
      setBookings(result.bookings);
      // Detect conflicts after fetching bookings
      const conflicts = detectBookingConflicts(result.bookings);
      setBookingConflicts(conflicts);
      console.log("🔍 Detected booking conflicts:", conflicts);
    } else {
      console.error("❌ Failed to fetch bookings:", result.error);
    }
  };

  return {
    bookings,
    setBookings,
    bookingConflicts,
    setBookingConflicts,
    draggedBooking,
    setDraggedBooking,
    dragStartPosition,
    setDragStartPosition,
    fetchBookings,
    detectBookingConflicts,
  };
}