import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${random}.${extension}`;

    // Determine directory based on type
    let subDir = "general";
    if (type === "room") {
      subDir = "rooms";
    } else if (type === "logo" || type === "organization") {
      subDir = "organizations";
    } else if (type === "avatar") {
      subDir = "avatars";
    }

    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", subDir);
    await mkdir(uploadDir, { recursive: true });

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return public URL
    const url = `/uploads/${subDir}/${filename}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}