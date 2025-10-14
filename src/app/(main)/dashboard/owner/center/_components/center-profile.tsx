"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Camera, MapPin, Phone, Mail, Globe, Clock, Save, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  type: string;
  subscription: string;
  address: any;
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  active: boolean;
  hours?: any;
  members?: Member[];
}

interface OrganizationsResponse {
  organizations: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface Member {
  id: string;
  role: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface Room {
  id: string;
  name: string;
  capacity: number;
  hourlyRate: number;
  active: boolean;
}

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  user: {
    name: string;
  };
}

const LocationPicker = dynamic(() => import('./location-picker').then(mod => mod.LocationPicker), { ssr: false });

export function CenterProfile() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "Tunisia"
    },
    coordinates: {
      lat: "36.7948545",
      lng: "10.7063772"
    },
    hours: {
      monday: { open: "08:00", close: "18:00", closed: false },
      tuesday: { open: "08:00", close: "18:00", closed: false },
      wednesday: { open: "08:00", close: "18:00", closed: false },
      thursday: { open: "08:00", close: "18:00", closed: false },
      friday: { open: "08:00", close: "18:00", closed: false },
      saturday: { open: "08:00", close: "18:00", closed: false },
      sunday: { open: "08:00", close: "18:00", closed: true }
    }
  });

  // Fetch organizations list (from organizations-management.tsx logic)
  const fetchUserOrganizations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "10",
      });

      const response = await fetch(`/api/organizations?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const data: OrganizationsResponse = await response.json();
      setOrganizations(data.organizations);
      if (data.organizations.length > 0 && !selectedOrgId) {
        const orgId = searchParams.get('orgId');
        if (orgId) {
          setSelectedOrgId(orgId);
        } else {
          setSelectedOrgId(data.organizations[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserOrganizations();
    }
  }, [session]);

  useEffect(() => {
    if (selectedOrgId) {
      fetchOrganization();
      fetchRooms();
      fetchBookings();
      const org = organizations.find(o => o.id === selectedOrgId);
      if (org) setMembers(org.members || []);
    }
  }, [selectedOrgId, organizations]);

  const fetchRooms = async () => {
    if (!selectedOrgId) return;
    try {
      const response = await fetch(`/api/rooms?organizationId=${selectedOrgId}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch rooms");
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchBookings = async () => {
    if (!selectedOrgId) return;
    try {
      const response = await fetch(`/api/bookings?organizationId=${selectedOrgId}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchOrganization = async () => {
    if (!selectedOrgId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/organizations/${selectedOrgId}`);
      if (!response.ok) throw new Error("Failed to fetch organization");

      const data = await response.json();
      const org = data.organization;
      if (!org) throw new Error("Organization not found");

      setOrganization(org);
      setFormData({
        name: org.name || "",
        logo: org.logo || "",
        description: org.description || "",
        phone: org.phone || "",
        email: org.email || "",
        website: org.website || "",
        address: {
          street: org.address?.street || "",
          city: org.address?.city || "",
          state: org.address?.state || "",
          postalCode: org.address?.postalCode || org.address?.zipCode || "",
          country: org.address?.country || "Tunisia"
        },
        coordinates: org.coordinates ? { lat: org.coordinates.lat.toString(), lng: org.coordinates.lng.toString() } : { lat: "36.7948545", lng: "10.7063772" },
        hours: (() => {
          const defaultHours = {
            monday: { open: "08:00", close: "18:00", closed: false },
            tuesday: { open: "08:00", close: "18:00", closed: false },
            wednesday: { open: "08:00", close: "18:00", closed: false },
            thursday: { open: "08:00", close: "18:00", closed: false },
            friday: { open: "08:00", close: "18:00", closed: false },
            saturday: { open: "08:00", close: "18:00", closed: false },
            sunday: { open: "08:00", close: "18:00", closed: true }
          };
          if (!org.hours) return defaultHours;
          return Object.keys(defaultHours).reduce((acc, day) => {
            acc[day as keyof typeof defaultHours] = { ...defaultHours[day as keyof typeof defaultHours], ...(org.hours[day] || {}) };
            return acc;
          }, {} as any);
        })()
      });
    } catch (error) {
      toast.error("Failed to load center information");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();

      setFormData({ ...formData, logo: data.url });
      setOrganization(prev => prev ? { ...prev, logo: data.url } : null);

      // Save to database
      if (organization) {
        await fetch(`/api/organizations/${organization.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logo: data.url })
        });
      }

      toast.success("Logo uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload logo");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!organization) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/organizations/${organization.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to update center");

      toast.success("Center information updated successfully");
      setOrganization(prev => prev ? { ...prev, ...formData } : null);
    } catch (error) {
      toast.error("Failed to update center information");
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({ ...prev, coordinates: { lat: parseFloat(lat).toFixed(6), lng: parseFloat(lon).toFixed(6) } }));
        toast.success("Lieu trouvé et localisation mise à jour");
      } else {
        toast.error("Lieu non trouvé");
      }
    } catch (error) {
      toast.error("Erreur lors de la recherche");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading center information...</div>
      </div>
    );
  }

  if (!organization) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Profil du centre</h1>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>

          {/* Organization Selector */}
          {organizations.length > 1 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Sélectionner l'organisation</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Identity & Contact */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
              {/* Profile Picture */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo du centre</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-gray-200">
                      <AvatarImage src={formData.logo || organization.logo} alt={organization.name} />
                      <AvatarFallback className="text-lg">
                        {organization.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full h-6 w-6 p-0"
                      onClick={handleAvatarClick}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Camera className="h-3 w-3" />
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du centre</Label>
                    <Input
                    className="mt-2"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      className="mt-2"
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez votre centre..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Adresse email"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="Site web"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Location & Operations */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Localisation et horaires</h3>
              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Adresse
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="street">Adresse</Label>
                      <Input
                      className="mt-2"
                        id="street"
                        value={formData.address.street}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                                            className="mt-2"

                        id="city"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Région</Label>
                      <Input
                      className="mt-2"
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                      className="mt-2"
                        id="postalCode"
                        value={formData.address.postalCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, postalCode: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Localisation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        value={formData.coordinates.lat}
                        readOnly
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        value={formData.coordinates.lng}
                        readOnly
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Rechercher un lieu</Label>
                    <div className="flex gap-2 mt-2 mb-4">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Entrez un lieu..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button onClick={handleSearch} size="sm">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <Label>Cliquez sur la carte pour définir la localisation</Label>
                    <div className="mt-2">
                      <LocationPicker
                        lat={parseFloat(formData.coordinates.lat)}
                        lng={parseFloat(formData.coordinates.lng)}
                        onLocationChange={(lat, lng) => setFormData({
                          ...formData,
                          coordinates: { lat: lat.toFixed(6), lng: lng.toFixed(6) }
                        })}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onSearch={handleSearch}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Operating Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horaires d'ouverture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(() => {
                      const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
                      const dayLabels: Record<string, string> = {
                        monday: "Lundi",
                        tuesday: "Mardi",
                        wednesday: "Mercredi",
                        thursday: "Jeudi",
                        friday: "Vendredi",
                        saturday: "Samedi",
                        sunday: "Dimanche"
                      };
                      return dayOrder.map((day) => {
                        const hours = formData.hours?.[day as keyof typeof formData.hours];
                        if (!hours) return null;
                        return (
                          <div key={day} className="flex items-center gap-4">
                            <div className="w-20 text-sm font-medium">{dayLabels[day] || day}</div>
                        <Switch
                          checked={!hours?.closed}
                          onCheckedChange={(checked) => setFormData({
                            ...formData,
                            hours: {
                              ...formData.hours,
                              [day]: { ...hours, closed: !checked }
                            }
                          })}
                        />
                        {!hours?.closed && (
                          <>
                            <Input
                              type="time"
                              value={hours?.open || "08:00"}
                              onChange={(e) => setFormData({
                                ...formData,
                                hours: {
                                  ...formData.hours,
                                  [day]: { ...hours, open: e.target.value }
                                }
                              })}
                              className="w-24"
                            />
                            <span className="text-muted-foreground">à</span>
                            <Input
                              type="time"
                              value={hours?.close || "18:00"}
                              onChange={(e) => setFormData({
                                ...formData,
                                hours: {
                                  ...formData.hours,
                                  [day]: { ...hours, close: e.target.value }
                                }
                              })}
                              className="w-24"
                            />
                          </>
                        )}
                        {hours?.closed && (
                          <span className="text-muted-foreground text-sm">Fermé</span>
                        )}
                        </div>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mt-12 bg-gray-50 -mx-6 px-6 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Aperçu des activités</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Members */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Membres ({members.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {members.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.user.avatar} alt={member.user.name} />
                          <AvatarFallback className="text-xs">{member.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.user.name}</span>
                        <Badge variant="outline" className="text-xs">{member.role}</Badge>
                      </div>
                    ))}
                    {members.length > 5 && <p className="text-sm text-muted-foreground">Et {members.length - 5} autres...</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Rooms */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Salles ({rooms.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rooms.slice(0, 5).map((room) => (
                      <div key={room.id} className="flex justify-between items-center">
                        <span className="text-sm">{room.name}</span>
                        <Badge variant="outline" className="text-xs">{room.capacity} places</Badge>
                      </div>
                    ))}
                    {rooms.length > 5 && <p className="text-sm text-muted-foreground">Et {rooms.length - 5} autres...</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Bookings */}
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Réservations récentes ({bookings.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{booking.user.name}</span>
                          <p className="text-xs text-muted-foreground">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'} className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                    {bookings.length > 5 && <p className="text-sm text-muted-foreground">Et {bookings.length - 5} autres...</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}