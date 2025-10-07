"use client";
import * as React from "react";

import { LayoutDashboard, ChartBar, Gauge, ShoppingBag, GraduationCap, Forklift, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  { group: "Tableaux de bord", icon: LayoutDashboard, label: "Par défaut" },
  { group: "Tableaux de bord", icon: ChartBar, label: "CRM", disabled: true },
  { group: "Tableaux de bord", icon: Gauge, label: "Analytiques", disabled: true },
  { group: "Tableaux de bord", icon: ShoppingBag, label: "E-Commerce", disabled: true },
  { group: "Tableaux de bord", icon: GraduationCap, label: "Académie", disabled: true },
  { group: "Tableaux de bord", icon: Forklift, label: "Logistique", disabled: true },
  { group: "Authentification", label: "Connexion v1" },
  { group: "Authentification", label: "Connexion v2" },
  { group: "Authentification", label: "Inscription v1" },
  { group: "Authentification", label: "Inscription v2" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="link"
        className="text-muted-foreground !px-0 font-normal hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Rechercher
        <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Rechercher des tableaux de bord, utilisateurs, et plus…" />
        <CommandList>
          <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem className="!py-1.5" key={item.label} onSelect={() => setOpen(false)}>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
