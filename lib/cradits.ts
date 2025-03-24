import { getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "./prisma";

// Since this might be used in API routes, pass the request object
export async function checkAndDeductCredits(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    // For unauthenticated users, we can't use localStorage server-side.
    // This logic should move to the client-side or use cookies instead.
    // For now, we'll assume client-side handles this part.
    return true; // Allow unauthenticated users temporarily (fix this later)
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user || user.credits < 1) throw new Error("Insufficient credits");

  await prisma.user.update({
    where: { clerkId: userId },
    data: { credits: user.credits - 1 },
  });
  return true;
}

export async function addCredits(userId: string, credits: number) {
  await prisma.user.update({
    where: { clerkId: userId },
    data: { credits: { increment: credits } },
  });
}
