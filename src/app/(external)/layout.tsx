import { ReactNode } from "react";

import { PublicFooter } from "./_components/public-footer";
import { PublicHeader } from "./_components/public-header";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
