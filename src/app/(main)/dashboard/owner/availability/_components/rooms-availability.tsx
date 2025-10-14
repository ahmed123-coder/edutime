"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  Search,
  Building2,
  Users,
  CalendarIcon,
  Clock,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { BookingManagementDialog } from "./booking-management-dialog";
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
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [organizationHours, setOrganizationHours] = useState<any>(null);
  const [currentOrganizationHours, setCurrentOrganizationHours] = useState<any>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookedPeriods, setBookedPeriods] = useState<{ [key: string]: { start: string; end: string }[] }>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // Initialize booking hook
  const { createBooking: createBookingApi, isLoading: isBookingLoading } = useBookings({
    onSuccess: () => {
      if (selectedRoom) {
        fetchBookings([selectedRoom.id]);
      }
    },
  });

  // Get week number in the year
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

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

  // Calculate timetable time range from organization hours
  const getTimetableTimeRange = (hours: any) => {
    if (!hours) return { startHour: 8, endHour: 19 };

    let earliestOpen = 24;
    let latestClose = 0;

    Object.values(hours).forEach((dayHours: any) => {
      if (dayHours && !dayHours.closed && dayHours.open && dayHours.close) {
        const openHour = parseInt(dayHours.open.split(':')[0]);
        const closeHour = parseInt(dayHours.close.split(':')[0]);
        if (openHour < earliestOpen) earliestOpen = openHour;
        if (closeHour > latestClose) latestClose = closeHour;
      }
    });

    // If no valid hours found, use default
    if (earliestOpen === 24 || latestClose === 0) {
      return { startHour: 8, endHour: 21 };
    }

    return { startHour: earliestOpen, endHour: latestClose };
  };

  // Fetch organization hours when room is selected
  useEffect(() => {
    const fetchCurrentOrgHours = async () => {
      if (selectedRoom) {
        try {
          const response = await fetch(`/api/organizations/${selectedRoom.organizationId}`);
          if (response.ok) {
            const data = await response.json();
            setCurrentOrganizationHours(data.organization.hours);
          } else {
            // Fallback to general organization hours if specific fetch fails
            setCurrentOrganizationHours(organizationHours);
          }
        } catch (error) {
          console.error("Error fetching organization hours:", error);
          // Fallback to general organization hours
          setCurrentOrganizationHours(organizationHours);
        }
      }
    };

    fetchCurrentOrgHours();
  }, [selectedRoom]);

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
      if (data.organizations.length > 0 && !organizationHours) {
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
      if (data.rooms.length > 0 && !organizationHours) {
        const orgResponse = await fetch(`/api/organizations/${data.rooms[0].organizationId}`);
        if (orgResponse.ok) {
          const orgData = await orgResponse.json();
          setOrganizationHours(orgData.organization.hours);
        }
      }

      // Fetch existing bookings for these rooms
      await fetchBookings(data.rooms.map(room => room.id));
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

   const { fetchBookings: fetchBookingsApi } = useBookings({});
 
   const fetchBookings = async (roomIds: string[]) => {
     console.log("🔍 fetchBookings called with roomIds:", roomIds);
     if (roomIds.length === 0) return;
 
     const result = await fetchBookingsApi(roomIds);
 
     if (result.success) {
       setBookings(result.bookings);
     } else {
       console.error("❌ Failed to fetch bookings:", result.error);
     }
   };

  useEffect(() => {
    fetchOrganizations();
  }, [session?.user?.id]);

  useEffect(() => {
    fetchRooms();
  }, [page, search, organizationFilter, session?.user?.id]);

  useEffect(() => {
    if (selectedRoom) {
      console.log("🔄 selectedRoom changed, fetching bookings for:", selectedRoom.id);
      fetchBookings([selectedRoom.id]);
    }
  }, [selectedRoom]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
    }).format(amount);
  };

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    if (direction === 'prev') {
      newDate.setDate(currentWeek.getDate() - 7);
    } else {
      newDate.setDate(currentWeek.getDate() + 7);
    }
    setCurrentWeek(newDate);
  };

  const getStatusForHour = (hour: number, mergedBookings: { start: number; end: number }[], dayHours: any, isClosed: boolean) => {
    if (isClosed) {
      return 'Fermé';
    }
    if (dayHours?.open && dayHours?.close) {
      const openTime = dayHours.open.split(':');
      const closeTime = dayHours.close.split(':');
      const openHour = parseInt(openTime[0]);
      const closeHour = parseInt(closeTime[0]);
      if (hour < openHour || hour >= closeHour) {
        return 'Fermé';
      }
    }
    // Check if booked
    for (const b of mergedBookings) {
      if (hour >= b.start && hour < b.end) {
        return 'Réservé';
      }
    }
    return 'Libre';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {selectedRoom ? (
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setSelectedRoom(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
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
              <Select value={organizationFilter} onValueChange={(value) => setOrganizationFilter(value === "all-organizations" ? "" : value)}>
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
                      <TableCell colSpan={8} className="py-8 text-center">
                        Chargement des salles...
                      </TableCell>
                    </TableRow>
                  ) : rooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-8 text-center">
                        Aucune salle trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    rooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>
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
                                <div className="text-muted-foreground text-sm line-clamp-1">
                                  {room.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={room.organization.logo} alt={room.organization.name} />
                              <AvatarFallback className="text-xs">
                                {room.organization.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{room.organization.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-sm">{room.capacity}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{formatCurrency(room.hourlyRate)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="text-sm">{room._count.bookings}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant={room.active ? "default" : "secondary"}>
                            {room.active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRoom(room)}>
                            <Clock className="h-4 w-4 mr-2" />
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
              <Select value={organizationFilter} onValueChange={(value) => setOrganizationFilter(value === "all-organizations" ? "" : value)}>
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
                    <span className="text-sm font-normal text-muted-foreground">
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
            <CardContent className="overflow-x-auto">
              {/* Week Navigation */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" onClick={() => navigateWeek('prev')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Semaine précédente
                </Button>
                <div className="font-medium">
                  {formatWeekRange(currentWeek)}
                </div>
                <Button variant="outline" onClick={() => navigateWeek('next')}>
                  Semaine suivante
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>

              {/* Horizontal Room Navigation */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Salles:</span>
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
                      <Building2 className="h-4 w-4 mr-2" />
                      {room.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Timetable */}
              <div className="border rounded-lg overflow-x-auto">
                <div className="min-w-max">
                  <div className="bg-muted border-b">
                    {(() => {
                      const { startHour, endHour } = getTimetableTimeRange(currentOrganizationHours);
                      const hoursCount = endHour - startHour + 1;
                      return (
                        <div
                          className="grid items-center text-center"
                          style={{
                            gridTemplateColumns: `166px repeat(${hoursCount}, 1fr)`,
                            alignItems: "center",
                            height: "50px", // uniformise la hauteur des cellules
                            fontWeight: 500,
                          }}
                        >
                          <div className="text-sm text-muted-foreground">Jour / Heure</div>
                          {Array.from({ length: hoursCount }, (_, i) => startHour + i).map((hour) => (
                            <div key={hour} className="text-sm font-medium">
                              {hour.toString().padStart(2, "0")}h – {(hour + 1).toString().padStart(2, "0")}h
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Days */}
                  {(() => {
                    const { startHour, endHour } = getTimetableTimeRange(currentOrganizationHours);
                    const hoursCount = endHour - startHour + 1;

                    return getWeekDays(currentWeek).map((day) => {
                      // Get bookings for this day
                      const dayKey = day.toISOString().split('T')[0];
                      const dayBookings = bookings.filter(booking => {
                        const bookingDate = new Date(booking.date).toISOString().split('T')[0];
                        return bookingDate === dayKey && booking.roomId === selectedRoom.id;
                      });

                      // Create merged periods for the day
                      const mergedBookings: { start: number; end: number; booking: any }[] = [];
                      dayBookings.forEach(booking => {
                        // Use normalized hour values
                        const startHourBooking = booking.startHour;
                        const endHourBooking = booking.endHour;

                        // Check if it overlaps with existing merged booking
                        const overlappingIndex = mergedBookings.findIndex(
                          merged => startHourBooking < merged.end && endHourBooking > merged.start
                        );

                        if (overlappingIndex !== -1) {
                          // Merge with existing
                          mergedBookings[overlappingIndex].start = Math.min(mergedBookings[overlappingIndex].start, startHourBooking);
                          mergedBookings[overlappingIndex].end = Math.max(mergedBookings[overlappingIndex].end, endHourBooking);
                        } else {
                          // Add new
                          mergedBookings.push({ start: startHourBooking, end: endHourBooking, booking });
                        }
                      });

                      const frenchDayName = day.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
                      const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
                      const dayHours = currentOrganizationHours?.[englishDayKey];
                      const isClosed = dayHours?.closed;

                      return (
                        <div
                          key={day.toISOString()}
                          className="px-2 py-1 border-b last:border-b-0 hover:bg-muted/30"
                          style={{ display: 'flex', alignItems: 'center', minHeight: '32px' }}
                        >
                          <div
                            className="flex items-center justify-between text-xs text-muted-foreground font-medium w-40 flex-shrink-0"
                            style={{ gap: '4px' }}
                          >
                            <span>
                              {day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                              {isClosed && <span className="text-red-500 ml-1">(Fermé)</span>}
                            </span>

                            {!isClosed && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5 p-0 text-muted-foreground hover:text-primary"
                                onClick={() => {
                                  setSelectedDay(day);
                                  setStartTime('08:00');
                                  setEndTime('09:00');
                                  setReservationDialogOpen(true);
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            )}
                          </div>

                          <div className="flex-1 flex gap-[1px]" style={{ height: '32px' }}>
                            {isClosed ? (
                              // Render empty space for closed days
                              <div className="flex-1"></div>
                            ) : (
                              Array.from({ length: hoursCount }, (_, i) => startHour + i).map((hour, index) => {
                                const dateTime = new Date(day);
                                dateTime.setHours(hour, 0, 0, 0);

                                // Check if within operating hours
                                let status = 'Libre';
                                let bgColor = 'bg-green-100 text-green-800';
                                let borderRadius = 'rounded-none';
                                let bookingSegments: { left: number; width: number; booking: any }[] = [];

                                if (dayHours?.open && dayHours?.close) {
                                  const openTime = dayHours.open.split(':');
                                  const closeTime = dayHours.close.split(':');
                                  const currentTime = hour;
                                  const openHour = parseInt(openTime[0]);
                                  const closeHour = parseInt(closeTime[0]);

                                  if (currentTime < openHour || currentTime >= closeHour) {
                                    status = 'Fermé';
                                    bgColor = 'bg-red-100 text-red-800';
                                  } else {
                                    // Compute segments for each overlapping booking within this hour block [hour, hour + 1)
                                    mergedBookings.forEach(b => {
                                      const overlapStart = Math.max(hour, b.start);
                                      const overlapEnd = Math.min(hour + 1, b.end);
                                      const overlap = overlapEnd - overlapStart;

                                      if (overlap > 0) {
                                        const left = (overlapStart - hour) * 100; // percentage from start of hour
                                        const width = overlap * 100; // percentage width
                                        bookingSegments.push({ left, width, booking: b.booking });
                                      }
                                    });

                                    if (bookingSegments.length > 0) {
                                      status = "Réservé";
                                      bgColor = "bg-orange-100 text-orange-800";
                                    }
                                  }
                                } else {
                                  // Default case when no hours defined
                                  mergedBookings.forEach(b => {
                                    const overlapStart = Math.max(hour, b.start);
                                    const overlapEnd = Math.min(hour + 1, b.end);
                                    const overlap = overlapEnd - overlapStart;

                                    if (overlap > 0) {
                                      const left = (overlapStart - hour) * 100;
                                      const width = overlap * 100;
                                      bookingSegments.push({ left, width, booking: b.booking });
                                    }
                                  });

                                  if (bookingSegments.length > 0) {
                                    status = 'Réservé';
                                    bgColor = 'bg-orange-100 text-orange-800';
                                  }
                                }

                                // Set border radius for continuous bar appearance
                                if (index === 0) borderRadius = 'rounded-l-md';
                                else if (index === hoursCount - 1) borderRadius = 'rounded-r-md';
                                else borderRadius = 'rounded-none';

                                return (
                                  <div
                                    key={dateTime.toISOString()}
                                    className={`flex-1 ${bgColor} ${borderRadius} border-r border-white/20 last:border-r-0 relative overflow-hidden flex items-center justify-center text-xs font-medium ${status === 'Réservé' ? 'cursor-pointer hover:opacity-80' : ''}`}
                                    style={{ minWidth: '80px' }}
                                    onClick={() => {
                                      if (status === 'Réservé' && bookingSegments.length > 0) {
                                        // Find the booking for this time slot (use first segment's booking)
                                        setSelectedBooking(bookingSegments[0].booking);
                                        setBookingDialogOpen(true);
                                      }
                                    }}
                                  >
                                    {status === 'Réservé' && bookingSegments.length > 0 ? (
                                      <HoverCard>
                                        <HoverCardTrigger asChild>
                                          <div className="w-full h-full flex items-center justify-center">
                                            {bookingSegments.map((segment, segIndex) => (
                                              <div
                                                key={segIndex}
                                                className="absolute top-0 h-full bg-orange-300/70 rounded-none transition-[left,width] duration-300 ease-in-out"
                                                style={{
                                                  left: `${segment.left}%`,
                                                  width: `${segment.width}%`
                                                }}
                                              />
                                            ))}
                                            <span className="relative z-10">{status}</span>
                                          </div>
                                        </HoverCardTrigger>
                                        <HoverCardContent className="w-80">
                                          <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">Détails de la réservation</h4>
                                            <div className="text-sm space-y-1">
                                              <p><strong>Créneau horaire:</strong> {new Date(bookingSegments[0].booking.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} - {new Date(bookingSegments[0].booking.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}</p>
                                              <p><strong>Statut:</strong> {bookingSegments[0].booking.status}</p>
                                              <p><strong>Montant:</strong> {formatCurrency(bookingSegments[0].booking.totalAmount)}</p>
                                              <p><strong>Réservé par:</strong> {bookingSegments[0].booking.user.name}</p>
                                              <p><strong>Email:</strong> {bookingSegments[0].booking.user.email}</p>
                                              {bookingSegments[0].booking.notes && (
                                                <p><strong>Notes:</strong> {bookingSegments[0].booking.notes}</p>
                                              )}
                                            </div>
                                          </div>
                                        </HoverCardContent>
                                      </HoverCard>
                                    ) : (
                                      <>
                                        {bookingSegments.map((segment, segIndex) => (
                                          <div
                                            key={segIndex}
                                            className="absolute top-0 h-full bg-orange-300/70 rounded-none transition-[left,width] duration-300 ease-in-out"
                                            style={{
                                              left: `${segment.left}%`,
                                              width: `${segment.width}%`
                                            }}
                                          />
                                        ))}
                                        <span className="relative z-10">{status === 'Réservé' ? status : ''}</span>
                                      </>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Reservation Dialog */}
      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Réserver un créneau</DialogTitle>
            <DialogDescription>
              Réservez un créneau horaire pour la salle {selectedRoom?.name}
            </DialogDescription>
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
                  <Select value={startTime.split(':')[0]} onValueChange={(value) => setStartTime(`${value}:${startTime.split(':')[1]}`)}>
                    <SelectTrigger>
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
                  <Select value={startTime.split(':')[1]} onValueChange={(value) => setStartTime(`${startTime.split(':')[0]}:${value}`)}>
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
                  <Select value={endTime.split(':')[0]} onValueChange={(value) => setEndTime(`${value}:${endTime.split(':')[1]}`)}>
                    <SelectTrigger>
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
                  <Select value={endTime.split(':')[1]} onValueChange={(value) => setEndTime(`${endTime.split(':')[0]}:${value}`)}>
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
              <div className="text-sm text-muted-foreground">
                Jour sélectionné: {selectedDay.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setReservationDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (selectedDay && selectedRoom) {
                  // Validate that end time is after start time
                  const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
                  const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);

                  if (endMinutes <= startMinutes) {
                    setValidationError("L'heure de fin doit être postérieure à l'heure de début.");
                    return;
                  }

                  // Validate booking times against organization hours
                  const frenchDayName = selectedDay.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
                  const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
                  const dayHours = currentOrganizationHours?.[englishDayKey];

                  if (!dayHours || dayHours.closed) {
                    alert("Impossible de réserver : le centre est fermé ce jour-là.");
                    return;
                  }

                  const openMinutes = parseInt(dayHours.open.split(':')[0]) * 60 + parseInt(dayHours.open.split(':')[1]);
                  const closeMinutes = parseInt(dayHours.close.split(':')[0]) * 60 + parseInt(dayHours.close.split(':')[1]);

                  if (startMinutes < openMinutes || endMinutes > closeMinutes) {
                    setValidationError(`Impossible de réserver : les horaires doivent être entre ${dayHours.open} et ${dayHours.close}.`);
                    return;
                  }

                  const bookingData = {
                    organizationId: selectedRoom.organizationId,
                    roomId: selectedRoom.id,
                    date: selectedDay.toISOString().split('T')[0],
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
