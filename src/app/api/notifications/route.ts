import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "50");

    // If admin and userId provided, get notifications for that user
    // Otherwise get notifications for current user
    const targetUserId = session.user.role === "ADMIN" && userId ? userId : session.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId, notificationIds } = body;

    // If admin and userId provided, update notifications for that user
    // Otherwise update notifications for current user
    const targetUserId = session.user.role === "ADMIN" && userId ? userId : session.user.id;

    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: targetUserId,
        },
        data: { read: true },
      });
    } else {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: { userId: targetUserId },
        data: { read: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}