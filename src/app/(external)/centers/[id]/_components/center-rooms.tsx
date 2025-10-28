"use client";

import { useState } from "react";

import { Users, Square, Eye, Calendar } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  area: number;
  hourlyRate: number;
  equipment: string[];
  photos: string[];
  available: boolean;
}

interface CenterRoomsProps {
  rooms: Room[];
}

export function CenterRooms({ rooms }: CenterRoomsProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Salles disponibles</h2>
        <p className="text-muted-foreground">
          {rooms.length} salle{rooms.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className={`${!room.available ? "opacity-60" : ""}`}>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row">
                {/* Room Image */}
                <div className="bg-muted flex h-48 flex-shrink-0 items-center justify-center rounded-lg lg:w-64">
                  <span className="text-muted-foreground">Photo de la salle</span>
                </div>

                {/* Room Details */}
                <div className="flex-1">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-2 text-xl font-semibold">{room.name}</h3>
                      <p className="text-muted-foreground mb-4">{room.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-primary text-2xl font-bold">
                        {room.hourlyRate} DT<span className="text-sm font-normal">/heure</span>
                      </div>
                      {!room.available && (
                        <Badge variant="destructive" className="mt-2">
                          Non disponible
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Room Specs */}
                  <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Users className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">Jusqu'à {room.capacity} personnes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Square className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{room.area} m²</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">
                        {room.photos.length} photo{room.photos.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="mb-4">
                    <h4 className="mb-2 font-medium">Équipements inclus</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.equipment.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedRoom(room)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{room.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Room Gallery */}
                          <div className="grid grid-cols-2 gap-4">
                            {room.photos.map((photo, index) => (
                              <div
                                key={index}
                                className="bg-muted flex aspect-video items-center justify-center rounded-lg"
                              >
                                <span className="text-muted-foreground text-sm">Photo {index + 1}</span>
                              </div>
                            ))}
                          </div>

                          {/* Detailed Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="mb-2 font-medium">Spécifications</h4>
                              <ul className="space-y-1 text-sm">
                                <li>Capacité: {room.capacity} personnes</li>
                                <li>Surface: {room.area} m²</li>
                                <li>Tarif: {room.hourlyRate} DT/heure</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-2 font-medium">Équipements</h4>
                              <ul className="space-y-1 text-sm">
                                {room.equipment.map((item, index) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button disabled={!room.available} className="flex-1 lg:flex-none">
                      <Calendar className="mr-2 h-4 w-4" />
                      {room.available ? "Réserver maintenant" : "Non disponible"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="grid gap-4 text-center md:grid-cols-3">
            <div>
              <div className="text-2xl font-bold">{rooms.length}</div>
              <div className="text-muted-foreground text-sm">Salles au total</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.min(...rooms.map((r) => r.hourlyRate))} - {Math.max(...rooms.map((r) => r.hourlyRate))} DT
              </div>
              <div className="text-muted-foreground text-sm">Gamme de prix/heure</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{Math.max(...rooms.map((r) => r.capacity))}</div>
              <div className="text-muted-foreground text-sm">Capacité maximale</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
