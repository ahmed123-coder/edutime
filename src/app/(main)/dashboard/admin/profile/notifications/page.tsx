"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, CheckCircle, Info, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const userId = searchParams.get('userId');

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const url = userId ? `/api/notifications?userId=${userId}` : '/api/notifications';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setUpdating(true);
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) throw new Error('Failed to update notifications');
      
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les notifications",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "PAYMENT_RECEIVED":
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case "BOOKING_CANCELLED":
        return <AlertTriangle className="text-yellow-500 h-5 w-5" />;
      case "BOOKING_CONFIRMED":
        return <CheckCircle className="text-blue-500 h-5 w-5" />;
      default:
        return <Info className="text-blue-500 h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={updating}>
          {updating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : null}
          Tout marquer comme lu
        </Button>
      </div>

      {/* Notifications list */}
      <div className="grid gap-4">
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            Aucune notification pour le moment.
          </p>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`border ${
                notif.read ? "opacity-70" : "border-primary"
              } transition`}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  {getIcon(notif.type)}
                  <CardTitle className="text-base">{notif.title}</CardTitle>
                </div>
                <Badge
                  variant={notif.read ? "secondary" : "default"}
                  className="text-xs"
                >
                  {notif.read ? "Lu" : "Nouveau"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {notif.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notif.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}