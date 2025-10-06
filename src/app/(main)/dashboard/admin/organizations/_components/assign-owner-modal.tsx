"use client";

import { useState, useEffect } from "react";

import { Search, UserPlus, X, Crown, User } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  speciality?: string;
  createdAt: string;
  organizations: {
    role: string;
    organization: {
      id: string;
      name: string;
    };
  }[];
}

interface Organization {
  id: string;
  name: string;
}

interface AssignOwnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization: Organization | null;
  onOwnerAssigned: () => void;
}

export function AssignOwnerModal({ open, onOpenChange, organization, onOwnerAssigned }: AssignOwnerModalProps) {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<{
    available: User[];
    currentOwners: User[];
    currentNonOwners: User[];
  }>({
    available: [],
    currentOwners: [],
    currentNonOwners: [],
  });

  const fetchAvailableUsers = async () => {
    if (!organization) return;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`/api/organizations/${organization.id}/available-owners?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch available users");
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching available users:", error);
      toast.error("Failed to fetch available users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && organization) {
      fetchAvailableUsers();
    }
  }, [open, organization, search]);

  const handleAssignOwner = async (userId: string) => {
    if (!organization) return;

    try {
      const response = await fetch(`/api/organizations/${organization.id}/assign-owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign owner");
      }

      const data = await response.json();
      toast.success(data.message);
      onOwnerAssigned();
      fetchAvailableUsers(); // Refresh the lists
    } catch (error) {
      console.error("Error assigning owner:", error);
      toast.error(error instanceof Error ? error.message : "Failed to assign owner");
    }
  };

  const handleRemoveOwner = async (userId: string) => {
    if (!organization) return;

    try {
      const response = await fetch(`/api/organizations/${organization.id}/assign-owner?userId=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove owner");
      }

      const data = await response.json();
      toast.success(data.message);
      onOwnerAssigned();
      fetchAvailableUsers(); // Refresh the lists
    } catch (error) {
      console.error("Error removing owner:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove owner");
    }
  };

  const UserCard = ({ user, isOwner = false, canPromote = false }: { user: User; isOwner?: boolean; canPromote?: boolean }) => (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">{user.name}</p>
            {isOwner && <Crown className="h-4 w-4 text-yellow-500" />}
          </div>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          {user.speciality && <p className="text-muted-foreground text-xs">{user.speciality}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isOwner ? (
          <Button variant="outline" size="sm" onClick={() => handleRemoveOwner(user.id)}>
            <X className="mr-1 h-3 w-3" />
            Remove
          </Button>
        ) : (
          <Button
            variant={canPromote ? "secondary" : "default"}
            size="sm"
            onClick={() => handleAssignOwner(user.id)}
          >
            <UserPlus className="mr-1 h-3 w-3" />
            {canPromote ? "Promote" : "Assign"}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Center Owner</DialogTitle>
          <DialogDescription>
            {organization ? `Manage owners for ${organization.name}` : "Select an organization first"}
          </DialogDescription>
        </DialogHeader>

        {organization && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {/* Current Owners */}
                {users.currentOwners.length > 0 && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <h4 className="font-medium">Current Owners</h4>
                      <Badge variant="secondary">{users.currentOwners.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {users.currentOwners.map((user) => (
                        <UserCard key={user.id} user={user} isOwner />
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Non-Owner Members */}
                {users.currentNonOwners.length > 0 && (
                  <>
                    {users.currentOwners.length > 0 && <Separator />}
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <h4 className="font-medium">Current Members</h4>
                        <Badge variant="outline">{users.currentNonOwners.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {users.currentNonOwners.map((user) => (
                          <UserCard key={user.id} user={user} canPromote />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Available Users */}
                {users.available.length > 0 && (
                  <>
                    {(users.currentOwners.length > 0 || users.currentNonOwners.length > 0) && <Separator />}
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        <h4 className="font-medium">Available Center Owners</h4>
                        <Badge variant="outline">{users.available.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {users.available.map((user) => (
                          <UserCard key={user.id} user={user} />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* No results */}
                {!loading && users.available.length === 0 && users.currentOwners.length === 0 && users.currentNonOwners.length === 0 && (
                  <div className="text-muted-foreground py-8 text-center">
                    <UserPlus className="mx-auto mb-2 h-8 w-8" />
                    <p>No users found</p>
                    <p className="text-sm">Try adjusting your search or check if there are any CENTER_OWNER role users.</p>
                  </div>
                )}

                {loading && (
                  <div className="text-muted-foreground py-8 text-center">
                    <p>Loading users...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
