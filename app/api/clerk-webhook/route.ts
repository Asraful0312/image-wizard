// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for raw webhook payload
  },
};

export async function POST(req: NextRequest) {
  // Get the raw body as a Buffer
  let body: Buffer;
  try {
    const arrayBuffer = await req.arrayBuffer();
    body = Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error reading request body:", error);
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400 }
    );
  }

  // Get headers
  const headers = req.headers;

  // Verify the webhook signature
  const whSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!whSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  try {
    const wh = new Webhook(whSecret);
    const payload = wh.verify(body, {
      "svix-id": headers.get("svix-id") || "",
      "svix-timestamp": headers.get("svix-timestamp") || "",
      "svix-signature": headers.get("svix-signature") || "",
    }) as {
      type: string;
      data: { id: string; email_addresses?: { email_address: string }[] };
    };

    // Handle user.created event
    if (payload.type === "user.created") {
      const { id: clerkId, email_addresses } = payload.data;
      const email = email_addresses?.[0]?.email_address; // Extract the primary email

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            clerkId,
            email, // Store the email
            credits: 10, // 10 free credits on registration
          },
        });
        console.log(`Created user with clerkId: ${clerkId}, email: ${email}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}