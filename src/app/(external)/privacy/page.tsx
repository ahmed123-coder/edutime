import { Metadata } from "next";

import { Shield, Eye, Lock, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Politique de confidentialité | SaaS Formation",
  description: "Découvrez comment SaaS Formation protège vos données personnelles et respecte votre vie privée.",
  keywords: "confidentialité, données personnelles, RGPD, protection, SaaS Formation",
};

const sections = [
  {
    title: "Collecte des données",
    icon: Eye,
    content:
      "Nous collectons uniquement les données nécessaires au fonctionnement de notre service : informations de compte, données de réservation, et préférences utilisateur. Aucune donnée sensible n'est collectée sans votre consentement explicite.",
  },
  {
    title: "Utilisation des données",
    icon: Users,
    content:
      "Vos données sont utilisées pour fournir nos services, traiter vos réservations, améliorer votre expérience utilisateur et vous envoyer des communications importantes. Nous ne vendons jamais vos données à des tiers.",
  },
  {
    title: "Protection des données",
    icon: Lock,
    content:
      "Nous utilisons des technologies de cryptage avancées et des mesures de sécurité strictes pour protéger vos données. Nos serveurs sont hébergés dans des centres de données sécurisés et certifiés.",
  },
  {
    title: "Vos droits",
    icon: Shield,
    content:
      "Conformément au RGPD, vous avez le droit d'accéder, modifier, supprimer vos données ou vous opposer à leur traitement. Contactez-nous pour exercer ces droits.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Politique de confidentialité</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Votre vie privée est importante pour nous. Découvrez comment nous protégeons et utilisons vos données
            personnelles.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">Dernière mise à jour : 1er janvier 2024</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Overview Cards */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <section.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Content */}
        <div className="prose prose-gray mx-auto max-w-4xl">
          <Card>
            <CardContent className="space-y-8 p-8">
              <section>
                <h2 className="mb-4 text-2xl font-bold">1. Informations que nous collectons</h2>
                <div className="text-muted-foreground space-y-4">
                  <p>
                    <strong>Données d'identification :</strong> Nom, prénom, adresse email, numéro de téléphone.
                  </p>
                  <p>
                    <strong>Données de réservation :</strong> Informations sur vos réservations, préférences, historique
                    d'utilisation.
                  </p>
                  <p>
                    <strong>Données techniques :</strong> Adresse IP, type de navigateur, données de connexion pour
                    améliorer nos services.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">2. Comment nous utilisons vos données</h2>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>Fournir et améliorer nos services</li>
                  <li>Traiter vos réservations et paiements</li>
                  <li>Vous envoyer des confirmations et notifications importantes</li>
                  <li>Personnaliser votre expérience utilisateur</li>
                  <li>Assurer la sécurité de notre plateforme</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">3. Partage des données</h2>
                <p className="text-muted-foreground mb-4">
                  Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos données uniquement dans les
                  cas suivants :
                </p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>Avec les centres partenaires pour traiter vos réservations</li>
                  <li>Avec nos prestataires de services (paiement, hébergement) sous contrat strict</li>
                  <li>Si requis par la loi ou pour protéger nos droits légitimes</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">4. Vos droits</h2>
                <p className="text-muted-foreground mb-4">
                  Conformément au RGPD et à la loi tunisienne sur la protection des données, vous disposez des droits
                  suivants :
                </p>
                <ul className="text-muted-foreground list-disc space-y-2 pl-6">
                  <li>
                    <strong>Droit d'accès :</strong> Consulter les données que nous détenons sur vous
                  </li>
                  <li>
                    <strong>Droit de rectification :</strong> Corriger vos données inexactes
                  </li>
                  <li>
                    <strong>Droit à l'effacement :</strong> Supprimer vos données sous certaines conditions
                  </li>
                  <li>
                    <strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données
                  </li>
                  <li>
                    <strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">5. Sécurité des données</h2>
                <p className="text-muted-foreground">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos
                  données : cryptage SSL/TLS, authentification à deux facteurs, audits de sécurité réguliers, et
                  formation de notre personnel aux bonnes pratiques de sécurité.
                </p>
              </section>

              <section>
                <h2 className="mb-4 text-2xl font-bold">6. Contact</h2>
                <p className="text-muted-foreground">
                  Pour toute question concernant cette politique ou pour exercer vos droits, contactez notre délégué à
                  la protection des données :
                </p>
                <div className="bg-muted/50 mt-4 rounded-lg p-4">
                  <p>
                    <strong>Email :</strong> privacy@saasformation.tn
                  </p>
                  <p>
                    <strong>Adresse :</strong> Avenue Habib Bourguiba, 1000 Tunis, Tunisie
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
