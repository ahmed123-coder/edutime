"use client";

import { useState, useEffect } from "react";

import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInitials } from "@/lib/utils";

interface Booking {
  id: string;
  organizationId: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  commission: number;
  status: string;
  paymentMethod?: string;
  paymentStatus: string;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  room: {
    id: string;
    name: string;
    capacity: number;
    hourlyRate: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface BookingsResponse {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  NO_SHOW: "bg-gray-100 text-gray-800",
};

const paymentStatusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-purple-100 text-purple-800",
  PARTIAL_REFUND: "bg-orange-100 text-orange-800",
};

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(statusFilter && { status: statusFilter }),
        ...(paymentStatusFilter && { paymentStatus: paymentStatusFilter }),
      });

      const response = await fetch(`/api/bookings?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data: BookingsResponse = await response.json();
      setBookings(data.bookings);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, statusFilter, paymentStatusFilter]);

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update booking");
      }

      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update booking");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // Remove seconds
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings Management</h1>
          <p className="text-muted-foreground">Manage bookings for your training centers</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter bookings by status and payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-statuses">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="NO_SHOW">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-payments">All payments</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
                <SelectItem value="PARTIAL_REFUND">Partial Refund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bookings ({pagination.total})</CardTitle>
          <CardDescription>
            Showing {bookings.length} of {pagination.total} bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    Loading bookings...
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={booking.user.avatar} alt={booking.user.name} />
                          <AvatarFallback>{getInitials(booking.user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{booking.user.name}</div>
                          <div className="text-muted-foreground text-sm">{booking.user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.room.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {booking.room.capacity} people • {formatCurrency(booking.room.hourlyRate)}/hr
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="text-muted-foreground h-4 w-4" />
                        <div>
                          <div className="font-medium">{formatDate(booking.date)}</div>
                          <div className="text-muted-foreground flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="text-muted-foreground h-4 w-4" />
                        <div>
                          <div className="font-medium">{formatCurrency(booking.totalAmount)}</div>
                          <div className="text-muted-foreground text-sm">
                            Commission: {formatCurrency(booking.commission)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={paymentStatusColors[booking.paymentStatus as keyof typeof paymentStatusColors]}>
                        {booking.paymentStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.notes ? (
                        <div className="text-muted-foreground line-clamp-2 max-w-[200px] text-sm">{booking.notes}</div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2">
                        {booking.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                              className="border-green-600 text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                Page {pagination.page} of {pagination.pages}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
