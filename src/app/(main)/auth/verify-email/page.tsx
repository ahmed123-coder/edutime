"use client";

import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Command, Loader2, Mail, CheckCircle, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const { data: session, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    // If already verified, redirect to dashboard
    if (session?.user?.verified) {
      router.push("/dashboard");
      return;
    }

    if (token) {
      verifyToken(token);
    }
  }, [token, session, router]);

  const verifyToken = async (verificationToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/verify?token=${verificationToken}`);
      const data = await response.json();

      if (response.ok) {
        setIsVerified(true);
        setMessage("Email verified successfully! Redirecting to dashboard...");

        // Update session
        await update();

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (error) {
      setError("An error occurred during verification");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!session?.user?.email) return;

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setError(data.error || "Failed to send verification email");
      }
    } catch (error) {
      setError("An error occurred while sending verification email");
    } finally {
      setIsLoading(false);
    }
  };

  if (token && isLoading) {
    return (
      <div className="flex h-dvh">
        <div className="bg-primary hidden lg:block lg:w-1/3">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="space-y-6">
              <Command className="text-primary-foreground mx-auto size-12" />
              <div className="space-y-2">
                <h1 className="text-primary-foreground text-5xl font-light">Formation Space</h1>
                <p className="text-primary-foreground/80 text-xl">Verifying your email...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Loader2 className="mb-4 h-8 w-8 animate-spin" />
              <p>Verifying your email...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex h-dvh">
        <div className="bg-primary hidden lg:block lg:w-1/3">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="space-y-6">
              <Command className="text-primary-foreground mx-auto size-12" />
              <div className="space-y-2">
                <h1 className="text-primary-foreground text-5xl font-light">Welcome!</h1>
                <p className="text-primary-foreground/80 text-xl">You're all set</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
              <h2 className="mb-2 text-xl font-semibold">Email Verified!</h2>
              <p className="mb-4 text-center text-gray-600">
                Your email has been successfully verified. You will be redirected to your dashboard shortly.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (token && error) {
    return (
      <div className="flex h-dvh">
        <div className="bg-primary hidden lg:block lg:w-1/3">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="space-y-6">
              <Command className="text-primary-foreground mx-auto size-12" />
              <div className="space-y-2">
                <h1 className="text-primary-foreground text-5xl font-light">Oops!</h1>
                <p className="text-primary-foreground/80 text-xl">Something went wrong</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <XCircle className="mb-4 h-16 w-16 text-red-500" />
              <h2 className="mb-2 text-xl font-semibold">Verification Failed</h2>
              <p className="mb-4 text-center text-gray-600">{error}</p>
              <Button onClick={() => router.push("/auth/login")}>Back to Login</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh">
      <div className="bg-primary hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Command className="text-primary-foreground mx-auto size-12" />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-5xl font-light">Check your email</h1>
              <p className="text-primary-foreground/80 text-xl">We've sent you a verification link</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <div className="font-medium tracking-tight">Verify Your Email</div>
            <div className="text-muted-foreground mx-auto max-w-xl">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify
              your account.
            </div>
          </div>

          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the email? Check your spam folder or request a new verification email.
              </p>

              <Button
                onClick={resendVerification}
                disabled={isLoading || !session?.user?.email}
                variant="outline"
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resend Verification Email
              </Button>

              <div className="border-t pt-4">
                <Button onClick={() => router.push("/auth/login")} variant="ghost" className="w-full">
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
