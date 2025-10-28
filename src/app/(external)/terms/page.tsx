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
    description: "Règles d'utilisation et responsabilités des utilisateurs",
  },
  {
    icon: CreditCard,
    title: "Conditions de paiement",
    description: "Modalités de paiement, remboursements et facturation",
  },
  {
    icon: Shield,
    title: "Responsabilités",
    description: "Limitations de responsabilité et garanties",
  },
  {
    icon: FileText,
    title: "Propriété intellectuelle",
    description: "Droits d'auteur et utilisation du contenu",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Conditions générales d'utilisation</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Les présentes conditions régissent l'utilisation de la plateforme SaaS Formation.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">Dernière mise à jour : 1er janvier 2024</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Highlights */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <Card key={index}>
              <CardHeader className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <item.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Terms Content */}
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="space-y-8 p-8">
              <section>
                <h2 className="mb-4 text-2xl font-bold">1. Objet</h2>
                <p className="text-muted-foreground">
                  Les présentes conditions générales d'utilisation (CGU) régissent l'accès et l'utilisation plateforme
                  SaaS Formation, service de mise en relation entre centres de formation et utilisateurs, exploité par
                  SaaS Formation SARL.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">2. Acceptation des conditions</h2>
                <p className="text-muted-foreground">
                  L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU. n'acceptez
                  pas ces conditions, vous ne devez pas utiliser nos services.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">3. Description des services</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>SaaS Formation propose :</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Une plateforme de recherche et réservation d'espaces de formation</li>
                    <li>Un système de paiement sécurisé</li>
                    <li>Des outils de gestion pour les centres partenaires</li>
                    <li>Un service client et support technique</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">4. Inscription et compte utilisateur</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong>4.1 Conditions d'inscription :</strong> L'inscription est ouverte à toute personne ou morale
                    ayant la capacité juridique de contracter.
                  </p>
                  <p>
                    <strong>4.2 Informations exactes :</strong> Vous vous engagez à fournir des informations à les
                    maintenir à jour.
                  </p>
                  <p>
                    <strong>4.3 Sécurité du compte :</strong> Vous êtes responsable de la confidentialité identifiants
                    de connexion.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">5. Utilisation de la plateforme</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>Vous vous engagez à :</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Utiliser la plateforme conformément à sa destination</li>
                    <li>Ne pas porter atteinte aux droits des tiers</li>
                    <li>Ne pas diffuser de contenu illicite ou inapproprié</li>
                    <li>Respecter les conditions d'utilisation des centres partenaires</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">6. Réservations et paiements</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong>6.1 Réservations :</strong> Les réservations sont fermes et définitives et paiement.
                  </p>
                  <p>
                    <strong>6.2 Prix :</strong> Les prix sont indiqués en dinars tunisiens (DT) toutes taxes comprises.
                  </p>
                  <p>
                    <strong>6.3 Paiement :</strong> Le paiement s'effectue en ligne par les moyens proposés sur la
                    plateforme.
                  </p>
                  <p>
                    <strong>6.4 Commission :</strong> SaaS Formation perçoit une commission de 10% réservation.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">7. Annulation et remboursement</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong>7.1 Annulation gratuite :</strong> Possible jusqu'à 24 heures avant la date de réservation.
                  </p>
                  <p>
                    <strong>7.2 Annulation tardive :</strong> Peut entraîner des frais selon les conditions du centre.
                  </p>
                  <p>
                    <strong>7.3 Remboursement :</strong> Effectué sous 7 jours ouvrables sur le moyen de paiement
                    utilisé.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">8. Responsabilité</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    SaaS Formation agit en qualité d'intermédiaire. La responsabilité concernant la prestation de
                    formation incombe au centre partenaire. Notre responsabilité est limitée au montant de la
                    transaction concernée.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">9. Propriété intellectuelle</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Tous les éléments de la plateforme (textes, images, logos, etc.) sont protégés d'auteur. Toute
                    reproduction non autorisée est interdite.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">10. Modification des CGU</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    SaaS Formation se réserve le droit de modifier les présentes CGU à tout moment. seront informés des
                    modifications par email ou notification sur la plateforme.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">11. Droit applicable et juridiction</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    Les présentes CGU sont soumises au droit tunisien. En cas de litige, les tribunaux de Tunis sont
                    seuls compétents.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">12. Contact</h2>
                <div className="bg-muted/50 mt-4 rounded-lg p-4">
                  <p>
                    <strong>SaaS Formation SARL</strong>
                  </p>
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
