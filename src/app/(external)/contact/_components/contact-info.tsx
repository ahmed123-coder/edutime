import { Phone, Mail, MapPin, Clock, MessageCircle, Headphones } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const contactMethods = [
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez-nous directement",
    value: "+216 71 123 456",
    action: "tel:+21671123456",
    available: "Lun-Ven 8h-18h",
  },
  {
    icon: Mail,
    title: "Email",
    description: "Écrivez-nous",
    value: "contact@saasformation.tn",
    action: "mailto:contact@saasformation.tn",
    available: "Réponse sous 24h",
  },
  {
    icon: MessageCircle,
    title: "Chat en direct",
    description: "Support instantané",
    value: "Démarrer une conversation",
    action: "#",
    available: "Lun-Ven 9h-17h",
  },
];

const officeHours = [
  { day: "Lundi - Vendredi", hours: "8h00 - 18h00" },
  { day: "Samedi", hours: "9h00 - 13h00" },
  { day: "Dimanche", hours: "Fermé" },
];

export function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Headphones className="mr-2 h-5 w-5" />
            Moyens de contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className="hover:bg-muted/50 flex items-start space-x-4 rounded-lg border p-4 transition-colors"
            >
              <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                <method.icon className="text-primary h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-medium">{method.title}</h3>
                <p className="text-muted-foreground mb-2 text-sm">{method.description}</p>
                <a href={method.action} className="text-primary font-medium hover:underline">
                  {method.value}
                </a>
                <p className="text-muted-foreground mt-1 text-xs">{method.available}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Office Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Horaires de support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {officeHours.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{schedule.day}</span>
                <span className="text-sm font-medium">{schedule.hours}</span>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 mt-4 rounded-lg p-3">
            <p className="text-muted-foreground text-sm">
              <strong>Support d'urgence :</strong> Pour les problèmes critiques, contactez-nous par email. Nous
              répondons dans l'heure pendant les heures ouvrables.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Office Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Notre bureau
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-medium">SaaS Formation</p>
              <p className="text-muted-foreground">
                Avenue Habib Bourguiba
                <br />
                1000 Tunis, Tunisie
              </p>
            </div>

            <Button variant="outline" className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              Voir sur Google Maps
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
