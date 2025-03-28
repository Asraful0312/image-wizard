// app/api/coupon/redeem/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  // Check if the user is authenticated
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Parse the request body
  const { code } = await req.json();
  if (!code) {
    return NextResponse.json(
      { error: "Coupon code is required" },
      { status: 400 }
    );
  }

  try {
    // Find the coupon
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code" },
        { status: 400 }
      );
    }

    // Check if the coupon has expired
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Coupon has expired" },
        { status: 400 }
      );
    }

    // Check if the user has already redeemed this coupon
    const existingRedemption = await prisma.couponRedemption.findUnique({
      where: {
        userId_couponId: {
          userId: user.id,
          couponId: coupon.id,
        },
      },
    });

    if (existingRedemption) {
      return NextResponse.json(
        { error: "You have already redeemed this coupon" },
        { status: 400 }
      );
    }

    // Redeem the coupon and award credits
    const updatedUser = await prisma.$transaction([
      // Create a redemption record
      prisma.couponRedemption.create({
        data: {
          userId: user.id,
          couponId: coupon.id,
        },
      }),
      // Add credits to the user
      prisma.user.update({
        where: { id: user.id },
        data: { credits: { increment: coupon.credits } },
      }),
    ]);

    return NextResponse.json({
      message: "Coupon redeemed successfully",
      credits: coupon.credits,
      newCreditBalance: updatedUser[1].credits,
    });
  } catch (error) {
    console.error("Error redeeming coupon:", error);
    return NextResponse.json(
      { error: "Failed to redeem coupon" },
      { status: 500 }
    );
  }
}
