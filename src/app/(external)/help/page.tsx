import { Metadata } from "next";

import { HelpCategories } from "./_components/help-categories";
import { HelpContact } from "./_components/help-contact";
import { HelpFAQ } from "./_components/help-faq";
import { HelpHero } from "./_components/help-hero";

export const metadata: Metadata = {
  title: "Centre d'aide | SaaS Formation",
  description:
    "Trouvez rapidement les réponses à vos questions sur l'utilisation de SaaS Formation. FAQ, guides et support.",
  keywords: "aide, support, FAQ, guide, SaaS Formation",
};

export default function HelpPage() {
  return (
    <div className="bg-background min-h-screen">
      <HelpHero />
      <HelpCategories />
      <HelpFAQ />
      <HelpContact />
    </div>
  );
}
