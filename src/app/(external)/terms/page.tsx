import { Metadata } from "next";
import { FileText, Users, CreditCard, Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | SaaS Formation",
  description: "Consultez les conditions générales d'utilisation de la plateforme SaaS Formation.",
  keywords: "CGU, conditions générales, utilisation, SaaS Formation, termes",
};

const highlights = [
  {
    icon: Users,
    title: "Utilisation de la plateforme",
    description: "Règles d'utilisation et responsabilités des utilisateurs"
  },
  {
    icon: CreditCard,
    title: "Conditions de paiement",
    description: "Modalités de paiement, remboursements et facturation"
  },
  {
    icon: Shield,
    title: "Responsabilités",
    description: "Limitations de responsabilité et garanties"
  },
  {
    icon: FileText,
    title: "Propriété intellectuelle",
    description: "Droits d'auteur et utilisation du contenu"
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Conditions générales d'utilisation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Les présentes conditions régissent l'utilisation de la plateforme SaaS Formation.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Dernière mise à jour : 1er janvier 2024
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {highlights.map((item, index) => (
            <Card key={index}>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Terms Content */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Objet</h2>
                <p className="text-muted-foreground">
                  Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation 
                  de la plateforme SaaS Formation, service de mise en relation entre centres de formation 
                  et utilisateurs, exploité par SaaS Formation SARL.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Acceptation des conditions</h2>
                <p className="text-muted-foreground">
                  L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU. 
                  Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Description des services</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>SaaS Formation propose :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Une plateforme de recherche et réservation d'espaces de formation</li>
                    <li>Un système de paiement sécurisé</li>
                    <li>Des outils de gestion pour les centres partenaires</li>
                    <li>Un service client et support technique</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Inscription et compte utilisateur</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>4.1 Conditions d'inscription :</strong> L'inscription est ouverte à toute personne 
                    physique ou morale ayant la capacité juridique de contracter.
                  </p>
                  <p>
                    <strong>4.2 Informations exactes :</strong> Vous vous engagez à fournir des informations 
                    exactes et à les maintenir à jour.
                  </p>
                  <p>
                    <strong>4.3 Sécurité du compte :</strong> Vous êtes responsable de la confidentialité 
                    de vos identifiants de connexion.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Utilisation de la plateforme</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>Vous vous engagez à :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Utiliser la plateforme conformément à sa destination</li>
                    <li>Ne pas porter atteinte aux droits des tiers</li>
                    <li>Ne pas diffuser de contenu illicite ou inapproprié</li>
                    <li>Respecter les conditions d'utilisation des centres partenaires</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Réservations et paiements</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>6.1 Réservations :</strong> Les réservations sont fermes et définitives 
                    après confirmation et paiement.
                  </p>
                  <p>
                    <strong>6.2 Prix :</strong> Les prix sont indiqués en dinars tunisiens (DT) 
                    toutes taxes comprises.
                  </p>
                  <p>
                    <strong>6.3 Paiement :</strong> Le paiement s'effectue en ligne par les moyens 
                    proposés sur la plateforme.
                  </p>
                  <p>
                    <strong>6.4 Commission :</strong> SaaS Formation perçoit une commission de 10% 
                    sur chaque réservation.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Annulation et remboursement</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>7.1 Annulation gratuite :</strong> Possible jusqu'à 24 heures avant 
                    la date de réservation.
                  </p>
                  <p>
                    <strong>7.2 Annulation tardive :</strong> Peut entraîner des frais selon 
                    les conditions du centre.
                  </p>
                  <p>
                    <strong>7.3 Remboursement :</strong> Effectué sous 7 jours ouvrables 
                    sur le moyen de paiement utilisé.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Responsabilité</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    SaaS Formation agit en qualité d'intermédiaire. La responsabilité concernant 
                    la prestation de formation incombe au centre partenaire. Notre responsabilité 
                    est limitée au montant de la transaction concernée.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Propriété intellectuelle</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Tous les éléments de la plateforme (textes, images, logos, etc.) sont protégés 
                    par le droit d'auteur. Toute reproduction non autorisée est interdite.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Modification des CGU</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    SaaS Formation se réserve le droit de modifier les présentes CGU à tout moment. 
                    Les utilisateurs seront informés des modifications par email ou notification 
                    sur la plateforme.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">11. Droit applicable et juridiction</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Les présentes CGU sont soumises au droit tunisien. En cas de litige, 
                    les tribunaux de Tunis sont seuls compétents.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p><strong>SaaS Formation SARL</strong></p>
                  <p>Avenue Habib Bourguiba, 1000 Tunis, Tunisie</p>
                  <p>Email : legal@saasformation.tn</p>
                  <p>Téléphone : +216 71 123 456</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
