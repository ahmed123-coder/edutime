"use client";

import { useState, useEffect } from "react";

import { Edit, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Package {
  id: string;
  name: string;
  plan: string;
  description?: string;
  price: number;
  billingPeriod: string;
  features: string[];
  limits: {
    maxRooms: number;
    maxBookingsPerMonth: number;
    maxMembers: number;
  };
  active: boolean;
  _count: {
    subscriptions: number;
  };
}

interface PackageManagementProps {
  onPackageCreated: () => void;
}

const planColors = {
  ESSENTIAL: "bg-green-100 text-green-800",
  PRO: "bg-blue-100 text-blue-800",
  PREMIUM: "bg-purple-100 text-purple-800",
};

export function PackageManagement({ onPackageCreated }: PackageManagementProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/subscription-packages");

      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }

      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const formatPrice = (price: number, period: string) => {
    const periodText = period.toLowerCase().replace("ly", "");
    return `${price.toLocaleString()} TND/${periodText}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Packages</CardTitle>
        <CardDescription>Manage available subscription packages and their features</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Limits</TableHead>
              <TableHead>Subscribers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  Loading packages...
                </TableCell>
              </TableRow>
            ) : packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  No packages found
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pkg.name}</div>
                      {pkg.description && <div className="text-muted-foreground text-sm">{pkg.description}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={planColors[pkg.plan as keyof typeof planColors]}>{pkg.plan}</Badge>
                  </TableCell>
                  <TableCell>{formatPrice(pkg.price, pkg.billingPeriod)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{pkg.limits.maxRooms} rooms</div>
                      <div>{pkg.limits.maxBookingsPerMonth} bookings/month</div>
                      <div>{pkg.limits.maxMembers} members</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="text-muted-foreground h-4 w-4" />
                      {pkg._count.subscriptions}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={pkg.active ? "default" : "secondary"}>{pkg.active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Package
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Package
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
