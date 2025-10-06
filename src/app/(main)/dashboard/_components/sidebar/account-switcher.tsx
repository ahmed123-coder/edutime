"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { BadgeCheck, Bell, CreditCard, LogOut, Loader2 } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials } from "@/lib/utils";

export function AccountSwitcher({
  users,
}: {
  readonly users?: ReadonlyArray<{
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar: string;
    readonly role: string;
  }>;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Use session data if available, otherwise fallback to users prop
  const currentUser = session?.user
    ? {
        id: session.user.id || "1",
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || "",
        role: session.user.role || "USER",
      }
    : users?.[0];

  const [activeUser, setActiveUser] = useState(currentUser);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({
        callbackUrl: "/auth/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  if (status === "loading") {
    return (
      <Avatar className="size-9 rounded-lg">
        <AvatarFallback className="rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
        </AvatarFallback>
      </Avatar>
    );
  }

  if (!activeUser) {
    return (
      <Avatar className="size-9 rounded-lg">
        <AvatarFallback className="rounded-lg">?</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg">
          <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
          <AvatarFallback className="rounded-lg">{getInitials(activeUser.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {/* Current User Display */}
        <DropdownMenuItem className="bg-accent/50 border-l-primary border-l-2 p-0">
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <Avatar className="size-9 rounded-lg">
              <AvatarImage src={activeUser.avatar || undefined} alt={activeUser.name} />
              <AvatarFallback className="rounded-lg">{getInitials(activeUser.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{activeUser.name}</span>
              <span className="truncate text-xs capitalize">{activeUser.role.toLowerCase()}</span>
            </div>
          </div>
        </DropdownMenuItem>

        {/* Additional users if provided */}
        {users &&
          users.length > 1 &&
          users
            .filter((user) => user.id !== activeUser.id)
            .map((user) => (
              <DropdownMenuItem key={user.email} className="p-0" onClick={() => setActiveUser(user)}>
                <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
                  <Avatar className="size-9 rounded-lg">
                    <AvatarImage src={user.avatar || undefined} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs capitalize">{user.role}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut />}
          {isLoggingOut ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
