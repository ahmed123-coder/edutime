import { Metadata } from "next";
import { ContactForm } from "./_components/contact-form";
import { ContactInfo } from "./_components/contact-info";
import { ContactMap } from "./_components/contact-map";
import { ContactFAQ } from "./_components/contact-faq";

export const metadata: Metadata = {
  title: "Contact | SaaS Formation",
  description: "Contactez-nous pour toute question concernant notre plateforme de gestion d'espaces de formation. Notre équipe est là pour vous aider.",
  keywords: "contact, support, aide, SaaS Formation, Tunisie",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est là pour répondre à toutes vos questions et vous accompagner 
            dans l'utilisation de notre plateforme.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
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
