"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Check, Star, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ImageGallery } from "@/components/image-gallery";

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
  defaultPhoto?: string;
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
  availableAmenities,
  onUploadImages,
  onSetDefaultPhoto,
  onMovePhoto,
  onRemovePhoto,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedIndex
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  availableEquipment: Equipment[];
  availableAmenities: Amenity[];
  onUploadImages: (files: FileList) => Promise<string[]>;
  onSetDefaultPhoto: (photoUrl: string) => void;
  onMovePhoto: (fromIndex: number, toIndex: number) => void;
  onRemovePhoto: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  draggedIndex: number | null;
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

          <div>
            <Label>Images de la salle</Label>
            <div className="mt-2 space-y-4">
              {/* Upload Section */}
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onUploadImages(e.target.files).then((urls) => {
                        setFormData({
                          ...formData,
                          photos: [...formData.photos, ...urls],
                          defaultPhoto: formData.defaultPhoto || urls[0]
                        });
                      }).catch((error) => {
                        console.error('Upload failed:', error);
                        // You might want to show a toast here
                      });
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                  id="room-images-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('room-images-upload')?.click()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter des images
                </Button>
              </div>

              {/* Images Grid */}
              {formData.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {formData.photos.map((photo: string, index: number) => (
                     <div
                       key={index}
                       draggable
                       onDragStart={(e) => onDragStart(e, index)}
                       onDragOver={onDragOver}
                       onDrop={(e) => onDrop(e, index)}
                       onDragEnd={onDragEnd}
                       className={cn(
                         "relative group border rounded-lg overflow-hidden cursor-move transition-all",
                         draggedIndex === index && "opacity-50 scale-95"
                       )}
                     >
                       <img
                         src={photo}
                         alt={`Room image ${index + 1}`}
                         className="w-full h-24 object-cover"
                       />

                       {/* Small Default Button - Top Left */}
                       <Button
                         type="button"
                         variant="secondary"
                         size="sm"
                         onClick={() => onSetDefaultPhoto(photo)}
                         className={cn(
                           "absolute top-1 left-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                           formData.defaultPhoto === photo && "opacity-100 bg-yellow-500 hover:bg-yellow-600"
                         )}
                         title="Set as default"
                       >
                         <Star className={cn(
                           "h-3 w-3",
                           formData.defaultPhoto === photo ? "fill-current text-white" : "text-gray-400"
                         )} />
                       </Button>

                       {/* Delete Button - Top Right */}
                       <Button
                         type="button"
                         variant="secondary"
                         size="sm"
                         onClick={() => onRemovePhoto(index)}
                         className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 bg-black/50 hover:bg-black/70"
                         title="Remove image"
                       >
                         <X className="h-3 w-3" />
                       </Button>

                       {/* Drag Handle - Bottom */}
                       <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                         Drag to reorder
                       </div>

                       {/* Default Badge */}
                       {formData.defaultPhoto === photo && (
                         <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded flex items-center gap-0.5">
                           <Star className="h-2.5 w-2.5 fill-current" />
                         </div>
                       )}
                     </div>
                   ))}
                 </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <p className="text-muted-foreground">Aucune image ajoutée</p>
                </div>
              )}
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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
    defaultPhoto: "",
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

  const uploadImages = async (files: FileList): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'room');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to upload ${file.name}: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      uploadedUrls.push(data.url);
    }

    return uploadedUrls;
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const setDefaultPhoto = (photoUrl: string) => {
    setFormData({ ...formData, defaultPhoto: photoUrl });
  };

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...formData.photos];
    const [moved] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, moved);
    setFormData({ ...formData, photos: newPhotos });
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newDefaultPhoto = formData.defaultPhoto === formData.photos[index]
      ? (newPhotos.length > 0 ? newPhotos[0] : "")
      : formData.defaultPhoto;
    setFormData({
      ...formData,
      photos: newPhotos,
      defaultPhoto: newDefaultPhoto
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      movePhoto(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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
      defaultPhoto: "",
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
      defaultPhoto: room.defaultPhoto || (room.photos && room.photos.length > 0 ? room.photos[0] : ""),
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
        : { ...formData, organizationId, defaultPhoto: formData.defaultPhoto || (formData.photos.length > 0 ? formData.photos[0] : "") };

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

  const handleDelete = async () => {
    if (!selectedRoom) return;

    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete room");
      }

      toast.success("Room deleted successfully");
      fetchRooms();
      setDeleteDialogOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete room");
    }
  };

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
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
        <div className="space-y-6">
          {rooms.map((room) => (
            <Card key={room.id} className="w-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {room.photos && room.photos.length > 0 && (
                        <div className="relative">
                          <img
                            src={room.defaultPhoto || room.photos[0]}
                            alt={room.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                          {room.defaultPhoto && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs p-1 rounded-full">
                              <Star className="h-3 w-3 fill-current" />
                            </div>
                          )}
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-2xl">{room.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={room.active ? "default" : "secondary"} className="text-xs">
                            {room.active ? "Active" : "Inactive"}
                          </Badge>
                          {room.photos && room.photos.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {room.photos.length} photo{room.photos.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {room.description && (
                      <CardDescription className="text-base">
                        {room.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(room)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteClick(room)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Room Details */}
                  <div className="space-y-6">
                    {/* Room Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{room.capacity}</div>
                        <div className="text-muted-foreground text-sm">Capacité (personnes)</div>
                      </div>
                      {room.area && (
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{room.area}</div>
                          <div className="text-muted-foreground text-sm">Surface (m²)</div>
                        </div>
                      )}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{room.hourlyRate}</div>
                        <div className="text-muted-foreground text-sm">Tarif horaire (TND)</div>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{room.photos?.length || 0}</div>
                        <div className="text-muted-foreground text-sm">Images</div>
                      </div>
                    </div>

                    {/* Equipment */}
                    {room.equipment && room.equipment.length > 0 && (
                      <div>
                        <Label className="text-base font-semibold mb-2 block">Équipements</Label>
                        <div className="flex flex-wrap gap-2">
                          {room.equipment.map((equipmentId, index) => {
                            const equipment = availableEquipment.find(e => e.id === equipmentId);
                            return equipment ? (
                              <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                                {equipment.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div>
                        <Label className="text-base font-semibold mb-2 block">Commodités</Label>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenityId, index) => {
                            const amenity = availableAmenities.find(a => a.id === amenityId);
                            return amenity ? (
                              <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                                {amenity.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Image Gallery */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold block">Images de la salle</Label>
                    {room.photos && room.photos.length > 0 ? (
                      <ImageGallery
                        images={room.photos}
                        className="w-full"
                      />
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <p className="text-muted-foreground">Aucune image pour cette salle</p>
                      </div>
                    )}
                  </div>
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
        onUploadImages={uploadImages}
        onSetDefaultPhoto={setDefaultPhoto}
        onMovePhoto={movePhoto}
        onRemovePhoto={removePhoto}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        draggedIndex={draggedIndex}
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
        onUploadImages={uploadImages}
        onSetDefaultPhoto={setDefaultPhoto}
        onMovePhoto={movePhoto}
        onRemovePhoto={removePhoto}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        draggedIndex={draggedIndex}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la salle</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{selectedRoom?.name}" ? Cette action est irréversible et supprimera définitivement la salle du système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRoom(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer la salle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}