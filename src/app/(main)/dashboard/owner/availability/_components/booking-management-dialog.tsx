import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
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
   organizationId: string;
   roomId: string;
   user: {
     name: string;
     email: string;
   };
   conflictGroup?: ConflictGroup[];
 }

interface BookingManagementDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdate: () => void;
  formatCurrency: (amount: number) => string;
}

interface ConflictGroup {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  user: { name: string; email: string };
  notes?: string;
  conflictGroup?: ConflictGroup[];
}

const bookingStatuses = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'CONFIRMED', label: 'Confirmé' },
  { value: 'CANCELLED', label: 'Annulé' },
  { value: 'COMPLETED', label: 'Terminé' },
  { value: 'NO_SHOW', label: 'Non présenté' },
];

const getStatusLabel = (status: string) => {
  const statusObj = bookingStatuses.find(s => s.value === status);
  return statusObj ? statusObj.label : status;
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'default';
    case 'NO_SHOW':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'secondary';
  }
};

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
  const isConflictMode = booking && booking.conflictGroup && booking.conflictGroup.length > 1;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [originalStartHour, setOriginalStartHour] = useState("");
  const [originalStartMinute, setOriginalStartMinute] = useState("");
  const [originalEndHour, setOriginalEndHour] = useState("");
  const [originalEndMinute, setOriginalEndMinute] = useState("");
  const [organizationHours, setOrganizationHours] = useState<any>(null);
  const [validationError, setValidationError] = useState<string>("");

  // Mapping from French day names to English keys
  const frenchToEnglishDayMapping: { [key: string]: string } = {
    'lundi': 'monday',
    'mardi': 'tuesday',
    'mercredi': 'wednesday',
    'jeudi': 'thursday',
    'vendredi': 'friday',
    'samedi': 'saturday',
    'dimanche': 'sunday'
  };

  // Initialize status and times when booking changes
  useEffect(() => {
    if (booking) {
      setStatusUpdate(booking.status);
      const bookingStartTime = new Date(booking.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
      const bookingEndTime = new Date(booking.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
      const [startH, startM] = bookingStartTime.split(':');
      const [endH, endM] = bookingEndTime.split(':');
      setOriginalStartHour(startH);
      setOriginalStartMinute(startM);
      setStartHour(startH);
      setStartMinute(startM);
      setOriginalEndHour(endH);
      setOriginalEndMinute(endM);
      setEndHour(endH);
      setEndMinute(endM);
      setValidationError("");
    }
  }, [booking]);

  // Fetch organization hours when booking changes
  useEffect(() => {
    const fetchOrganizationHours = async () => {
      if (booking?.organizationId) {
        try {
          const response = await fetch(`/api/organizations/${booking.organizationId}`);
          if (response.ok) {
            const data = await response.json();
            setOrganizationHours(data.organization.hours);
          }
        } catch (error) {
          console.error("Error fetching organization hours:", error);
        }
      }
    };

    fetchOrganizationHours();
  }, [booking]);

  // Validate time against organization hours
  const validateTimeAgainstOrganizationHours = () => {
    if (!booking || !organizationHours) return true; // Allow if no hours data

    const bookingDate = new Date(booking.date);
    const frenchDayName = bookingDate.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
    const dayHours = organizationHours[englishDayKey];

    if (!dayHours || dayHours.closed) {
      setValidationError("Le centre est fermé ce jour-là.");
      return false;
    }

    const startMinutes = parseInt(startHour) * 60 + parseInt(startMinute);
    const endMinutes = parseInt(endHour) * 60 + parseInt(endMinute);
    const openMinutes = parseInt(dayHours.open.split(':')[0]) * 60 + parseInt(dayHours.open.split(':')[1]);
    const closeMinutes = parseInt(dayHours.close.split(':')[0]) * 60 + parseInt(dayHours.close.split(':')[1]);

    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      setValidationError(`Impossible de réserver : les horaires doivent être entre ${dayHours.open} et ${dayHours.close}.`);
      return false;
    }

    setValidationError("");
    return true;
  };

  // Validate time changes
  useEffect(() => {
    if (startHour && startMinute && endHour && endMinute) {
      validateTimeAgainstOrganizationHours();
    }
  }, [startHour, startMinute, endHour, endMinute, organizationHours, booking]);

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
        <DialogContent className={isConflictMode ? "sm:max-w-[700px]" : "sm:max-w-[500px]"}>
          <DialogHeader>
            <DialogTitle>
              {isConflictMode ? '⚠️ Résoudre les conflits de réservation' : 'Détails de la réservation'}
            </DialogTitle>
            <DialogDescription>
              {isConflictMode
                ? 'Plusieurs réservations se chevauchent. Choisissez laquelle confirmer et annulez les autres.'
                : 'Informations et gestion de la réservation'
              }
            </DialogDescription>
          </DialogHeader>

          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Conflict Resolution UI */}
            {isConflictMode && booking.conflictGroup && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-red-800 mb-2">
                    Conflits détectés pour {format(new Date(booking.date), 'EEEE dd MMMM yyyy', { locale: fr })}
                  </h3>
                  <p className="text-sm text-red-700">
                    Les réservations suivantes se chevauchent dans le temps. Choisissez celle à confirmer :
                  </p>
                </div>

                <div className="space-y-3">
                  {booking.conflictGroup.map((conflictBooking, index) => (
                    <div
                      key={conflictBooking.id}
                      className={`border rounded-lg p-4 ${
                        conflictBooking.id === booking.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{conflictBooking.user.name}</span>
                            <Badge
                              variant={getStatusVariant(conflictBooking.status)}
                              className={conflictBooking.status === 'COMPLETED' ? 'bg-green-500 hover:bg-green-600' : conflictBooking.status === 'NO_SHOW' ? 'bg-gray-500 hover:bg-gray-600' : conflictBooking.status === 'CANCELLED' ? 'bg-red-500 hover:bg-red-600' : ''}
                            >
                              {getStatusLabel(conflictBooking.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(conflictBooking.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {new Date(conflictBooking.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(conflictBooking.totalAmount)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={conflictBooking.id === booking.id ? "default" : "outline"}
                            onClick={() => {
                              // Set this booking as the confirmed one
                              setStatusUpdate('CONFIRMED');
                            }}
                            disabled={conflictBooking.id === booking.id}
                          >
                            Confirmer
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={async () => {
                              // Cancel this conflicting booking
                              try {
                                const response = await fetch(`/api/bookings/${conflictBooking.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    status: 'CANCELLED',
                                    cancelReason: 'Annulé en raison de conflit de réservation'
                                  }),
                                });
                                if (response.ok) {
                                  onBookingUpdate();
                                  toast.success(`Réservation de ${conflictBooking.user.name} annulée`);
                                } else {
                                  toast.error("Erreur lors de l'annulation");
                                }
                              } catch (error) {
                                toast.error("Erreur lors de l'annulation");
                              }
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select value={startHour} onValueChange={setStartHour}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="HH" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">:</span>
                    <Select value={startMinute} onValueChange={setStartMinute}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00">00</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="45">45</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Select value={endHour} onValueChange={setEndHour}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="HH" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                            {i.toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">:</span>
                    <Select value={endMinute} onValueChange={setEndMinute}>
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="00">00</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="45">45</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium">Statut</Label>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getStatusVariant(booking.status)}
                    className={booking.status === 'COMPLETED' ? 'bg-green-500 hover:bg-green-600' : booking.status === 'NO_SHOW' ? 'bg-gray-500 hover:bg-gray-600' : booking.status === 'CANCELLED' ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    {getStatusLabel(booking.status)}
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

                    // Validate times before updating
                    if (!validateTimeAgainstOrganizationHours()) {
                      return;
                    }

                    setIsLoading(true);
                    try {
                      // Check for conflicts when changing status to CONFIRMED or when updating times for non-PENDING bookings
                      const isTimeChanged = `${startHour}:${startMinute}` !== `${originalStartHour}:${originalStartMinute}` ||
                                           `${endHour}:${endMinute}` !== `${originalEndHour}:${originalEndMinute}`;

                      if (statusUpdate === 'CONFIRMED' && booking.status !== 'CONFIRMED') {
                        // Always check conflicts when confirming a booking
                        const startTimeDate = new Date(booking.startTime);
                        const endTimeDate = new Date(booking.endTime);

                        const conflictingBooking = await fetch(`/api/bookings?roomId=${booking.roomId}&date=${booking.date}&status=CONFIRMED`)
                          .then(res => res.ok ? res.json() : { bookings: [] })
                          .then(data => data.bookings.find((b: any) => {
                            const bStart = new Date(b.startTime);
                            const bEnd = new Date(b.endTime);
                            return b.id !== booking.id && (
                              (startTimeDate < bEnd && endTimeDate > bStart) ||
                              (startTimeDate >= bStart && startTimeDate < bEnd) ||
                              (endTimeDate > bStart && endTimeDate <= bEnd)
                            );
                          }));

                        if (conflictingBooking) {
                          toast.error("Impossible de confirmer : ce créneau est déjà réservé par une autre réservation confirmée");
                          setIsLoading(false);
                          return;
                        }
                      } else if (isTimeChanged && booking.status !== 'PENDING') {
                        // Check conflicts when updating times for non-PENDING bookings
                        const startTimeStr = `${startHour}:${startMinute}`;
                        const endTimeStr = `${endHour}:${endMinute}`;
                        const newStartDateTime = new Date(`${booking.date}T${startTimeStr}:00Z`);
                        const newEndDateTime = new Date(`${booking.date}T${endTimeStr}:00Z`);

                        const conflictingBooking = await fetch(`/api/bookings?roomId=${booking.roomId}&date=${booking.date}&status=CONFIRMED`)
                          .then(res => res.ok ? res.json() : { bookings: [] })
                          .then(data => data.bookings.find((b: any) => {
                            const bStart = new Date(b.startTime);
                            const bEnd = new Date(b.endTime);
                            return b.id !== booking.id && (
                              (newStartDateTime < bEnd && newEndDateTime > bStart) ||
                              (newStartDateTime >= bStart && newStartDateTime < bEnd) ||
                              (newEndDateTime > bStart && newEndDateTime <= bEnd)
                            );
                          }));

                        if (conflictingBooking) {
                          toast.error("Impossible de modifier l'horaire : ce créneau est déjà réservé par une autre réservation confirmée");
                          setIsLoading(false);
                          return;
                        }
                      }

                      const updateData: any = { status: statusUpdate };
                      if (statusUpdate === 'CANCELLED') {
                        updateData.cancelReason = cancelReason || 'Annulé par le propriétaire';
                      }

                      // In conflict mode, also cancel other conflicting bookings
                      if (isConflictMode && booking.conflictGroup) {
                        const otherBookings = booking.conflictGroup.filter(b => b.id !== booking.id);
                        for (const otherBooking of otherBookings) {
                          try {
                            await fetch(`/api/bookings/${otherBooking.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                status: 'CANCELLED',
                                cancelReason: 'Annulé automatiquement en raison de conflit résolu'
                              }),
                            });
                          } catch (error) {
                            console.error(`Failed to cancel conflicting booking ${otherBooking.id}:`, error);
                          }
                        }
                      }

                      // Include time updates if changed
                      const startTimeStr = `${startHour}:${startMinute}`;
                      const endTimeStr = `${endHour}:${endMinute}`;
                      const originalStartTimeStr = `${originalStartHour}:${originalStartMinute}`;
                      const originalEndTimeStr = `${originalEndHour}:${originalEndMinute}`;
                      if (startTimeStr !== originalStartTimeStr) {
                        updateData.startTime = startTimeStr;
                      }
                      if (endTimeStr !== originalEndTimeStr) {
                        updateData.endTime = endTimeStr;
                      }
                      const response = await fetch(`/api/bookings/${booking.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updateData),
                      });
                      if (response.ok) {
                        onBookingUpdate();
                        toast.success(isConflictMode ? "Conflit résolu avec succès!" : "Réservation mise à jour avec succès!");
                        setOriginalStartHour(startHour);
                        setOriginalStartMinute(startMinute);
                        setOriginalEndHour(endHour);
                        setOriginalEndMinute(endMinute);
                        // Don't auto-close for cancelled bookings - let the useEffect handle it
                        if (statusUpdate !== 'CANCELLED') {
                          onClose();
                        }
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
                  disabled={isLoading || validationError !== "" || (statusUpdate === booking.status && `${startHour}:${startMinute}` === `${originalStartHour}:${originalStartMinute}` && `${endHour}:${endMinute}` === `${originalEndHour}:${originalEndMinute}`)}
                >
                {isLoading ? "Mise à jour..." : isConflictMode ? "Résoudre le conflit" : "Mettre à jour"}
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

  // Handle cancelled booking disappearance after 3 seconds
  useEffect(() => {
    if (booking?.status === 'CANCELLED') {
      const timer = setTimeout(() => {
        onBookingUpdate(); // Refresh the scheduler to remove cancelled booking
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [booking?.status, onBookingUpdate, onClose]);
}
