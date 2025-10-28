"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Camera, MapPin, Phone, Mail, Globe, Clock, ArrowLeft, Edit, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamically import LocationPicker to avoid loading map on initial page load
const LocationPicker = dynamic(
  () => import("@/app/(main)/dashboard/owner/center/_components/location-picker").then(mod => ({ default: mod.LocationPicker })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-sm text-gray-500">Loading map...</div>
      </div>
    )
  }
);

// Dynamically import RoomsManagement to avoid loading heavy components on initial page load
const RoomsManagement = dynamic(
  () => import("@/app/(main)/dashboard/admin/organizations/[id]/edit/_components/rooms-management").then(mod => ({ default: mod.RoomsManagement })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-40 bg-gray-100 rounded-lg">
        <div className="text-sm text-gray-500">Loading rooms...</div>
      </div>
    )
  }
);

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
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface ViewOrganizationProfileProps {
  organizationId: string;
}

export function ViewOrganizationProfile({ organizationId }: ViewOrganizationProfileProps) {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, [organizationId]);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/organizations/${organizationId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.organization) {
        throw new Error("No organization data received");
      }

      // Ensure coordinates exist with defaults
      const orgWithCoordinates = {
        ...data.organization,
        coordinates: data.organization.coordinates || {
          lat: 36.7948545,
          lng: 10.7063772
        }
      };

      // Debug logging (remove in production)
      console.log("Organization data:", orgWithCoordinates);
      console.log("Coordinates:", orgWithCoordinates.coordinates);

      setOrganization(orgWithCoordinates);
    } catch (error) {
      console.error("Failed to fetch organization:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load organization data");
      router.push("/dashboard/owner/organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    // Read-only, do nothing
  };

  const handleSearch = async () => {
    // Read-only, do nothing
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading organization...</div>
      </div>
    );
  }

  if (!organization) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/owner/organizations")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/owner/organizations/${organizationId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Organization
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-gray-200">
                <AvatarImage src={organization.logo} alt={organization.name} />
                <AvatarFallback className="text-lg">
                  {organization.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Basic Info */}
            <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">{organization.name}</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={organization.type === "TRAINING_CENTER" ? "default" : "secondary"}>
                    {organization.type.replace("_", " ")}
                  </Badge>
                  <Badge variant={organization.subscription === "PRO" ? "default" : "secondary"}>
                    {organization.subscription}
                  </Badge>
                  <Badge variant={organization.verified ? "default" : "destructive"}>
                    {organization.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div>
                  <div className="text-gray-700">{organization.description || "No description provided"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
                <TabsTrigger value="availability">Disponibilité</TabsTrigger>
                <TabsTrigger value="location">Localisation</TabsTrigger>
                <TabsTrigger value="rooms">Salles</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Contact & Settings */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{organization.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{organization.email || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{organization.website || "Not provided"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Organization Type</div>
                    <div className="flex gap-2">
                      <Badge variant={organization.type === "TRAINING_CENTER" ? "default" : "secondary"}>
                        {organization.type.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Address & Hours */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Street Address</div>
                      <div className="text-sm text-gray-700">{organization.address?.street || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">City</div>
                      <div className="text-sm text-gray-700">{organization.address?.city || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">State/Region</div>
                      <div className="text-sm text-gray-700">{organization.address?.state || "Not provided"}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">ZIP Code</div>
                      <div className="text-sm text-gray-700">{organization.address?.zipCode || "Not provided"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
                </div>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Disponibilité
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(organization.hours || {}).map(([day, hours]: [string, any]) => (
                        <div key={day} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium capitalize">{day}</div>
                          {!hours?.closed ? (
                            <>
                              <span className="text-sm">{hours?.open || "08:00"}</span>
                              <span className="text-muted-foreground">to</span>
                              <span className="text-sm">{hours?.close || "18:00"}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground text-sm">Fermé</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Carte
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LocationPicker
                      lat={organization.coordinates?.lat || 36.7948545}
                      lng={organization.coordinates?.lng || 10.7063772}
                      onLocationChange={handleLocationChange}
                      searchQuery=""
                      onSearchChange={() => {}}
                      onSearch={handleSearch}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rooms" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Salles
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RoomsManagement organizationId={organizationId} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}