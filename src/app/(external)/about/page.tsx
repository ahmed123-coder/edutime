import { Metadata } from "next";

import { AboutHero } from "./_components/about-hero";
import { AboutMission } from "./_components/about-mission";
import { AboutStats } from "./_components/about-stats";
import { AboutTeam } from "./_components/about-team";
import { AboutValues } from "./_components/about-values";

export const metadata: Metadata = {
  title: "À propos | SaaS Formation",
  description:
    "Découvrez l'histoire et la mission de SaaS Formation, la plateforme leader pour la gestion d'espaces de formation en Tunisie.",
  keywords: "à propos, mission, équipe, SaaS Formation, Tunisie, formation",
};

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      <AboutStats />
      <AboutTeam />
    </div>
  );
}
