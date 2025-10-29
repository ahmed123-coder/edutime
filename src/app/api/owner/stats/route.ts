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

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get user's organizations
    const userOrgs = await prisma.organizationMember.findMany({
      where: { userId: session.user.id },
      select: { organizationId: true },
    });

    const orgIds = userOrgs.map(org => org.organizationId);

    // Get stats
    const [bookingsCount, totalRevenue, avgRating] = await Promise.all([
      // Bookings this month
      prisma.booking.count({
        where: {
          organizationId: { in: orgIds },
          createdAt: { gte: currentMonth },
        },
      }),
      
      // Revenue this month
      prisma.booking.aggregate({
        where: {
          organizationId: { in: orgIds },
          createdAt: { gte: currentMonth },
          status: "CONFIRMED",
        },
        _sum: { totalAmount: true },
      }),
      
      // Average rating
      prisma.review.aggregate({
        where: { organizationId: { in: orgIds } },
        _avg: { rating: true },
      }),
    ]);

    return NextResponse.json({
      organizations: orgIds.length,
      bookings: bookingsCount,
      revenue: totalRevenue._sum.totalAmount || 0,
      avgRating: avgRating._avg.rating || 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}