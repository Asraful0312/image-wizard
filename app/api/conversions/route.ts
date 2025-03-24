// app/api/conversions/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

type ConversationType = {
  id: string;
  createdAt: Date;
  type: string;
  inputUrl: string;
  output: string;
};

export async function GET(req: NextRequest) {
  const { userId: clerkId } = getAuth(req); // Clerk ID
  console.log("Clerk ID:", clerkId);

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the User record by clerkId to get the Prisma User.id
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const prismaUserId = user.id; // This is the UUID stored in Conversion.userId
    console.log("Prisma User ID:", prismaUserId);

    const conversions = await prisma.conversion.findMany({
      where: { userId: prismaUserId }, // Use the UUID, not the Clerk ID
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        inputUrl: true,
        output: true,
        createdAt: true,
      },
    });

    console.log("Conversions:", conversions);

    return NextResponse.json({
      conversions: conversions.map((c: ConversationType) => ({
        id: c.id,
        date: c.createdAt.toISOString(),
        type: c.type,
        inputUrl: c.inputUrl,
        output: c.output,
      })),
    });
  } catch (error) {
    console.error("Fetch conversions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversions" },
      { status: 500 }
    );
  }
}
