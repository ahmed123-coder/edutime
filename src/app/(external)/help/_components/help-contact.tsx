import Link from "next/link";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpContact() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Besoin d'aide supplémentaire ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre équipe support est là pour vous aider. 
            Choisissez le moyen de contact qui vous convient le mieux.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Chat Support */}
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Chat en direct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Discutez instantanément avec notre équipe support.
              </p>
              <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>Lun-Ven 9h-17h</span>
              </div>
              <Button className="w-full">
                Démarrer le chat
              </Button>
            </CardContent>
          </Card>

          {/* Phone Support */}
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Support téléphonique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Appelez-nous pour une assistance immédiate.
              </p>
              <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>Lun-Ven 8h-18h</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:+21671123456">
                  +216 71 123 456
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Support par email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Envoyez-nous un email détaillé de votre problème.
              </p>
              <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4" />
                <span>Réponse sous 24h</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">
                  Nous contacter
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ressources supplémentaires</h3>
              <p className="text-muted-foreground mb-6">
                Consultez nos guides détaillés et tutoriels vidéo pour maîtriser 
                toutes les fonctionnalités de SaaS Formation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">
                  Guides utilisateur
                </Button>
                <Button variant="outline">
                  Tutoriels vidéo
                </Button>
                <Button variant="outline">
                  API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
