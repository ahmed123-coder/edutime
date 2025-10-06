"use client";

import { useState } from "react";
import { Search, Book, MessageCircle, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Trouvez rapidement les réponses à vos questions ou contactez notre équipe support.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans l'aide..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-2 h-10"
                disabled={!searchQuery.trim()}
              >
                Rechercher
              </Button>
            </div>
          </form>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
