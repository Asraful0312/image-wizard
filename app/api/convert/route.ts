export const dynamic = "force-dynamic";
import { NextResponse, NextRequest } from "next/server";
import Tesseract from "tesseract.js";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import path from "path";

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
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const type = formData.get("type") as string;
    const language = (formData.get("language") as string) || "eng";
    if (!file) throw new Error("No image provided");

    console.log("Type received:", type);
    console.log("Language received:", language);

    if (type !== "text") {
      return NextResponse.json(
        {
          error:
            "Only image-to-text conversion is supported here. Use /api/convert-code for Gemini conversions.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const workerPath = path.resolve(
      process.cwd(),
      "node_modules/tesseract.js/src/worker-script/node/index.js"
    );
    console.log("Resolved workerPath:", workerPath);

    const worker = await Tesseract.createWorker(
      language,
      Tesseract.OEM.DEFAULT,
      {
        workerPath,
        logger: (m) => console.log("Tesseract:", m),
      }
    );

    await worker.setParameters({
      tessedit_pageseg_mode: Tesseract.PSM.AUTO,
    });

    const { data } = await worker.recognize(buffer);
    if (!data) throw new Error("Tesseract failed to process the image");
    const text = data.text;

    await worker.terminate();

    if (clerkId && prismaUserId) {
      // Free for logged-in users, no credit deduction
      await prisma.conversion.create({
        data: {
          userId: prismaUserId,
          type: "image-to-text",
          inputUrl: "some-cloud-url",
          output: text,
        },
      });
    } else {
      // Non-logged-in users: store conversion, rely on client-side limit
      await prisma.conversion.create({
        data: {
          userId: null,
          type: "image-to-text",
          inputUrl: "some-cloud-url",
          output: text,
        },
      });
    }

    return NextResponse.json({ text, type: "text" });
  } catch (error) {
    console.error("Tesseract conversion error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
