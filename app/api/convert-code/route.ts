export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  const { userId: clerkId } = getAuth(req);

  try {
    let prismaUserId: string | null = null;
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      prismaUserId = user.id;
      // Credit check happens later based on type
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const type = formData.get("type") as string;
    if (!file) throw new Error("No image provided");

    console.log("Type received:", type);

    if (type !== "code" && type !== "text-ai") {
      return NextResponse.json(
        {
          error:
            "Only 'code' or 'text-ai' conversion is supported here. Use /api/convert for Tesseract text conversion.",
        },
        { status: 400 }
      );
    }

    const creditsRequired = type === "code" ? 3 : 2; // 3 for code, 2 for text-ai
    if (clerkId && prismaUserId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (user!.credits < creditsRequired) {
        return NextResponse.json(
          { error: "Insufficient credits" },
          { status: 400 }
        );
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt =
      type === "code"
        ? "Extract the code from this image and return only the raw code text as it appears, without any markdown, code block markers (like ```), language identifiers, or additional explanations. If no code is present, return the plain text as it appears in the image."
        : "Extract the text from this image and return only the raw text as it appears, without any markdown, code block markers (like ```), or additional explanations.";
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: file.type } },
    ]);

    const text = result.response.text();
    console.log("Gemini response:", text);

    if (clerkId && prismaUserId) {
      await prisma.$transaction([
        prisma.user.update({
          where: { clerkId },
          data: { credits: { decrement: creditsRequired } },
        }),
        prisma.conversion.create({
          data: {
            userId: prismaUserId,
            type: type === "code" ? "image-to-code" : "image-to-text-ai",
            inputUrl: "some-cloud-url",
            output: text,
          },
        }),
      ]);
    } else {
      await prisma.conversion.create({
        data: {
          userId: null,
          type: type === "code" ? "image-to-code" : "image-to-text-ai",
          inputUrl: "some-cloud-url",
          output: text,
        },
      });
    }

    return NextResponse.json({ text, type: type === "code" ? "code" : "text" });
  } catch (error) {
    console.error("Gemini conversion error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
