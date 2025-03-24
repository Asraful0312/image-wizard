// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body", body);

  // Check the event type using meta.event_name
  const event = body.meta?.event_name;
  if (!event) {
    console.log("No event name provided in webhook");
    return NextResponse.json({ status: "invalid" });
  }

  // Handle both order_created and order_item.created events
  if (event !== "order_created" && event !== "order_item.created") {
    console.log("Ignoring event:", event);
    return NextResponse.json({ status: "ignored" });
  }

  // For order_item.created, the payload is flat
  if (event === "order_item.created") {
    const { variant_name, price, order_id } = body;

    if (!variant_name || !price || !order_id) {
      console.log("Invalid order_item.created data:", body);
      return NextResponse.json({ status: "invalid" });
    }

    // Custom data is in meta.custom_data
    const custom = body.meta?.custom_data;
    if (!custom?.userId) {
      console.log("Missing userId in custom data:", custom);
      return NextResponse.json({ status: "invalid" });
    }

    const userId = custom.userId;
    const variantName = variant_name; // e.g., "Elite"
    const amountPaid = price / 100; // Convert cents to dollars

    // Map variant names to credits
    const variantToCredits: { [key: string]: number } = {
      Starter: 50,
      Basic: 150,
      Pro: 500,
      Elite: 1500,
    };

    const credits = variantToCredits[variantName];
    if (!credits) {
      console.log("Unknown variant:", variantName);
      return NextResponse.json({ status: "invalid" });
    }

    try {
      // Update user credits
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } },
      });

      // Create purchase record
      await prisma.purchase.create({
        data: {
          userId,
          creditsBought: credits,
          amountPaid,
          lemonSqueezyId: order_id.toString(), // Use order_id as the identifier
          variant: variantName,
        },
      });

      return NextResponse.json({ status: "success" });
    } catch (error) {
      console.error("Webhook error:", error);
      return NextResponse.json({ status: "error" }, { status: 500 });
    }
  }

  // For order_created (keeping this for completeness)
  if (event === "order_created") {
    const { status, first_order_item, total } = body.data.attributes;
    const custom = body.meta?.custom_data;
    if (
      status !== "paid" ||
      !custom?.userId ||
      !first_order_item?.variant_name
    ) {
      console.log("Invalid order_created data:", body.data.attributes);
      return NextResponse.json({ status: "invalid" });
    }

    const userId = custom.userId;
    const variantName = first_order_item.variant_name;
    const amountPaid = total / 100;

    const variantToCredits: { [key: string]: number } = {
      Starter: 50,
      Basic: 150,
      Pro: 500,
      Elite: 1500,
    };

    const credits = variantToCredits[variantName];
    if (!credits) {
      console.log("Unknown variant:", variantName);
      return NextResponse.json({ status: "invalid" });
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } },
      });

      await prisma.purchase.create({
        data: {
          userId,
          creditsBought: credits,
          amountPaid,
          lemonSqueezyId: body.data.id,
          variant: variantName,
        },
      });

      return NextResponse.json({ status: "success" });
    } catch (error) {
      console.error("Webhook error:", error);
      return NextResponse.json({ status: "error" }, { status: 500 });
    }
  }

  return NextResponse.json({ status: "ignored" });
}
