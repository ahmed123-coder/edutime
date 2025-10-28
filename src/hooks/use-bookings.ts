import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface Booking {
  id: string;
  organizationId: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  commission: number;
  status: string;
  paymentMethod?: string;
  paymentStatus: string;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  room: {
    id: string;
    name: string;
    capacity: number;
    hourlyRate: number;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
}

interface UseBookingsOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useBookings({ onSuccess, onError }: UseBookingsOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);

  const createBooking = useCallback(async (bookingData: {
    organizationId: string;
    roomId: string;
    date: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess?.();
        toast.success("Créneau réservé avec succès!");
        return { success: true, booking: data.booking };
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Erreur lors de la réservation";
        onError?.(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Erreur lors de la réservation";
      onError?.(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const cancelBooking = useCallback(async (bookingId: string, cancelReason?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'CANCELLED',
          cancelReason: cancelReason || 'Annulé par l\'utilisateur',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess?.();
        toast.success("Réservation annulée avec succès!");
        return { success: true, booking: data.booking };
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Erreur lors de l'annulation";
        onError?.(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Erreur lors de l'annulation";
      onError?.(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const updateBookingStatus = useCallback(async (bookingId: string, status: string, cancelReason?: string) => {
    setIsLoading(true);
    try {
      const updateData: any = { status };
      if (cancelReason) updateData.cancelReason = cancelReason;

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess?.();
        toast.success("Statut de réservation mis à jour avec succès!");
        return { success: true, booking: data.booking };
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Erreur lors de la mise à jour";
        onError?.(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Erreur lors de la mise à jour";
      onError?.(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const deleteBooking = useCallback(async (bookingId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSuccess?.();
        toast.success("Réservation supprimée avec succès!");
        return { success: true };
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Erreur lors de la suppression";
        onError?.(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      const errorMessage = "Erreur lors de la suppression";
      onError?.(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  const fetchBookings = useCallback(async (roomIds: string[]) => {
    if (roomIds.length === 0) return { success: true, bookings: [] };

    try {
      const params = new URLSearchParams({
        roomIds: roomIds.join(','),
        status: "PENDING,CONFIRMED,COMPLETED,NO_SHOW",
      });

      const response = await fetch(`/api/bookings?${params}`);

      if (response.ok) {
        const data = await response.json();

        // Normalize booking times for UI rendering
        const normalizedBookings = data.bookings.map((booking: any) => {
          const start = new Date(booking.startTime);
          const end = new Date(booking.endTime);
          const startHour = start.getUTCHours() + start.getUTCMinutes() / 60;
          const endHour = end.getUTCHours() + end.getUTCMinutes() / 60;

          return { ...booking, startHour, endHour };
        });

        return { success: true, bookings: normalizedBookings };
      } else {
        const error = await response.json();
        const errorMessage = error.error || "Erreur lors du chargement des réservations";
        onError?.(errorMessage);
        return { success: false, error: errorMessage, bookings: [] };
      }
    } catch (error) {
      const errorMessage = "Erreur lors du chargement des réservations";
      onError?.(errorMessage);
      return { success: false, error: errorMessage, bookings: [] };
    }
  }, [onError]);

  return {
    isLoading,
    createBooking,
    cancelBooking,
    deleteBooking,
    fetchBookings,
    updateBookingStatus,
  };
}