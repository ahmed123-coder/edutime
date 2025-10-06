import Link from "next/link";

import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IMAGES } from "@/lib/images";

const footerLinks = {
  platform: [
    { name: "Rechercher", href: "/search" },
    { name: "Centres de formation", href: "/centers" },
    { name: "Spécialistes", href: "/specialists" },
    { name: "Partenaires", href: "/partners" },
    { name: "Tarifs", href: "/pricing" },
  ],
  company: [
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Carrières", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Presse", href: "/press" },
  ],
  support: [
    { name: "Centre d'aide", href: "/help" },
    { name: "FAQ", href: "/faq" },
    { name: "Documentation", href: "/docs" },
    { name: "Statut du service", href: "/status" },
    { name: "Nous contacter", href: "/contact" },
  ],
  legal: [
    { name: "Politique de confidentialité", href: "/privacy" },
    { name: "Conditions d'utilisation", href: "/terms" },
    { name: "Mentions légales", href: "/legal" },
    { name: "Cookies", href: "/cookies" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "Instagram", href: "#", icon: Instagram },
];

export function PublicFooter() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <img src={IMAGES.LOGO_RECTANGLE} alt="SaaS Formation" className="h-8 w-auto" />
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              La plateforme leader pour la gestion et la réservation d'espaces de formation en Tunisie. Connectez-vous
              avec les meilleurs centres et spécialistes.
            </p>

            {/* Contact Info */}
            <div className="text-muted-foreground space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Tunis, Tunisie</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+216 71 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@saasformation.tn</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="mb-4 font-semibold">Plateforme</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-semibold">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 font-semibold">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 border-t pt-8">
          <div className="max-w-md">
            <h3 className="mb-2 font-semibold">Restez informé</h3>
            <p className="text-muted-foreground mb-4 text-sm">Recevez les dernières actualités et offres spéciales.</p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Votre adresse email" className="flex-1" />
              <Button type="submit">S'abonner</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-muted-foreground text-sm">© 2024 SaaS Formation. Tous droits réservés.</p>
          <div className="mt-4 flex space-x-4 md:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm">
              Confidentialité
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">
              Conditions
            </Link>
            <Link href="/cookies" className="text-muted-foreground hover:text-primary text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
