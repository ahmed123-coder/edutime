import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  notes?: string;
  user: {
    name: string;
    email: string;
  };
}

interface BookingManagementDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdate: () => void;
  formatCurrency: (amount: number) => string;
}

const bookingStatuses = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'CONFIRMED', label: 'Confirmé' },
  { value: 'CANCELLED', label: 'Annulé' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'NO_SHOW', label: 'Non présenté' },
];

const DeleteBookingDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) => (
  <AlertDialog open={isOpen} onOpenChange={onClose}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
        <AlertDialogDescription>
          Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose} disabled={isLoading}>
          Annuler
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isLoading ? "Suppression..." : "Supprimer"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export function BookingManagementDialog({
  booking,
  isOpen,
  onClose,
  onBookingUpdate,
  formatCurrency,
}: BookingManagementDialogProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  // Initialize status when booking changes
  useEffect(() => {
    if (booking) {
      setStatusUpdate(booking.status);
    }
  }, [booking]);

  const handleDeleteBooking = async () => {
    if (!booking) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onBookingUpdate();
        toast.success("Réservation supprimée avec succès!");
        onClose();
        setShowDeleteDialog(false);
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  if (!booking) return null;

  const canDelete = true;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
            <DialogDescription>
              Informations et gestion de la réservation
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Date</Label>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(booking.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">Créneau horaire</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(booking.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} - {new Date(booking.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">Statut</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                  <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {statusUpdate === 'CANCELLED' && (
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Raison d'annulation</Label>
                  <Textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Raison de l'annulation..."
                    className="min-h-[60px]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-sm font-medium">Montant</Label>
                <p className="text-sm font-medium text-green-600">
                  {formatCurrency(booking.totalAmount)}
                </p>
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Réservé par</Label>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">{booking.user.name}</p>
                <p>{booking.user.email}</p>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="space-y-1">
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                size="sm"
                onClick={async () => {
                  if (!booking) return;
                  setIsLoading(true);
                  try {
                    const updateData: any = { status: statusUpdate };
                    if (statusUpdate === 'CANCELLED') {
                      updateData.cancelReason = cancelReason || 'Annulé par le propriétaire';
                    }
                    const response = await fetch(`/api/bookings/${booking.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(updateData),
                    });
                    if (response.ok) {
                      onBookingUpdate();
                      toast.success("Statut mis à jour avec succès!");
                    } else {
                      const error = await response.json();
                      toast.error(error.error || "Erreur lors de la mise à jour");
                    }
                  } catch (error) {
                    toast.error("Erreur lors de la mise à jour");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading || statusUpdate === booking.status}
              >
                {isLoading ? "Mise à jour..." : "Mettre à jour"}
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onClose}>
                  Fermer
                </Button>

                {canDelete && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DeleteBookingDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteBooking}
        isLoading={isLoading}
      />
    </>
  );
}