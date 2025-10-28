"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login by default
    router.replace("/auth/login");
  }, [router]);

  return (
    <div className="flex h-dvh items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
    </div>
  );
}
