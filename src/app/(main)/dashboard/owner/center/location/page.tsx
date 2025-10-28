"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

import { MapPin, Navigation } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("./_components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-muted-foreground">Chargement de la carte...</p>
      </div>
    </div>
  ),
}) as React.ComponentType<{ organizations: Organization[] }>;

interface Organization {
   id: string;
   name: string;
   coordinates?: {
     lat: number;
     lng: number;
   };
   address?: {
     street?: string;
     city?: string;
     state?: string;
     country?: string;
   };
   members?: Array<{
     id: string;
     role: string;
     user: {
       id: string;
       name: string;
       email: string;
       avatar?: string;
     };
   }>;
 }

interface OrganizationListResponse {
  organizations: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function LocationPage() {
   const searchParams = useSearchParams();
   const { data: session } = useSession();
   const [organization, setOrganization] = useState<Organization | null>(null);
   const [organizations, setOrganizations] = useState<Organization[]>([]);
   const [ownedOrganizations, setOwnedOrganizations] = useState<Organization[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedOrgId, setSelectedOrgId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Always fetch all user's organizations
        const orgsResponse = await fetch('/api/organizations?page=1&limit=50');
        if (!orgsResponse.ok) throw new Error("Failed to fetch organizations");

        const orgsData: OrganizationListResponse = await orgsResponse.json();

        // Filter to only organizations where user is OWNER
        const ownedOrgs = orgsData.organizations.filter(org =>
          org.members?.some(member => member.user.id === session?.user?.id && member.role === 'OWNER')
        );

        setOrganizations(ownedOrgs);
        setOwnedOrganizations(ownedOrgs);

        // Check if orgId is provided in URL
        const orgId = searchParams.get('orgId');

        if (orgId) {
          // Fetch specific organization if provided in URL
          const response = await fetch(`/api/organizations/${orgId}`);
          if (response.ok) {
            const data = await response.json();
            // Check if user owns this organization
            if (ownedOrgs.some(org => org.id === orgId)) {
              setOrganization(data.organization);
              setSelectedOrgId(orgId);
            }
          }
        } else if (ownedOrgs.length > 0) {
          // No orgId in URL, select the first owned organization
          const firstOrg = ownedOrgs[0];
          setSelectedOrgId(firstOrg.id);

          // Fetch full organization details
          const orgResponse = await fetch(`/api/organizations/${firstOrg.id}`);
          if (orgResponse.ok) {
            const orgData = await orgResponse.json();
            setOrganization(orgData.organization);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [searchParams, session?.user?.id]);

  useEffect(() => {
    // When selectedOrgId changes (from organization selector), fetch that organization
    const fetchOrganization = async () => {
      if (!selectedOrgId || selectedOrgId === organization?.id || selectedOrgId === "all") return;

      try {
        setLoading(true);
        const response = await fetch(`/api/organizations/${selectedOrgId}`);
        if (!response.ok) throw new Error("Failed to fetch organization");

        const data = await response.json();
        setOrganization(data.organization);
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [selectedOrgId, organization?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading location...</div>
      </div>
    );
  }

  if (!organization) {
    // If no organization selected but user has organizations, show selector
    if (organizations.length > 1) {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="px-6 py-6">
            <div className="max-w-4xl mx-auto">
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
                      <SelectItem key="all" value="all">
                        Tous les organisations
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    // No organizations found
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-muted-foreground">
          <p className="mb-4">Aucune organisation trouvée</p>
          <p className="text-sm">Vous devez d'abord créer ou rejoindre une organisation.</p>
        </div>
      </div>
    );
  }

  const defaultLat = 36.7948545; // Tunis latitude
  const defaultLng = 10.7063772; // Tunis longitude
  const lat = organization.coordinates?.lat || defaultLat;
  const lng = organization.coordinates?.lng || defaultLng;

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h1 className="text-2xl font-bold">{selectedOrgId === "all" ? "Localisations des organisations" : "Localisation des organisations"}</h1>
            {selectedOrgId !== "all" && (
              <p className="text-muted-foreground mt-2">
                {organization?.name}
              </p>
            )}
          </div>

          {/* Organization Selector */}
          {organizations.length > 0 && (
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
                    <SelectItem key="all" value="all">
                      Tous les organisations
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Carte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MapComponent
                    organizations={selectedOrgId === "all" ? ownedOrganizations : organization ? [organization] : []}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Address Info */}
            <div>
              <Card className="h-96 overflow-y-auto">
                <CardHeader>
                  <CardTitle>{selectedOrgId === "all" ? "Adresses" : "Adresse"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedOrgId === "all" ? (
                    ownedOrganizations.map((org) => (
                      <div key={org.id} className="border-b pb-4 last:border-b-0">
                        <h4 className="font-medium">{org.name}</h4>
                        {org.address?.street && (
                          <p className="text-muted-foreground">{org.address.street}</p>
                        )}
                        <div className="text-sm text-muted-foreground">
                          {org.address?.city && <span>{org.address.city}</span>}
                          {org.address?.state && <span>, {org.address.state}</span>}
                          {org.address?.country && <span>, {org.address.country}</span>}
                        </div>
                        <div className="pt-2">
                          <h5 className="font-medium text-sm">Coordonnées</h5>
                          <p className="text-sm text-muted-foreground">
                            Latitude: {(org.coordinates?.lat || 36.7948545).toFixed(6)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Longitude: {(org.coordinates?.lng || 10.7063772).toFixed(6)}
                          </p>
                        </div>
                        <Button
                          className="w-full mt-2"
                          variant="outline"
                          onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${org.coordinates?.lat || 36.7948545},${org.coordinates?.lng || 10.7063772}`;
                            window.open(url, '_blank');
                          }}
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Obtenir l'itinéraire
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p className="font-medium">{organization?.name}</p>
                      {organization?.address?.street && (
                        <p className="text-muted-foreground">{organization.address.street}</p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {organization?.address?.city && <span>{organization.address.city}</span>}
                        {organization?.address?.state && <span>, {organization.address.state}</span>}
                        {organization?.address?.country && <span>, {organization.address.country}</span>}
                      </div>

                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Coordonnées</h4>
                        <p className="text-sm text-muted-foreground">
                          Latitude: {lat.toFixed(6)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Longitude: {lng.toFixed(6)}
                        </p>
                      </div>

                      <Button className="w-full mt-4" variant="outline" onClick={handleGetDirections}>
                        <Navigation className="mr-2 h-4 w-4" />
                        Obtenir l'itinéraire
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}