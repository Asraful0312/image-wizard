// app/api/conversions/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const skip = (page - 1) * pageSize;

    const [conversions, total] = await Promise.all([
      prisma.conversion.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          type: true,
          inputUrl: true,
          output: true,
          createdAt: true,
        },
      }),
      prisma.conversion.count({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json({
      conversions: conversions.map((c) => ({
        id: c.id,
        date: c.createdAt.toISOString(),
        type: c.type as "text" | "code",
        inputUrl: c.inputUrl,
        output: c.output,
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Fetch conversions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversions" },
      { status: 500 }
    );
  }
}
