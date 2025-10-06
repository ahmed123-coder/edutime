import { Metadata } from "next";

import { AlertTriangle, CreditCard, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Subscription Expired | SaaS Formation",
  description: "Your subscription has expired. Please renew to continue using the platform.",
};

export default function SubscriptionExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-2xl font-bold text-gray-900">Subscription Expired</CardTitle>
            <CardDescription className="mt-2">
              Your subscription has expired. Please contact your organization administrator to renew your subscription
              and continue using the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Access Restricted</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Your organization's subscription has expired. All features are temporarily unavailable until the
                      subscription is renewed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact Administrator
              </Button>

              <Button className="w-full" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                View Subscription Plans
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <a href="mailto:support@saasformation.com" className="font-medium text-blue-600 hover:text-blue-500">
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
