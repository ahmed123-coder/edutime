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

    if (!["CENTER_OWNER", "TRAINING_MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user's organizations
    const userOrgs = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    const orgIds = userOrgs.map(org => org.organizationId);

    // Get billing data
    const [bookings, payments, subscriptionPayments] = await Promise.all([
      // All bookings for user's organizations
      prisma.booking.findMany({
        where: { organizationId: { in: orgIds } },
        select: {
          id: true,
          totalAmount: true,
          commission: true,
          status: true,
          paymentStatus: true,
          createdAt: true,
          room: { select: { name: true } },
          user: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      }),

      // All payments received
      prisma.payment.findMany({
        where: {
          booking: { organizationId: { in: orgIds } },
        },
        select: {
          id: true,
          amount: true,
          commission: true,
          status: true,
          method: true,
          createdAt: true,
          booking: {
            select: {
              room: { select: { name: true } },
              user: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // Subscription payments (what they pay)
      prisma.subscriptionPayment.findMany({
        where: {
          subscription: { organizationId: { in: orgIds } },
        },
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
      }),
    ]);

    // Calculate totals
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + Number(b.totalAmount) - Number(b.commission), 0);

    const totalCommissionPaid = bookings
      .filter(b => b.paymentStatus === "PAID")
      .reduce((sum, b) => sum + Number(b.commission), 0);

    const totalSubscriptionCosts = subscriptionPayments
      .filter(sp => sp.status === "PAID")
      .reduce((sum, sp) => sum + Number(sp.amount), 0);

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalCommissionPaid,
        totalSubscriptionCosts,
        netRevenue: totalRevenue - totalSubscriptionCosts,
      },
      bookings,
      payments,
      subscriptionPayments,
    });
  } catch (error) {
    console.error("Error fetching owner billing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}