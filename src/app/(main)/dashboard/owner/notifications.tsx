"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function OwnerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "BOOKING_CONFIRMED",
        title: "Nouvelle réservation",
        message: "Une nouvelle réservation a été effectuée pour la salle Formation A",
        read: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2", 
        type: "PAYMENT_RECEIVED",
        title: "Paiement reçu",
        message: "Paiement de 75€ reçu pour la réservation du 15 janvier",
        read: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "3",
        type: "REVIEW_RECEIVED", 
        title: "Nouvel avis client",
        message: "Un client a laissé un avis 4 étoiles sur votre centre",
        read: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "BOOKING_CONFIRMED": return "bg-green-100 text-green-800";
      case "PAYMENT_RECEIVED": return "bg-blue-100 text-blue-800";
      case "REVIEW_RECEIVED": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Notifications</h1>
          <p className="text-muted-foreground">Vos notifications de centre</p>
        </div>
        <Badge variant="secondary">
          {unreadCount} non lues
        </Badge>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={!notification.read ? "border-l-4 border-l-blue-500" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-base">{notification.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getTypeColor(notification.type)}>
                        {notification.type.replace("_", " ")}
                      </Badge>
                      <span>
                        {formatDistanceToNow(new Date(notification.createdAt), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune notification</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}