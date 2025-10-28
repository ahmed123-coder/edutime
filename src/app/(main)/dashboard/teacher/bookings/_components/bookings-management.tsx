"use client";

import { useState, useEffect } from "react";

import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Building2,
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
    limit: 12,
    total: 0,
    pages: 0,
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
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

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel booking");
      }

      toast.success("Booking cancelled successfully");
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
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

  const isUpcoming = (date: string, startTime: string) => {
    const bookingDateTime = new Date(`${date}T${startTime}`);
    return bookingDateTime > new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">Manage your training room bookings</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter your bookings by status and payment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
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
                <SelectItem value="">All payments</SelectItem>
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

      {/* Bookings Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-8 text-center">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="col-span-full py-8 text-center">No bookings found</div>
        ) : (
          bookings.map((booking) => (
            <Card key={booking.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.organization.logo} alt={booking.organization.name} />
                      <AvatarFallback>
                        <Building2 className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{booking.room.name}</CardTitle>
                      <p className="text-muted-foreground text-sm">{booking.organization.name}</p>
                    </div>
                  </div>
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
                      {booking.status === "PENDING" && (
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Booking
                        </DropdownMenuItem>
                      )}
                      {["PENDING", "CONFIRMED"].includes(booking.status) &&
                        isUpcoming(booking.date, booking.startTime) && (
                          <DropdownMenuItem onClick={() => handleDeleteBooking(booking.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Cancel Booking
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <div>
                    <div className="font-medium">{formatDate(booking.date)}</div>
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </div>
                  </div>
                </div>

                {/* Room Details */}
                <div className="text-sm">
                  <div className="mb-1 flex items-center gap-2">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <span>Capacity: {booking.room.capacity} people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                    <span>Rate: {formatCurrency(booking.room.hourlyRate)}/hour</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-lg font-bold">{formatCurrency(booking.totalAmount)}</span>
                  </div>
                  <div className="text-muted-foreground flex items-center justify-between text-sm">
                    <span>Platform fee:</span>
                    <span>{formatCurrency(booking.commission)}</span>
                  </div>
                </div>

                {/* Status and Payment */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                      {booking.status}
                    </Badge>
                    <Badge className={paymentStatusColors[booking.paymentStatus as keyof typeof paymentStatusColors]}>
                      {booking.paymentStatus.replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="text-muted-foreground text-xs">#{booking.id.slice(-8)}</span>
                </div>

                {/* Notes */}
                {booking.notes && (
                  <div className="text-sm">
                    <span className="font-medium">Notes: </span>
                    <span className="text-muted-foreground">{booking.notes}</span>
                  </div>
                )}

                {/* Cancel Reason */}
                {booking.cancelReason && (
                  <div className="text-sm">
                    <span className="font-medium text-red-600">Cancel Reason: </span>
                    <span className="text-muted-foreground">{booking.cancelReason}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-sm">
            Page {pagination.page} of {pagination.pages}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === pagination.pages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
