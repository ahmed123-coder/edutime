"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

import { LoginForm } from "../_components/login-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.verified) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-dvh items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (status === "authenticated" && session?.user?.verified) {
    return null; // Will redirect
  }

  return (
    <div className="flex h-dvh">
      <div className="bg-primary hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <img
              src="/assets/logo-edutime-vertical.svg"
              alt="EduTime Logo"
              className="mx-auto h-auto max-w-full"
              style={{ maxHeight: '200px' }}
            />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-5xl font-light">Bonjour à nouveau</h1>
              <p className="text-primary-foreground/80 text-xl">Connectez-vous pour continuer</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="font-medium tracking-tight">Connexion</div>
            <div className="text-muted-foreground mx-auto max-w-xl">
              Bon retour. Entrez votre email et votre mot de passe, espérons que vous vous en souveniez cette fois-ci.
            </div>
          </div>
          <div className="space-y-4">
            <LoginForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-muted-foreground text-center text-xs">
              Vous n&apos;avez pas de compte ?{" "}
              <Link href="/auth/register" className="text-primary">
                S&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
