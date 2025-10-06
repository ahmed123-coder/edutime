"use client";

import { useState } from "react";
import { Users, Square, Eye, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <p className="text-muted-foreground">{rooms.length} salle{rooms.length > 1 ? 's' : ''}</p>
      </div>

      <div className="grid gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className={`${!room.available ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Room Image */}
                <div className="lg:w-64 h-48 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-muted-foreground">Photo de la salle</span>
                </div>

                {/* Room Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                      <p className="text-muted-foreground mb-4">{room.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
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
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Jusqu'à {room.capacity} personnes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Square className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{room.area} m²</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{room.photos.length} photo{room.photos.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Équipements inclus</h4>
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
                          <Eye className="h-4 w-4 mr-2" />
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
                              <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">Photo {index + 1}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Detailed Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Spécifications</h4>
                              <ul className="text-sm space-y-1">
                                <li>Capacité: {room.capacity} personnes</li>
                                <li>Surface: {room.area} m²</li>
                                <li>Tarif: {room.hourlyRate} DT/heure</li>
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Équipements</h4>
                              <ul className="text-sm space-y-1">
                                {room.equipment.map((item, index) => (
                                  <li key={index}>• {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      disabled={!room.available}
                      className="flex-1 lg:flex-none"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {room.available ? 'Réserver maintenant' : 'Non disponible'}
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
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{rooms.length}</div>
              <div className="text-sm text-muted-foreground">Salles au total</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.min(...rooms.map(r => r.hourlyRate))} - {Math.max(...rooms.map(r => r.hourlyRate))} DT
              </div>
              <div className="text-sm text-muted-foreground">Gamme de prix/heure</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Math.max(...rooms.map(r => r.capacity))}
              </div>
              <div className="text-sm text-muted-foreground">Capacité maximale</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
