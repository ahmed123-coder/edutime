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

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get stats for admin (all organizations)
    const [organizationsCount, bookingsCount, totalRevenue, avgRating] = await Promise.all([
      // Total organizations
      prisma.organization.count(),
      
      // Bookings this month
      prisma.booking.count({
        where: { createdAt: { gte: currentMonth } },
      }),
      
      // Revenue this month
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: currentMonth },
          status: "CONFIRMED",
        },
        _sum: { totalAmount: true },
      }),
      
      // Average rating across all organizations
      prisma.review.aggregate({
        _avg: { rating: true },
      }),
    ]);

    return NextResponse.json({
      organizations: organizationsCount,
      bookings: bookingsCount,
      revenue: totalRevenue._sum.totalAmount || 0,
      avgRating: avgRating._avg.rating || 0,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}