'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface SubscriptionAlertProps {
  userRole: string;
  userId: string;
}

export function SubscriptionAlert({ userRole, userId }: SubscriptionAlertProps) {
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only check for non-admin users
    if (userRole === 'ADMIN') {
      return;
    }

    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/subscription-status/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setHasActiveSubscription(data.hasActiveSubscription);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, [userRole, userId]);

  // Don't show for admins or if dismissed or if has active subscription
  if (userRole === 'ADMIN' || dismissed || hasActiveSubscription === true || hasActiveSubscription === null) {
    return null;
  }

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-orange-800">
          <strong>Subscription Required:</strong> Your organization needs an active subscription to access all features. 
          Please contact support or subscribe to continue using the platform.
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="h-auto p-1 text-orange-600 hover:text-orange-800"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
