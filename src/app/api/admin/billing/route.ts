import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all billing data across the platform
    const [bookings, payments, subscriptionPayments] = await Promise.all([
      // All bookings across all organizations
      prisma.booking.findMany({
        select: {
          id: true,
          totalAmount: true,
          commission: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          organization: { select: { name: true } },
          room: { select: { name: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 100, // Limit for performance
      }),

      // All payments across platform
      prisma.payment.findMany({
        select: {
          id: true,
          amount: true,
          commission: true,
          status: true,
          method: true,
          createdAt: true,
          booking: {
            select: {
              organization: { select: { name: true } },
              room: { select: { name: true } },
              user: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),

      // All subscription payments (platform revenue)
      prisma.subscriptionPayment.findMany({
        select: {
          id: true,
          amount: true,
          status: true,
          method: true,
          dueDate: true,
          paidAt: true,
          createdAt: true,
          subscription: {
            select: {
              organization: { select: { name: true } },
              package: { select: { name: true, plan: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    ]);

    // Calculate platform totals
    const totalPlatformRevenue = bookings
      .filter(b => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + Number(b.totalAmount), 0);

    const totalCommissionEarned = bookings
      .filter(b => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + Number(b.commission), 0);

    const totalSubscriptionRevenue = subscriptionPayments
      .filter(sp => sp.status === "PAID")
      .reduce((sum, sp) => sum + Number(sp.amount), 0);

    const totalOwnerRevenue = bookings
      .filter(b => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + Number(b.totalAmount) - Number(b.commission), 0);

    return NextResponse.json({
      summary: {
        totalPlatformRevenue,
        totalCommissionEarned,
        totalSubscriptionRevenue,
        totalOwnerRevenue,
        totalAdminRevenue: totalCommissionEarned + totalSubscriptionRevenue,
      },
      bookings,
      payments,
      subscriptionPayments,
    });
  } catch (error) {
    console.error("Error fetching admin billing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}