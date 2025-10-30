"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Amenity {
  id: string;
  name: string;
  description?: string;
  category?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export function AmenitiesTable() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      const response = await fetch("/api/amenities");
      const data = await response.json();
      setAmenities(data.amenities || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch amenities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingAmenity ? "/api/amenities" : "/api/amenities";
      const method = editingAmenity ? "PUT" : "POST";
      const body = editingAmenity 
        ? { id: editingAmenity.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Amenity ${editingAmenity ? "updated" : "created"} successfully`,
        });
        setIsDialogOpen(false);
        setEditingAmenity(null);
        setFormData({ name: "", description: "", category: "" });
        fetchAmenities();
      } else {
        throw new Error("Failed to save amenity");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save amenity",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    setFormData({
      name: amenity.name,
      description: amenity.description || "",
      category: amenity.category || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;

    try {
      const response = await fetch(`/api/amenities?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Amenity deleted successfully",
        });
        fetchAmenities();
      } else {
        throw new Error("Failed to delete amenity");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete amenity",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", category: "" });
    setEditingAmenity(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Amenities</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Amenity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAmenity ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {amenities.map((amenity) => (
              <TableRow key={amenity.id}>
                <TableCell className="font-medium">{amenity.name}</TableCell>
                <TableCell>{amenity.category || "-"}</TableCell>
                <TableCell>{amenity.description || "-"}</TableCell>
                <TableCell>
                  <Badge variant={amenity.active ? "default" : "secondary"}>
                    {amenity.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(amenity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(amenity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}