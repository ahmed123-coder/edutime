"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Phone, Mail, Globe, Clock, Save, ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomsManagement } from "./rooms-management";

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
}

interface EditOrganizationProfileProps {
  organizationId: string;
}

export function EditOrganizationProfile({ organizationId }: EditOrganizationProfileProps) {
  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    type: "",
    phone: "",
    email: "",
    website: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Tunisia"
    },
    verified: false,
    active: true,
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

  useEffect(() => {
    fetchOrganization();
  }, [organizationId]);

  const fetchOrganization = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}`);
      if (!response.ok) throw new Error("Failed to fetch organization");
      
      const data = await response.json();
      setOrganization(data.organization);
      setFormData({
        name: data.organization.name || "",
        logo: data.organization.logo || "",
        description: data.organization.description || "",
        type: data.organization.type || "",
        phone: data.organization.phone || "",
        email: data.organization.email || "",
        website: data.organization.website || "",
        address: {
          street: data.organization.address?.street || "",
          city: data.organization.address?.city || "",
          state: data.organization.address?.state || "",
          zipCode: data.organization.address?.zipCode || "",
          country: data.organization.address?.country || "Tunisia"
        },
        verified: data.organization.verified || false,
        active: data.organization.active || true,
        hours: data.organization.hours || {
          monday: { open: "08:00", close: "18:00", closed: false },
          tuesday: { open: "08:00", close: "18:00", closed: false },
          wednesday: { open: "08:00", close: "18:00", closed: false },
          thursday: { open: "08:00", close: "18:00", closed: false },
          friday: { open: "08:00", close: "18:00", closed: false },
          saturday: { open: "08:00", close: "18:00", closed: false },
          sunday: { open: "08:00", close: "18:00", closed: true }
        }
      });
    } catch (error) {
      toast.error("Failed to load organization");
      router.push("/dashboard/admin/organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
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

      // Update local state
      setFormData({ ...formData, logo: data.url });
      setOrganization(prev => prev ? { ...prev, logo: data.url } : null);

      // Save to database immediately
      const updateResponse = await fetch(`/api/organizations/${organizationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: data.url })
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to save avatar to database");
      }

      toast.success("Avatar uploaded and saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/organizations/${organizationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to update organization");

      toast.success("Organization updated successfully");
      router.push("/dashboard/admin/organizations");
    } catch (error) {
      toast.error("Failed to update organization");
    } finally {
      setSaving(false);
    }
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
            onClick={() => router.push("/dashboard/admin/organizations")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Organizations
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
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

            {/* Basic Info */}
            <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-2xl font-bold border-0 px-0 focus-visible:ring-0"
                  />
                </div>
                <div className="flex gap-2">
                  <Badge variant={formData.type === "TRAINING_CENTER" ? "default" : "secondary"}>
                    {formData.type.replace("_", " ")}
                  </Badge>
                  <Badge variant={organization.subscription === "PRO" ? "default" : "secondary"}>
                    {organization.subscription}
                  </Badge>
                  <Badge variant={formData.verified ? "default" : "destructive"}>
                    {formData.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tell us about your organization..."
                    className="resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-8">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">Informations générales</TabsTrigger>
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
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email address"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="Website URL"
                    />
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
                    <Label htmlFor="type">Organization Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TRAINING_CENTER">Training Center</SelectItem>
                        <SelectItem value="PARTNER_SERVICE">Partner Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="verified">Verified Status</Label>
                    <Switch
                      id="verified"
                      checked={formData.verified}
                      onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Active Status</Label>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
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
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={formData.address.street}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, street: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, city: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Region</Label>
                      <Input
                        id="state"
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, state: e.target.value }
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          address: { ...formData.address, zipCode: e.target.value }
                        })}
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
                    Operating Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(formData.hours || {}).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium capitalize">{day}</div>
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
                            <span className="text-muted-foreground">to</span>
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
                          <span className="text-muted-foreground text-sm">Closed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rooms" className="mt-6">
                <RoomsManagement organizationId={organizationId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}