// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const checkoutUrl = new URL(
      "https://image-wizard.lemonsqueezy.com/buy/3fd26a17-dd33-46cf-ba28-a62c969da9e9"
    );

    // Pass custom data (only userId, since variant will be selected by the user)
    checkoutUrl.searchParams.append("checkout[custom][userId]", user.id);

    // Set return URL
    const returnUrl = `${process.env.NEXT_PUBLIC_URL}/profile`;
    checkoutUrl.searchParams.append("checkout[return_url]", returnUrl);

    console.log("Generated checkout URL:", checkoutUrl.toString());
    return NextResponse.json({ checkoutUrl: checkoutUrl.toString() });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout" },
      { status: 500 }
    );
  }
}
