"use client";

import { Calendar, Users, MapPin, CreditCard, TrendingUp, Clock, Star, AlertCircle, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OwnerDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Center Dashboard</h1>
          <p className="text-muted-foreground">Manage your training center and bookings</p>
        </div>
        <Badge variant="secondary" className="border-blue-200 bg-blue-50 text-blue-700">
          Center Owner
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-muted-foreground text-xs">3 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-muted-foreground text-xs">+2 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-muted-foreground text-xs">+5% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€3,247</div>
            <p className="text-muted-foreground text-xs">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Pending Items */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Booking requests awaiting your response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Room A - Mathematics Class</p>
                <p className="text-muted-foreground text-sm">Tomorrow 14:00-16:00 • Prof. Ahmed</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Decline
                </Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Room B - Physics Lab</p>
                <p className="text-muted-foreground text-sm">Friday 10:00-12:00 • Dr. Fatma</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Decline
                </Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Conference Room - Workshop</p>
                <p className="text-muted-foreground text-sm">Next Monday 09:00-17:00 • Prof. Karim</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Decline
                </Button>
                <Button size="sm">Approve</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Recent Reviews
            </CardTitle>
            <CardDescription>Latest feedback from teachers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Prof. Ahmed Ben Ali</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                "Excellent facilities and very responsive management. The room was perfectly set up for my mathematics
                course."
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">Dr. Fatma Mansouri</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-3 w-3 text-gray-300" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                "Good location and clean facilities. Would appreciate better parking options."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Overview of all bookings for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="w-16 text-center">
                <p className="text-sm font-medium">09:00</p>
                <p className="text-muted-foreground text-xs">11:00</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="font-medium">Room A - English Literature</p>
                </div>
                <p className="text-muted-foreground text-sm">Prof. Sarah Johnson • 15 students</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Confirmed
              </Badge>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="w-16 text-center">
                <p className="text-sm font-medium">14:00</p>
                <p className="text-muted-foreground text-xs">16:00</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <p className="font-medium">Room B - Mathematics</p>
                </div>
                <p className="text-muted-foreground text-sm">Prof. Ahmed Ben Ali • 20 students</p>
              </div>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                Pending
              </Badge>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="w-16 text-center">
                <p className="text-sm font-medium">18:00</p>
                <p className="text-muted-foreground text-xs">20:00</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="font-medium">Conference Room - Business Workshop</p>
                </div>
                <p className="text-muted-foreground text-sm">Dr. Karim Trabelsi • 30 participants</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Confirmed
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
