import { Metadata } from "next";

import { ContactFAQ } from "./_components/contact-faq";
import { ContactForm } from "./_components/contact-form";
import { ContactInfo } from "./_components/contact-info";
import { ContactMap } from "./_components/contact-map";

export const metadata: Metadata = {
  title: "Contact | SaaS Formation",
  description:
    "Contactez-nous pour toute question concernant notre plateforme de gestion d'espaces de formation. Notre équipe est là pour vous aider.",
  keywords: "contact, support, aide, SaaS Formation, Tunisie",
};

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Contactez-nous</h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Notre équipe est là pour répondre à toutes vos questions et vous accompagner dans l'utilisation de notre
            plateforme.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8">
            <ContactInfo />
            <ContactMap />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <ContactFAQ />
        </div>
      </div>
    </div>
  );
}
