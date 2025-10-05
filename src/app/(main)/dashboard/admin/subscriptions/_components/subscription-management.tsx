'use client';

import { useState, useEffect } from 'react';
import { Plus, Package, Users, Calendar, DollarSign } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PackageManagement } from './package-management';
import { SubscriptionList } from './subscription-list';
import { CreatePackageModal } from './create-package-modal';
import { AssignSubscriptionModal } from './assign-subscription-modal';

interface Stats {
  totalPackages: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  expiringThisMonth: number;
}

export function SubscriptionManagement() {
  const [stats, setStats] = useState<Stats>({
    totalPackages: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    expiringThisMonth: 0,
  });
  const [createPackageOpen, setCreatePackageOpen] = useState(false);
  const [assignSubscriptionOpen, setAssignSubscriptionOpen] = useState(false);

  const fetchStats = async () => {
    try {
      // This would be implemented in a real API endpoint
      // For now, using mock data
      setStats({
        totalPackages: 3,
        activeSubscriptions: 25,
        monthlyRevenue: 15000,
        expiringThisMonth: 5,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage subscription packages and organization subscriptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCreatePackageOpen(true)}>
            <Package className="h-4 w-4 mr-2" />
            Create Package
          </Button>
          <Button onClick={() => setAssignSubscriptionOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Assign Subscription
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPackages}</div>
            <p className="text-xs text-muted-foreground">
              Available subscription plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Currently active subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyRevenue.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">
              Total monthly recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Subscriptions expiring this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="packages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <PackageManagement onPackageCreated={fetchStats} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionList onSubscriptionAssigned={fetchStats} />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <CreatePackageModal
        open={createPackageOpen}
        onOpenChange={setCreatePackageOpen}
        onPackageCreated={fetchStats}
      />

      <AssignSubscriptionModal
        open={assignSubscriptionOpen}
        onOpenChange={setAssignSubscriptionOpen}
        onSubscriptionAssigned={fetchStats}
      />
    </div>
  );
}
