import Link from "next/link";

import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HelpContact() {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-3xl font-bold lg:text-4xl">Besoin d'aide supplémentaire ?</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Notre équipe support est là pour vous aider. Choisissez le moyen de contact qui vous convient le mieux.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {/* Chat Support */}
          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <MessageCircle className="text-primary h-8 w-8" />
              </div>
              <CardTitle>Chat en direct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Discutez instantanément avec notre équipe support.</p>
              <div className="text-muted-foreground mb-4 flex items-center justify-center space-x-1 text-sm">
                <Clock className="h-4 w-4" />
                <span>Lun-Ven 9h-17h</span>
              </div>
              <Button className="w-full">Démarrer le chat</Button>
            </CardContent>
          </Card>

          {/* Phone Support */}
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <Phone className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Support téléphonique</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Appelez-nous pour une assistance immédiate.</p>
              <div className="text-muted-foreground mb-4 flex items-center justify-center space-x-1 text-sm">
                <Clock className="h-4 w-4" />
                <span>Lun-Ven 8h-18h</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:+21671123456">+216 71 123 456</a>
              </Button>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Support par email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Envoyez-nous un email détaillé de votre problème.</p>
              <div className="text-muted-foreground mb-4 flex items-center justify-center space-x-1 text-sm">
                <Clock className="h-4 w-4" />
                <span>Réponse sous 24h</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <Card className="from-primary/5 to-secondary/5 mx-auto max-w-2xl border-0 bg-gradient-to-br">
            <CardContent className="p-8">
              <h3 className="mb-4 text-2xl font-bold">Ressources supplémentaires</h3>
              <p className="text-muted-foreground mb-6">
                Consultez nos guides détaillés et tutoriels vidéo pour maîtriser toutes les fonctionnalités de SaaS
                Formation.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button variant="outline">Guides utilisateur</Button>
                <Button variant="outline">Tutoriels vidéo</Button>
                <Button variant="outline">API Documentation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
