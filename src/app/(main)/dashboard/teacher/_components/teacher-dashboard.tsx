"use client";

import {
  Calendar,
  MapPin,
  Search,
  CreditCard,
  Clock,
  Star,
  BookOpen,
  Users,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Find and book the perfect spaces for your classes</p>
        </div>
        <Badge variant="secondary" className="border-green-200 bg-green-50 text-green-700">
          Teacher
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-blue-500" />
              Find Centers
            </CardTitle>
            <CardDescription>Search for training centers near you</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Search Now</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-500" />
              Quick Book
            </CardTitle>
            <CardDescription>Book your favorite spaces instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Book Space
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-purple-500" />
              My Classes
            </CardTitle>
            <CardDescription>Manage your current and upcoming classes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              View Classes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-muted-foreground text-xs">Next: Tomorrow 14:00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Centers</CardTitle>
            <Heart className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-muted-foreground text-xs">3 with availability</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-muted-foreground text-xs">Across all classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
            <CreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€847</div>
            <p className="text-muted-foreground text-xs">-5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bookings & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Upcoming Bookings
            </CardTitle>
            <CardDescription>Your next scheduled classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="w-16 text-center">
                <p className="text-sm font-medium">Tomorrow</p>
                <p className="text-muted-foreground text-xs">14:00</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="font-medium">Mathematics - Room A</p>
                </div>
                <p className="text-muted-foreground text-sm">TechSpace Tunis • 20 students</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Confirmed
              </Badge>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="w-16 text-center">
                <p className="text-sm font-medium">Friday</p>
                <p className="text-muted-foreground text-xs">10:00</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <p className="font-medium">Physics Lab - Lab 2</p>
                </div>
                <p className="text-muted-foreground text-sm">Formation Excellence • 15 students</p>
              </div>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700">
                Pending
              </Badge>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-3">
              <div className="w-16 text-center">
                <p className="text-sm font-medium">Monday</p>
                <p className="text-muted-foreground text-xs">09:00</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <p className="font-medium">Workshop - Conference Room</p>
                </div>
                <p className="text-muted-foreground text-sm">EduCenter Sfax • 30 participants</p>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                Confirmed
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              Recommended Centers
            </CardTitle>
            <CardDescription>Centers that match your preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Innovation Hub Tunis</p>
                  <p className="text-muted-foreground text-sm">2.3 km away • Available today</p>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-muted-foreground ml-1 text-xs">(4.8)</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">TechSpace Ariana</p>
                  <p className="text-muted-foreground text-sm">5.1 km away • Available tomorrow</p>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="h-3 w-3 text-gray-300" />
                    <span className="text-muted-foreground ml-1 text-xs">(4.2)</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Formation Plus Manouba</p>
                  <p className="text-muted-foreground text-sm">8.7 km away • Available this week</p>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="h-3 w-3 text-gray-300" />
                    <span className="text-muted-foreground ml-1 text-xs">(4.0)</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
