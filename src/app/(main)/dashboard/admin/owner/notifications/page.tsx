"use client";

import { useState } from "react";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouvelle réservation",
      message: "Un professeur a réservé une salle pour le 25 octobre.",
      type: "info",
      read: false,
      date: "2025-10-22",
    },
    {
      id: 2,
      title: "Paiement reçu",
      message: "Votre abonnement Pro a été renouvelé avec succès.",
      type: "success",
      read: false,
      date: "2025-10-20",
    },
    {
      id: 3,
      title: "Salle indisponible",
      message: "La salle A-12 est en maintenance jusqu’au 28 octobre.",
      type: "warning",
      read: true,
      date: "2025-10-19",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500 h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="text-yellow-500 h-5 w-5" />;
      default:
        return <Info className="text-blue-500 h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        </div>
        <Button variant="outline" onClick={markAllAsRead}>
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
                  {new Date(notif.date).toLocaleDateString("fr-FR")}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
