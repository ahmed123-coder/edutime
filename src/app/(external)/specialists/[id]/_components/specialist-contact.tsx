"use client";

import { useState } from "react";
import { Phone, Mail, Linkedin, MessageCircle, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface SpecialistContactProps {
  specialist: {
    hourlyRate: number;
    phone: string;
    email: string;
    linkedin: string;
  };
}

export function SpecialistContact({ specialist }: SpecialistContactProps) {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");

  const handleContact = () => {
    // In real app, this would send a message
    console.log("Contact message:", { subject, message });
    alert("Message envoyé !");
    setMessage("");
    setSubject("");
  };

  return (
    <div className="space-y-6">
      {/* Pricing */}
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <DollarSign className="h-5 w-5 text-primary mr-2" />
            <span className="text-2xl font-bold">{specialist.hourlyRate} DT</span>
            <span className="text-muted-foreground ml-1">/heure</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Tarif de formation
          </p>
          <Button className="w-full" size="lg">
            <MessageCircle className="h-4 w-4 mr-2" />
            Demander un devis
          </Button>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Contacter le spécialiste</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subject">Sujet</Label>
            <Input
              id="subject"
              placeholder="Objet de votre message"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Décrivez votre projet de formation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button 
            onClick={handleContact} 
            className="w-full"
            disabled={!subject || !message}
          >
            Envoyer le message
          </Button>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <a 
              href={`tel:${specialist.phone}`}
              className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{specialist.phone}</span>
            </a>
            
            <a 
              href={`mailto:${specialist.email}`}
              className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4" />
              <span>{specialist.email}</span>
            </a>
            
            <a 
              href={`https://${specialist.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span>Profil LinkedIn</span>
            </a>
          </div>
          
          <Separator />
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Temps de réponse moyen: 2-4 heures
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
