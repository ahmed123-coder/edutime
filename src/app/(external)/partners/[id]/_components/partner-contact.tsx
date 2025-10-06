"use client";

import { useState } from "react";

import { Phone, Mail, Globe, MessageCircle, Send, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface PartnerContactProps {
  partner: {
    name: string;
    phone: string;
    email: string;
    website: string;
  };
}

export function PartnerContact({ partner }: PartnerContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would send the contact request
    console.log("Contact request:", formData);
    alert("Demande envoyée !");
    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contacter ce partenaire</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Votre nom"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+216 XX XXX XXX"
              />
            </div>

            <div>
              <Label htmlFor="service">Service d'intérêt</Label>
              <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez un service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formation-react">Formation React & Next.js</SelectItem>
                  <SelectItem value="audit-securite">Audit Sécurité IT</SelectItem>
                  <SelectItem value="transformation-digitale">Transformation Digitale</SelectItem>
                  <SelectItem value="autre">Autre service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                required
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="Décrivez votre projet ou vos besoins..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!formData.name || !formData.email || !formData.message}>
              <Send className="mr-2 h-4 w-4" />
              Envoyer la demande
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Direct Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact direct</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <a
            href={`tel:${partner.phone}`}
            className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg p-3 transition-colors"
          >
            <Phone className="text-primary h-5 w-5" />
            <div>
              <div className="font-medium">Téléphone</div>
              <div className="text-muted-foreground text-sm">{partner.phone}</div>
            </div>
          </a>

          <a
            href={`mailto:${partner.email}`}
            className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg p-3 transition-colors"
          >
            <Mail className="text-primary h-5 w-5" />
            <div>
              <div className="font-medium">Email</div>
              <div className="text-muted-foreground text-sm">{partner.email}</div>
            </div>
          </a>

          <a
            href={`https://${partner.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg p-3 transition-colors"
          >
            <Globe className="text-primary h-5 w-5" />
            <div>
              <div className="font-medium">Site web</div>
              <div className="text-muted-foreground text-sm">{partner.website}</div>
            </div>
          </a>

          <Separator />

          <div className="text-muted-foreground flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>Temps de réponse moyen: 4-6 heures</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat en direct
            </Button>
            <Button variant="outline" className="w-full">
              Demander un devis
            </Button>
            <Button variant="outline" className="w-full">
              Planifier un appel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-center">
          <div className="text-muted-foreground text-sm">
            <div className="mb-1 font-medium">Partenaire vérifié</div>
            <div>✓ Identité vérifiée</div>
            <div>✓ Assurance professionnelle</div>
            <div>✓ Références clients</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
