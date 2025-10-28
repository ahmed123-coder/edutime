"use client";

import { useState } from "react";

import { Building2, Users, CalendarIcon, Clock, ArrowLeft } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBookings } from "@/hooks/use-bookings";

import { useBookingData } from "../_hooks/useBookingData";
import { useRoomData } from "../_hooks/useRoomData";
import { useTimetableState } from "../_hooks/useTimetableState";
import { getWeekNumber, formatWeekRange } from "../_utils/time-utils";
import { formatCurrency } from "../_utils/ui-utils";

import { BookingManagementDialog } from "./booking-management-dialog";
import { TimetableGrid } from "./timetable-grid";

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

export function RoomsAvailability() {
  // Hook calls
  const timetableState = useTimetableState();

  const bookingData = useBookingData(timetableState.selectedRoom);

  const roomData = useRoomData({
    fetchBookings: (roomIds) => bookingData.fetchBookings(roomIds),
    organizationHours: timetableState.organizationHours,
    setOrganizationHours: timetableState.setOrganizationHours,
  });

  // Local state for UI interactions
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // Initialize booking hook
  const { createBooking: createBookingApi, isLoading: isBookingLoading } = useBookings({
    onSuccess: () => {
      if (timetableState.selectedRoom) {
        bookingData.fetchBookings([timetableState.selectedRoom.id]);
      }
    },
  });

  // Helper functions (from hooks)
  const { getWeekDays, formatWeekRange, navigateWeek } = timetableState;

  // Destructure hook data
  const {
    rooms,
    organizations,
    loading,
    search,
    setSearch,
    organizationFilter,
    setOrganizationFilter,
    page,
    setPage,
    pagination,
  } = roomData;

  const {
    selectedRoom,
    setSelectedRoom,
    currentWeek,
    setCurrentWeek,
    calendarOpen,
    setCalendarOpen,
    currentOrganizationHours,
    getTimetableTimeRange,
    frenchToEnglishDayMapping,
  } = timetableState;

  const {
    bookings,
    bookingConflicts,
    draggedBooking,
    setDraggedBooking,
    dragStartPosition,
    setDragStartPosition,
    fetchBookings,
  } = bookingData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {selectedRoom ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedRoom(null)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux salles
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{selectedRoom.name}</h1>
                <p className="text-muted-foreground">Emploi du temps de la salle</p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Disponibilité des Salles</h1>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      {!selectedRoom && (
        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Filtrer et rechercher les salles disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher des salles par nom..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select
                value={organizationFilter}
                onValueChange={(value) => setOrganizationFilter(value === "all-organizations" ? "" : value)}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrer par organisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-organizations">Toutes les organisations</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedRoom ? (
        <>
          {/* Rooms Table */}
          <Card>
            <CardHeader>
              <CardTitle>Salles ({pagination.total})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Salle</TableHead>
                    <TableHead>Organisation</TableHead>
                    <TableHead>Capacité</TableHead>
                    <TableHead>Prix/heure</TableHead>
                    <TableHead>Réservations</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="border-t border-b py-8 text-center">
                        Chargement des salles...
                      </TableCell>
                    </TableRow>
                  ) : rooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="border-t border-b py-8 text-center">
                        Aucune salle trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="border-t border-b">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              {room.photos?.[0] ? (
                                <AvatarImage src={room.photos[0]} alt={room.name} />
                              ) : (
                                <AvatarFallback>
                                  <Building2 className="h-5 w-5" />
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">{room.name}</div>
                              {room.description && (
                                <div className="text-muted-foreground line-clamp-1 text-sm">{room.description}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="border-t border-b">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={room.organization.logo} alt={room.organization.name} />
                              <AvatarFallback className="text-xs">{room.organization.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{room.organization.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="border-t border-b">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-sm">{room.capacity}</span>
                          </div>
                        </TableCell>
                        <TableCell className="border-t border-b">
                          <span className="font-medium">{formatCurrency(room.hourlyRate)}</span>
                        </TableCell>
                        <TableCell className="border-t border-b">
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{room._count?.bookings}</span>
                          </div>
                        </TableCell>

                        <TableCell className="border-t border-b">
                          <Badge variant={room.active ? "default" : "secondary"}>
                            {room.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="border-t border-b text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRoom(room)}>
                            <Clock className="mr-2 h-4 w-4" />
                            Vérifier Dispo
                          </Button>
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
                    Page {pagination.page} sur {pagination.pages}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.pages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          {/* Organization Filter - Always visible */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-lg">Filtre par organisation</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={organizationFilter}
                onValueChange={(value) => setOrganizationFilter(value === "all-organizations" ? "" : value)}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Sélectionner une organisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-organizations">Toutes les organisations</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Room Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span>Emploi du temps - {formatWeekRange(currentWeek)}</span>
                    <span className="text-muted-foreground text-sm font-normal">
                      (Semaine {getWeekNumber(currentWeek)})
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Disponibilité de la salle {selectedRoom.name} pour la semaine sélectionnée
                  </CardDescription>
                </div>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={currentWeek}
                      onSelect={(date) => {
                        if (date) {
                          setCurrentWeek(date);
                          setCalendarOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Navigation */}
              <div className="mb-4 flex items-center justify-between">
                <Button variant="outline" onClick={() => navigateWeek("prev")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Semaine précédente
                </Button>
                <div className="font-medium">{formatWeekRange(currentWeek)}</div>
                <Button variant="outline" onClick={() => navigateWeek("next")}>
                  Semaine suivante
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>

              {/* Horizontal Room Navigation */}
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">Salles:</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {rooms.map((room) => (
                    <Button
                      key={room.id}
                      variant={selectedRoom.id === room.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRoom(room)}
                      className="flex-shrink-0"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      {room.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Timetable */}
              <TimetableGrid
                rooms={rooms}
                currentWeek={currentWeek}
                selectedRoom={selectedRoom}
                bookings={bookings}
                bookingConflicts={bookingConflicts}
                draggedBooking={draggedBooking}
                currentOrganizationHours={currentOrganizationHours}
                frenchToEnglishDayMapping={frenchToEnglishDayMapping}
                getTimetableTimeRange={getTimetableTimeRange}
                getWeekDays={getWeekDays}
                formatCurrency={formatCurrency}
                setDraggedBooking={setDraggedBooking}
                setDragStartPosition={setDragStartPosition}
                setSelectedBooking={setSelectedBooking}
                setBookingDialogOpen={setBookingDialogOpen}
                setSelectedDay={setSelectedDay}
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                setReservationDialogOpen={setReservationDialogOpen}
                fetchBookings={fetchBookings}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Reservation Dialog */}
      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver un créneau</DialogTitle>
            <DialogDescription>Réservez un créneau horaire pour la salle {selectedRoom?.name}</DialogDescription>
          </DialogHeader>
          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-hour">Heure de début</Label>

                <div className="flex gap-2">
                  <Select
                    value={startTime.split(":")[0]}
                    onValueChange={(value) => setStartTime(`${value}:${startTime.split(":")[1]}`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        if (!selectedDay || !currentOrganizationHours) {
                          return Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ));
                        }
                        const frenchDayName = selectedDay
                          .toLocaleDateString("fr-FR", { weekday: "long" })
                          .toLowerCase();
                        const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
                        const dayHours = currentOrganizationHours[englishDayKey];
                        if (!dayHours || dayHours.closed) return null;
                        const openHour = parseInt(dayHours.open.split(":")[0]);
                        const closeHour = parseInt(dayHours.close.split(":")[0]);
                        return Array.from({ length: closeHour - openHour }, (_, i) => openHour + i).map((hour) => (
                          <SelectItem key={hour} value={hour.toString().padStart(2, "0")}>
                            {hour.toString().padStart(2, "0")}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                  <Select
                    value={startTime.split(":")[1]}
                    onValueChange={(value) => setStartTime(`${startTime.split(":")[0]}:${value}`)}
                  >
                    <SelectTrigger>
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
              <div className="space-y-2">
                <Label htmlFor="end-hour">Heure de fin</Label>

                <div className="flex gap-2">
                  <Select
                    value={endTime.split(":")[0]}
                    onValueChange={(value) => setEndTime(`${value}:${endTime.split(":")[1]}`)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="HH" />
                    </SelectTrigger>
                    <SelectContent>
                      {(() => {
                        if (!selectedDay || !currentOrganizationHours) {
                          return Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString().padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </SelectItem>
                          ));
                        }
                        const frenchDayName = selectedDay
                          .toLocaleDateString("fr-FR", { weekday: "long" })
                          .toLowerCase();
                        const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
                        const dayHours = currentOrganizationHours[englishDayKey];
                        if (!dayHours || dayHours.closed) return null;
                        const openHour = parseInt(dayHours.open.split(":")[0]);
                        const closeHour = parseInt(dayHours.close.split(":")[0]);
                        return Array.from({ length: closeHour - openHour + 1 }, (_, i) => openHour + i).map((hour) => (
                          <SelectItem key={hour} value={hour.toString().padStart(2, "0")}>
                            {hour.toString().padStart(2, "0")}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                  <Select
                    value={endTime.split(":")[1]}
                    onValueChange={(value) => setEndTime(`${endTime.split(":")[0]}:${value}`)}
                  >
                    <SelectTrigger>
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
            {selectedDay && (
              <div className="text-muted-foreground text-sm">
                Jour sélectionné:{" "}
                {selectedDay.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setReservationDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (selectedDay && selectedRoom) {
                  // Validate that end time is after start time
                  const startMinutes = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
                  const endMinutes = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);

                  if (endMinutes <= startMinutes) {
                    setValidationError("L'heure de fin doit être postérieure à l'heure de début.");
                    return;
                  }

                  // Validate booking times against organization hours
                  const frenchDayName = selectedDay.toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
                  const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
                  const dayHours = currentOrganizationHours?.[englishDayKey];

                  if (!dayHours || dayHours.closed) {
                    alert("Impossible de réserver : le centre est fermé ce jour-là.");
                    return;
                  }

                  const openMinutes =
                    parseInt(dayHours.open.split(":")[0]) * 60 + parseInt(dayHours.open.split(":")[1]);
                  const closeMinutes =
                    parseInt(dayHours.close.split(":")[0]) * 60 + parseInt(dayHours.close.split(":")[1]);

                  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
                    setValidationError(
                      `Impossible de réserver : les horaires doivent être entre ${dayHours.open} et ${dayHours.close}.`,
                    );
                    return;
                  }

                  const bookingData = {
                    organizationId: selectedRoom.organizationId,
                    roomId: selectedRoom.id,
                    date: selectedDay.toISOString().split("T")[0],
                    startTime,
                    endTime,
                  };

                  const result = await createBookingApi(bookingData);

                  if (result.success) {
                    setReservationDialogOpen(false);
                    setSelectedDay(null);
                    setStartTime("");
                    setEndTime("");
                    setValidationError("");
                  }
                }
              }}
              disabled={isBookingLoading}
            >
              {isBookingLoading ? "Réservation..." : "Réserver"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Management Dialog */}
      <BookingManagementDialog
        booking={selectedBooking}
        isOpen={bookingDialogOpen}
        onClose={() => {
          setBookingDialogOpen(false);
          setSelectedBooking(null);
        }}
        onBookingUpdate={() => {
          if (selectedRoom) {
            fetchBookings([selectedRoom.id]);
          }
        }}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
