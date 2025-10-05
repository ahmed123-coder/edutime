'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const createPackageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  plan: z.enum(['ESSENTIAL', 'PRO', 'PREMIUM']),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  billingPeriod: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
  maxRooms: z.number().positive('Max rooms must be positive'),
  maxBookingsPerMonth: z.number().positive('Max bookings must be positive'),
  maxMembers: z.number().positive('Max members must be positive'),
  features: z.string().min(1, 'Features are required'),
});

type CreatePackageFormData = z.infer<typeof createPackageSchema>;

interface CreatePackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPackageCreated: () => void;
}

export function CreatePackageModal({ open, onOpenChange, onPackageCreated }: CreatePackageModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreatePackageFormData>({
    resolver: zodResolver(createPackageSchema),
    defaultValues: {
      name: '',
      plan: 'ESSENTIAL',
      description: '',
      price: 0,
      billingPeriod: 'MONTHLY',
      maxRooms: 5,
      maxBookingsPerMonth: 50,
      maxMembers: 3,
      features: '',
    },
  });

  const onSubmit = async (data: CreatePackageFormData) => {
    try {
      setIsLoading(true);

      const packageData = {
        ...data,
        features: data.features.split('\n').filter(f => f.trim()),
        limits: {
          maxRooms: data.maxRooms,
          maxBookingsPerMonth: data.maxBookingsPerMonth,
          maxMembers: data.maxMembers,
        },
      };

      const response = await fetch('/api/admin/subscription-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create package');
      }

      toast.success('Package created successfully');
      form.reset();
      onOpenChange(false);
      onPackageCreated();
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create package');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Subscription Package</DialogTitle>
          <DialogDescription>
            Create a new subscription package with features and limits.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Essential Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ESSENTIAL">Essential</SelectItem>
                        <SelectItem value="PRO">Pro</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Package description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (TND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billingPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select billing period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="maxRooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Rooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxBookingsPerMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Bookings/Month</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Members</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Room management&#10;Booking system&#10;Basic analytics"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Package'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
