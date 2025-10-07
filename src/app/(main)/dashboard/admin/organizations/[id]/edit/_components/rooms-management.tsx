"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Room {
  id: string;
  name: string;
  description?: string;
  capacity: number;
  area?: number;
  hourlyRate: number;
  equipment?: string[];
  amenities?: string[];
  photos?: string[];
  active: boolean;
}

interface Equipment {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

interface Amenity {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

interface RoomsManagementProps {
  organizationId: string;
}

function RoomModal({ 
  open, 
  onOpenChange, 
  title, 
  formData, 
  setFormData, 
  onSave,
  availableEquipment,
  availableAmenities
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  title: string;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  availableEquipment: Equipment[];
  availableAmenities: Amenity[];
}) {
  const toggleEquipment = (equipmentId: string) => {
    const current = formData.equipment || [];
    const updated = current.includes(equipmentId)
      ? current.filter((id: string) => id !== equipmentId)
      : [...current, equipmentId];
    setFormData({ ...formData, equipment: updated });
  };

  const toggleAmenity = (amenityId: string) => {
    const current = formData.amenities || [];
    const updated = current.includes(amenityId)
      ? current.filter((id: string) => id !== amenityId)
      : [...current, amenityId];
    setFormData({ ...formData, amenities: updated });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {title.includes("Modifier") ? "Modifier les détails de la salle" : "Créer une nouvelle salle"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de la salle</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="capacity">Capacité</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="area">Surface (m²)</Label>
              <Input
                id="area"
                type="number"
                min="0"
                step="0.1"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="hourlyRate">Tarif horaire (TND)</Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.1"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <div>
            <Label>Équipements</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableEquipment.map((equipment) => {
                const isSelected = formData.equipment?.includes(equipment.id);
                return (
                  <Badge
                    key={equipment.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer flex items-center gap-1 hover:bg-primary/80"
                    onClick={() => toggleEquipment(equipment.id)}
                  >
                    <Check className={cn("h-3 w-3", isSelected ? "opacity-100" : "opacity-0")} />
                    {equipment.name}
                  </Badge>
                );
              })}
            </div>
          </div>
          
          <div>
            <Label>Commodités</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableAmenities.map((amenity) => {
                const isSelected = formData.amenities?.includes(amenity.id);
                return (
                  <Badge
                    key={amenity.id}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer flex items-center gap-1 hover:bg-primary/80"
                    onClick={() => toggleAmenity(amenity.id)}
                  >
                    <Check className={cn("h-3 w-3", isSelected ? "opacity-100" : "opacity-0")} />
                    {amenity.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSave}>
            {title.includes("Modifier") ? "Modifier" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RoomsManagement({ organizationId }: RoomsManagementProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 1,
    area: 0,
    hourlyRate: 0,
    equipment: [] as string[],
    amenities: [] as string[],
    photos: [] as string[],
    active: true
  });

  useEffect(() => {
    fetchRooms();
    fetchEquipment();
    fetchAmenities();
  }, [organizationId]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment');
      if (response.ok) {
        const data = await response.json();
        setAvailableEquipment(data.equipment || []);
      }
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    }
  };

  const fetchAmenities = async () => {
    try {
      const response = await fetch('/api/amenities');
      if (response.ok) {
        const data = await response.json();
        setAvailableAmenities(data.amenities || []);
      }
    } catch (error) {
      console.error('Failed to fetch amenities:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/rooms`);
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      capacity: 1,
      area: 0,
      hourlyRate: 0,
      equipment: [],
      amenities: [],
      photos: [],
      active: true
    });
  }, []);

  const handleCreate = useCallback(() => {
    resetForm();
    setSelectedRoom(null);
    setEditModalOpen(false);
    setCreateModalOpen(true);
  }, [resetForm]);

  const handleEdit = useCallback((room: Room) => {
    setFormData({
      name: room.name,
      description: room.description || "",
      capacity: room.capacity,
      area: room.area || 0,
      hourlyRate: room.hourlyRate,
      equipment: room.equipment || [],
      amenities: room.amenities || [],
      photos: room.photos || [],
      active: room.active
    });
    setSelectedRoom(room);
    setCreateModalOpen(false);
    setEditModalOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const url = selectedRoom 
        ? `/api/rooms/${selectedRoom.id}`
        : `/api/rooms`;
      
      const method = selectedRoom ? "PUT" : "POST";
      const payload = selectedRoom 
        ? formData 
        : { ...formData, organizationId };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to save room");
      
      toast.success(selectedRoom ? "Room updated successfully" : "Room created successfully");
      setCreateModalOpen(false);
      setEditModalOpen(false);
      fetchRooms();
    } catch (error) {
      toast.error("Failed to save room");
    }
  }, [selectedRoom, formData, organizationId]);

  const handleDelete = async (roomId: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    
    try {
      const response = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete room");
      
      toast.success("Room deleted successfully");
      fetchRooms();
    } catch (error) {
      toast.error("Failed to delete room");
    }
  };



  if (loading) {
    return <div className="text-center py-8">Chargement des salles...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestion des Salles</h3>
          <p className="text-muted-foreground text-sm">Gérer les salles de cette organisation</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une Salle
        </Button>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Aucune salle trouvée</p>
            <Button onClick={handleCreate} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Créer la première salle
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                  <Badge variant={room.active ? "default" : "secondary"}>
                    {room.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {room.description && (
                  <CardDescription className="line-clamp-2">
                    {room.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacité:</span>
                    <span>{room.capacity} personnes</span>
                  </div>
                  {room.area && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Surface:</span>
                      <span>{room.area} m²</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarif:</span>
                    <span>{room.hourlyRate} TND/h</span>
                  </div>
                  {room.equipment && room.equipment.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Équipements:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {room.equipment.slice(0, 3).map((equipmentId, index) => {
                          const equipment = availableEquipment.find(e => e.id === equipmentId);
                          return equipment ? (
                            <Badge key={index} variant="outline" className="text-xs">
                              {equipment.name}
                            </Badge>
                          ) : null;
                        })}
                        {room.equipment.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{room.equipment.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(room)}>
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(room.id)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RoomModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Créer une nouvelle salle"
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        availableEquipment={availableEquipment}
        availableAmenities={availableAmenities}
      />
      
      <RoomModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title="Modifier la salle"
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        availableEquipment={availableEquipment}
        availableAmenities={availableAmenities}
      />
    </div>
  );
}