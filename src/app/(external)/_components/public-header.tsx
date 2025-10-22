"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X, Search, User, Phone, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoRectangle from "@/../public/assets/logo_rectangle.png";
import { IMAGES } from "@/lib/images";
import { cn } from "@/lib/utils";


export const images = {
  LOGO_RECTANGLE: logoRectangle,
} as const;

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Rechercher", href: "/search" },
  { name: "Centres", href: "/centers" },
  { name: "Spécialistes", href: "/specialists" },
  { name: "Partenaires", href: "/partners" },
  { name: "Tarifs", href: "/pricing" },
  { name: "À propos", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      {/* Top bar with contact info */}
      <div className="bg-muted/50 hidden border-b md:block">
        <div className="container mx-auto px-4 py-2">
          <div className="text-muted-foreground flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+216 71 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contact@saasformation.tn</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="hover:text-foreground transition-colors">
                Aide
              </Link>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={images.LOGO_RECTANGLE}
              alt="Espace de formation moderne"
              className="h-8 w-auto object-cover"
              priority
            />
          </Link>


          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-6 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "hover:text-primary text-sm font-medium transition-colors",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
              <span className="sr-only">Rechercher</span>
            </Button>

            <div className="hidden items-center space-x-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">
                  <User className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">S'inscrire</Link>
              </Button>
            </div>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="mt-6 flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "hover:text-primary text-lg font-medium transition-colors",
                        pathname === item.href ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <div className="space-y-2 border-t pt-4">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                        <User className="mr-2 h-4 w-4" />
                        Connexion
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                        S'inscrire
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
