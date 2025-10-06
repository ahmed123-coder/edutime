"use client";

import { useState } from "react";

import { Calendar, Clock, Users, CreditCard, Shield, Info } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface CenterBookingProps {
  center: {
    id: string;
    name: string;
    rooms: Array<{
      id: string;
      name: string;
      capacity: number;
      hourlyRate: number;
      available: boolean;
    }>;
  };
}

export function CenterBooking({ center }: CenterBookingProps) {
  const [selectedRoom, setSelectedRoom] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [participants, setParticipants] = useState("");

  const selectedRoomData = center.rooms.find((room) => room.id === selectedRoom);

  const calculateDuration = () => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const duration = calculateDuration();
  const totalPrice = selectedRoomData ? duration * selectedRoomData.hourlyRate : 0;
  const commission = totalPrice * 0.1; // 10% commission
  const finalPrice = totalPrice + commission;

  const isFormValid = selectedRoom && date && startTime && endTime && participants;

  const handleBooking = () => {
    if (!isFormValid) return;

    // In real app, this would make an API call
    console.log("Booking data:", {
      centerId: center.id,
      roomId: selectedRoom,
      date,
      startTime,
      endTime,
      participants: parseInt(participants),
      totalPrice: finalPrice,
    });

    // Redirect to payment or confirmation page
    alert("Redirection vers la page de paiement...");
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2 h-5 w-5" />
          Réserver maintenant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Room Selection */}
        <div>
          <Label htmlFor="room">Salle</Label>
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une salle" />
            </SelectTrigger>
            <SelectContent>
              {center.rooms.map((room) => (
                <SelectItem key={room.id} value={room.id} disabled={!room.available}>
                  <div className="flex w-full items-center justify-between">
                    <span>{room.name}</span>
                    <div className="ml-4 flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {room.capacity} pers.
                      </Badge>
                      <span className="text-sm font-medium">{room.hourlyRate} DT/h</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Selection */}
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Heure de début</Label>
            <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="endTime">Heure de fin</Label>
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>
        </div>

        {/* Participants */}
        <div>
          <Label htmlFor="participants">Nombre de participants</Label>
          <Select value={participants} onValueChange={setParticipants}>
            <SelectTrigger>
              <SelectValue placeholder="Nombre de personnes" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(selectedRoomData?.capacity || 50)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1} personne{i > 0 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Capacity Warning */}
        {selectedRoomData && participants && parseInt(participants) > selectedRoomData.capacity && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Cette salle a une capacité maximale de {selectedRoomData.capacity} personnes.
            </AlertDescription>
          </Alert>
        )}

        {/* Price Summary */}
        {selectedRoomData && duration > 0 && (
          <div className="space-y-3">
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{selectedRoomData.name}</span>
                <span>{selectedRoomData.hourlyRate} DT/h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Durée</span>
                <span>{duration}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{totalPrice.toFixed(2)} DT</span>
              </div>
              <div className="text-muted-foreground flex justify-between text-sm">
                <span>Frais de service</span>
                <span>{commission.toFixed(2)} DT</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{finalPrice.toFixed(2)} DT</span>
              </div>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <Button
          className="w-full"
          size="lg"
          disabled={
            !isFormValid || (selectedRoomData && participants && parseInt(participants) > selectedRoomData.capacity)
          }
          onClick={handleBooking}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Réserver et payer
        </Button>

        {/* Security Notice */}
        <div className="text-muted-foreground flex items-start space-x-2 text-xs">
          <Shield className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            Paiement sécurisé. Annulation gratuite jusqu'à 24h avant la réservation. Vous ne serez débité qu'après
            confirmation.
          </p>
        </div>

        {/* Contact Info */}
        <Separator />
        <div className="text-center">
          <p className="text-muted-foreground mb-2 text-sm">Besoin d'aide pour votre réservation ?</p>
          <Button variant="outline" size="sm">
            Contacter le centre
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
