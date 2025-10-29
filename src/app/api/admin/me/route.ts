import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";


// function get details user of admin
export async function GET(request: NextRequest) {
    try {

            const session = await getServerSession(authOptions);
        
            if (!session?.user) {
              return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            // if role not admin result is forbidden
            if (session.user.role !== "ADMIN") {
              return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
  
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          verified: true,
          avatar: true,
          speciality: true,
          createdAt: true,
          organizations: {
            select: {
              id: true,
              role: true,
              organization: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      });
  
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
  
      return NextResponse.json({ user });
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }