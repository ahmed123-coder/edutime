"use client";

import { useState } from "react";

import { Search, Book, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const quickActions = [
  {
    icon: Book,
    title: "Guides",
    description: "Consultez nos guides détaillés",
    action: "#guides",
  },
  {
    icon: MessageCircle,
    title: "Chat",
    description: "Discutez avec notre équipe",
    action: "#chat",
  },
  {
    icon: Phone,
    title: "Appeler",
    description: "Contactez-nous directement",
    action: "tel:+21671123456",
  },
];

export function HelpHero() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would search the knowledge base
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="from-primary/5 via-background to-secondary/5 bg-gradient-to-br py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold lg:text-6xl">Comment pouvons-nous vous aider ?</h1>
          <p className="text-muted-foreground mb-12 text-xl">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe support.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mb-12 max-w-2xl">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg"
              />
              <Button type="submit" className="absolute top-2 right-2 h-10" disabled={!searchQuery.trim()}>
                Rechercher
              </Button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <action.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold">{action.title}</h3>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
