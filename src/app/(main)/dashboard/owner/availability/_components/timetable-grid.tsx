"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { formatDecimalHour } from "../_utils/time-utils";

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

interface TimetableGridProps {
  rooms: Room[];
  currentWeek: Date;
  selectedRoom: Room | null;
  bookings: any[];
  bookingConflicts: any[][];
  draggedBooking: any;
  currentOrganizationHours: any;
  frenchToEnglishDayMapping: { [key: string]: string };
  getTimetableTimeRange: (hours: any) => { startHour: number; endHour: number };
  getWeekDays: (date: Date) => Date[];
  formatCurrency: (amount: number) => string;
  setDraggedBooking: (booking: any) => void;
  setDragStartPosition: (position: { day: Date; hour: number } | null) => void;
  setSelectedBooking: (booking: any) => void;
  setBookingDialogOpen: (open: boolean) => void;
  setSelectedDay: (day: Date) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  setReservationDialogOpen: (open: boolean) => void;
  fetchBookings: (roomIds: string[]) => void;
}

export function TimetableGrid({
  rooms,
  currentWeek,
  selectedRoom,
  bookings,
  bookingConflicts,
  draggedBooking,
  currentOrganizationHours,
  frenchToEnglishDayMapping,
  getTimetableTimeRange,
  getWeekDays,
  formatCurrency,
  setDraggedBooking,
  setDragStartPosition,
  setSelectedBooking,
  setBookingDialogOpen,
  setSelectedDay,
  setStartTime,
  setEndTime,
  setReservationDialogOpen,
  fetchBookings,
}: TimetableGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  function DropZone({ id }: { id: string }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
      <div
        ref={setNodeRef}
        className={`border-r border-gray-200 transition-colors last:border-r-0 ${
          isOver ? "bg-blue-100" : "bg-white hover:bg-blue-50"
        }`}
      />
    );
  }

  function DraggableBooking({
    processedBooking,
    onClick,
    formatCurrency,
  }: {
    processedBooking: {
      booking: any;
      layer: number;
      isConflicted: boolean;
      left: number;
      width: number;
    };
    onClick: (e: React.MouseEvent) => void;
    formatCurrency: (amount: number) => string;
  }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: processedBooking.booking.id,
    });

    const [hovered, setHovered] = useState(false);

    const style = {
      left: `${processedBooking.left}%`,
      width: `${processedBooking.width}%`,
      top: `${processedBooking.layer * 32 + 8}px`,
      height: "28px",
      zIndex: isDragging ? 9999 : 10,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    const bgColor = processedBooking.isConflicted
      ? "bg-red-500"
      : processedBooking.booking.status === "CONFIRMED"
      ? "bg-blue-500"
      : "bg-amber-400";

    return (
      <HoverCard open={hovered && !isDragging}>
        <HoverCardTrigger asChild>
          <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`absolute ${bgColor} flex cursor-grab items-center justify-center rounded-lg border border-white/20 text-xs font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-110 active:cursor-grabbing`}
            style={style}
            onClick={(e) => {
              if (isDragging) return;
              onClick(e);
            }}
          >
            <span className="truncate px-2">
              {processedBooking.booking.user?.name ?? processedBooking.booking.room?.name ?? "Booking"}
            </span>
          </div>
        </HoverCardTrigger>

        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">
              {processedBooking.isConflicted ? "⚠️ Booking Conflict" : "Booking Details"}
            </h4>
            <div className="space-y-1 text-sm">
              <p>
                <strong>Time Slot:</strong>{" "}
                {formatDecimalHour(processedBooking.booking.startHour)} –{" "}
                {formatDecimalHour(processedBooking.booking.endHour)}
              </p>
              <p>
                <strong>Status:</strong> {processedBooking.booking.status}
              </p>
              <p>
                <strong>Amount:</strong> {formatCurrency(processedBooking.booking.totalAmount)}
              </p>
              <p>
                <strong>Booked by:</strong> {processedBooking.booking.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {processedBooking.booking.user?.email}
              </p>
              {processedBooking.booking.notes && (
                <p>
                  <strong>Notes:</strong> {processedBooking.booking.notes}
                </p>
              )}
              {processedBooking.isConflicted && (
                <div className="mt-2 rounded border border-red-200 bg-red-50 p-2">
                  <p className="text-xs text-red-700">
                    This booking conflicts with other bookings. Click to manage the conflict.
                  </p>
                </div>
              )}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    document.body.classList.add("dragging");
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    document.body.classList.remove("dragging");

    if (!over || !active) {
      console.log("Drag ended without valid drop target");
      return;
    }

    const draggedBookingId = active.id as string;
    const dropZoneId = over.id as string;

    console.log("🖱️ Drag ended:", { draggedBookingId, dropZoneId });

    // Parse drop zone information (format: "dropzone-{day}-{hour}")
    const dropZoneMatch = dropZoneId.match(/^dropzone-(\d{4}-\d{2}-\d{2})-(\d+)$/);
    if (!dropZoneMatch) {
      console.log("❌ Invalid drop zone format:", dropZoneId);
      return;
    }

    const [_, newDateStr, hourStr] = dropZoneMatch;
    const newStartHour = parseInt(hourStr);
    const newDate = new Date(newDateStr);

    console.log("📅 Drop zone parsed:", { newDateStr, hourStr, newStartHour });

    // Find the dragged booking
    const draggedBooking = bookings.find((b) => b.id === draggedBookingId);
    if (!draggedBooking) {
      console.log("❌ Dragged booking not found:", draggedBookingId);
      return;
    }

    console.log("📋 Found dragged booking:", draggedBooking);

    const duration = draggedBooking.endHour - draggedBooking.startHour;
    const newEndHour = newStartHour + duration;

    console.log("⏰ Calculated times:", { duration, newStartHour, newEndHour });

    // Validate against organization hours
    const frenchDayName = newDate.toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
    const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
    const dayHours = currentOrganizationHours?.[englishDayKey];

    console.log("🏢 Organization hours:", { frenchDayName, englishDayKey, dayHours });

    if (dayHours?.closed) {
      toast.error("Impossible de déplacer : le centre est fermé ce jour-là.");
      return;
    }

    if (dayHours) {
      const openHour = parseInt(dayHours.open.split(":")[0]);
      const closeHour = parseInt(dayHours.close.split(":")[0]);
      if (newStartHour < openHour || newEndHour > closeHour) {
        toast.error(`Impossible de déplacer : les horaires doivent être entre ${dayHours.open} et ${dayHours.close}.`);
        return;
      }
    }

    // Check for conflicts - only prevent conflicts with CONFIRMED bookings
    const hasConflict = bookings.some(
      (b) =>
        b.id !== draggedBooking.id &&
        b.roomId === draggedBooking.roomId &&
        b.status === "CONFIRMED" && // Only check for conflicts with confirmed bookings
        new Date(b.date).toISOString().split("T")[0] === newDateStr &&
        ((newStartHour >= b.startHour && newStartHour < b.endHour) ||
          (newEndHour > b.startHour && newEndHour <= b.endHour) ||
          (newStartHour <= b.startHour && newEndHour >= b.endHour)),
    );

    console.log("⚡ Conflict check result (only with confirmed bookings):", hasConflict);

    if (hasConflict) {
      toast.error("Impossible de déplacer : conflit avec une réservation confirmée.");
      return;
    }

    // Update booking via API
    try {
      console.log("🚀 Making API call to update booking...");
      const requestBody = {
        date: newDateStr,
        startTime: formatDecimalHour(newStartHour),
        endTime: formatDecimalHour(newEndHour),
      };
      console.log("📤 Request body:", requestBody);

      const response = await fetch(`/api/bookings/${draggedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 API Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Booking updated successfully:", result);
        toast.success("Réservation déplacée avec succès.");
        fetchBookings([selectedRoom!.id]);
      } else {
        const error = await response.json();
        console.log("❌ API Error response:", error);
        toast.error(error.error || "Erreur lors du déplacement.");
      }
    } catch (error) {
      console.error("💥 API Error:", error);
      toast.error("Erreur lors du déplacement de la réservation.");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
   <div className="w-full overflow-hidden rounded-lg border">
  <div className="w-full">

          <div className="border-b border-gray-300 bg-gray-50">
            {(() => {
              const { startHour, endHour } = getTimetableTimeRange(currentOrganizationHours);
              const hoursCount = endHour - startHour;
              return (
                <div
                  className="sticky top-0 z-20 grid h-14 items-center bg-gray-50 font-medium"
                  style={{
  gridTemplateColumns: `200px repeat(${hoursCount}, 1fr)`,
                  }}
                >
                  <div className="text-muted-foreground flex h-full items-center border-r border-gray-300 px-4 text-sm font-semibold">
                    Jour / Heure
                  </div>
                  {Array.from({ length: hoursCount }, (_, i) => startHour + i).map((hour) => (
                    <div
                      key={hour}
                      className="flex h-full items-center justify-center border-r border-gray-300 px-2 text-center text-xs font-semibold text-gray-700 last:border-r-0"
                    >
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
            const hoursCount = endHour - startHour;

            return getWeekDays(currentWeek).map((day) => {
              // Get bookings for this day
              const dayKey = day.toISOString().split("T")[0];
              const dayBookings = bookings.filter((booking) => {
                const bookingDate = new Date(booking.date).toISOString().split("T")[0];
                return bookingDate === dayKey && booking.roomId === selectedRoom!.id;
              });

              // Check if this day has conflicts
              const dayConflicts = bookingConflicts
                .filter((conflictGroup) =>
                  conflictGroup.every((booking) => {
                    const bookingDate = new Date(booking.date).toISOString().split("T")[0];
                    return bookingDate === dayKey && booking.roomId === selectedRoom!.id;
                  }),
                )
                .flat();

              // Process bookings for continuous timeline layout
              const processedBookings: Array<{
                booking: any;
                layer: number;
                isConflicted: boolean;
                left: number;
                width: number;
              }> = [];

              dayBookings.forEach((booking) => {
                const isConflicted = dayConflicts.some((c) => c.id === booking.id);

                // Calculate position and width as percentages relative to timetable hours
                const bookingStartHour = booking.startHour;
                const bookingEndHour = booking.endHour;
                const timetableDuration = endHour - startHour;
                const left = ((bookingStartHour - startHour) / timetableDuration) * 100;
                const width = ((bookingEndHour - bookingStartHour) / timetableDuration) * 100;

                // Find the first available layer (vertical position)
                let layer = 0;
                let layerOccupied = true;
                while (layerOccupied) {
                  layerOccupied = processedBookings.some(
                    (processed) =>
                      processed.layer === layer &&
                      processed.left < left + width &&
                      processed.left + processed.width > left,
                  );
                  if (layerOccupied) layer++;
                }

                processedBookings.push({
                  booking,
                  layer,
                  isConflicted,
                  left,
                  width,
                });
              });

              // Calculate dynamic row height based on max layers
              const maxLayers =
                processedBookings.length > 0 ? Math.max(...processedBookings.map((b) => b.layer)) + 1 : 1;
              const rowHeight = Math.max(60, maxLayers * 32 + 16); // Min 60px, each layer adds 32px

              const frenchDayName = day.toLocaleDateString("fr-FR", { weekday: "long" }).toLowerCase();
              const englishDayKey = frenchToEnglishDayMapping[frenchDayName];
              const dayHours = currentOrganizationHours?.[englishDayKey];
              const isClosed = dayHours?.closed;

              return (
                <div
                  key={day.toISOString()}
                  className="relative border-b border-gray-200"
                  style={{ height: `${rowHeight}px` }}
                >
                  {/* Day header */}
                  <div className="text-muted-foreground absolute top-0 left-0 z-10 flex h-full w-[200px] items-center justify-between border-r border-gray-300 bg-white px-4 text-sm font-medium">
                    <span>
                      {day.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}
                      {isClosed && <span className="ml-1 text-red-500">(Fermé)</span>}
                    </span>

                    {!isClosed && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary h-6 w-6 p-0"
                        onClick={() => {
                          setSelectedDay(day);
                          // Set default time based on organization hours
                          if (dayHours && !dayHours.closed) {
                            const openHour = parseInt(dayHours.open.split(":")[0]);
                            const closeHour = parseInt(dayHours.close.split(":")[0]);
                            const now = new Date();
                            const currentHour = now.getHours();
                            // Use current hour if within operating hours, otherwise use opening hour
                            const defaultStartHour =
                              currentHour >= openHour && currentHour < closeHour ? currentHour : openHour;
                            const defaultEndHour = Math.min(defaultStartHour + 1, closeHour);
                            setStartTime(`${defaultStartHour.toString().padStart(2, "0")}:00`);
                            setEndTime(`${defaultEndHour.toString().padStart(2, "0")}:00`);
                          } else {
                            const now = new Date();
                            const currentHour = now.getHours();
                            const nextHour = currentHour + 1;
                            setStartTime(`${currentHour.toString().padStart(2, "0")}:00`);
                            setEndTime(`${nextHour.toString().padStart(2, "0")}:00`);
                          }
                          setReservationDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Timeline background */}
                  <div
                    className="absolute top-0 grid h-full"
                    style={{
                      left: "200px",
                      right: 0,
                      gridTemplateColumns: `repeat(${hoursCount}, minmax(100px, 1fr))`,
                    }}
                  >
                    {/* Hour cell drop zones */}
                    {Array.from({ length: hoursCount }, (_, i) => {
                      const cellHour = startHour + i;
                      const dropZoneId = `dropzone-${day.toISOString().split("T")[0]}-${cellHour}`;

                      return <DropZone key={dropZoneId} id={dropZoneId} />;
                    })}

                    {/* Bookings overlay */}
                    <div className="absolute inset-0">
                      {/* Render continuous booking bars */}
                      {processedBookings.map((processedBooking) => (
                        <DraggableBooking
                          key={processedBooking.booking.id}
                          processedBooking={processedBooking}
                          formatCurrency={formatCurrency}
                          onClick={(e) => {
                            if (processedBooking.isConflicted) {
                              const conflictGroup = bookingConflicts.find((group) =>
                                group.some((b) => b.id === processedBooking.booking.id),
                              );
                              if (conflictGroup) {
                                setSelectedBooking({ ...processedBooking.booking, conflictGroup });
                                setBookingDialogOpen(true);
                              }
                            } else {
                              setSelectedBooking(processedBooking.booking);
                              setBookingDialogOpen(true);
                            }
                          }}
                        />
                      ))}

                      {/* Visual indicator for conflicts */}
                      {dayConflicts.length > 0 && (
                        <div className="absolute -top-1 -right-1 z-20 h-3 w-3 rounded-full border-2 border-white bg-red-500 shadow-sm">
                          <div className="h-full w-full animate-pulse rounded-full bg-red-500"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      <DragOverlay>
        {activeId
          ? (() => {
              const draggedBooking = bookings.find((b) => b.id === activeId);
              if (!draggedBooking) return null;

              // Use the same color logic as bookings but lighter
              const getOverlayColor = (status: string) => {
                switch (status?.toUpperCase()) {
                  case "CONFIRMED":
                    return "bg-blue-300"; // Lighter blue
                  case "PENDING":
                    return "bg-amber-300"; // Lighter amber
                  case "CANCELLED":
                  case "ANNULÉ":
                  case "ANNULÉE":
                    return "bg-red-300"; // Lighter red
                  case "COMPLETED":
                  case "TERMINÉE":
                    return "bg-green-300"; // Lighter green
                  case "NO_SHOW":
                  case "NON PRÉSENT":
                    return "bg-gray-300"; // Lighter gray
                  default:
                    return "bg-orange-300"; // Lighter orange
                }
              };

              const overlayColor = getOverlayColor(draggedBooking.status);

              return (
                <div className={`flex items-center justify-center rounded-lg border border-white/20 text-xs font-semibold text-white opacity-90 shadow-lg ${overlayColor}`}>
                  <span className="truncate px-2">
                    {draggedBooking.user?.name ?? draggedBooking.room?.name ?? "Booking"}
                  </span>
                </div>
              );
            })()
          : null}
      </DragOverlay>
    </DndContext>
  );
}
