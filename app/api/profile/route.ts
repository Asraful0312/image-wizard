// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Clerk } from "@clerk/clerk-sdk-node";

const clerk = Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

export async function GET(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const clerkUser = await clerk.users.getUser(clerkId);
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        credits: true,
        createdAt: true,
        purchases: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            creditsBought: true,
            amountPaid: true,
            variant: true, // Include variant
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      email: clerkUser.emailAddresses[0]?.emailAddress || "No email available",
      credits: user.credits,
      memberSince: user.createdAt.toISOString(),
      purchases: user.purchases.map((p) => ({
        id: p.id,
        date: p.createdAt.toISOString(),
        credits: p.creditsBought,
        amount: p.amountPaid,
        variant: p.variant,
      })),
    });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
