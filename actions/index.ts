// app/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

type ConvertImageToTextInput = {
  file: string; // Base64 string (image or PDF)
  type: string;
  language: string;
  clerkId: string | null;
};

export async function convertImageToText({
  file,
  type,
  clerkId,
}: ConvertImageToTextInput) {
  try {
    let prismaUserId: string | null = null;
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) {
        return { error: "User not found", text: null };
      }
      prismaUserId = user.id;

      // Check credits for signed-in users
      const creditsRequired =
        type === "pdf-to-text"
          ? 3 // 3 credits for PDF-to-text
          : type === "code"
          ? 3
          : type === "text-ai"
          ? 2
          : 1; // 1 for text, 2 for text-ai, 3 for code
      if (user.credits < creditsRequired) {
        return { error: "Insufficient credits", text: null };
      }
    }

    let text: string;

    if (type === "text" || type === "pdf-to-text") {
      // Use English as the language for OCR.Space (since only English is supported)
      const ocrLanguage = "eng";

      // Call OCR.Space API
      const formData = new FormData();
      if (type === "text") {
        formData.append("base64Image", file);
      } else {
        // For PDFs, use the base64 string directly as a PDF file
        formData.append("base64Image", file); // OCR.Space can handle PDFs via base64
      }
      formData.append("language", ocrLanguage);
      formData.append("isOverlayRequired", "false");
      formData.append("filetype", type === "pdf-to-text" ? "PDF" : "JPG"); // Specify filetype for OCR.Space
      formData.append("apikey", process.env.OCR_SPACE_API_KEY || "helloworld");

      const response = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.IsErroredOnProcessing) {
        throw new Error(
          result.ErrorMessage?.[0] || "OCR.Space failed to process the file"
        );
      }

      text = result.ParsedResults?.[0]?.ParsedText || "";
      if (!text) {
        return { error: "Failed to extract text from file", text: null };
      }
    } else if (type === "text-ai" || type === "code") {
      // Use Gemini API for text-ai and code conversions
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt =
        type === "code"
          ? "Extract the code from this image and return only the raw code text as it appears, without any markdown, code block markers (like ```), language identifiers, or additional explanations. If no code is present, return the plain text as it appears in the image."
          : "Extract the text from this image and return only the raw text as it appears, without any markdown, code block markers (like ```), or additional explanations.";

      const base64Data = file.split(",")[1]; // Extract base64 data after "data:image/jpeg;base64," or "data:application/pdf;base64,"
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      ]);

      text = result.response.text();
      console.log("Gemini response:", text);
    } else {
      return {
        error:
          "Invalid conversion type. Supported types are 'text', 'pdf-to-text', 'text-ai', and 'code'.",
        text: null,
      };
    }

    // Store the conversion in the database and deduct credits
    if (clerkId && prismaUserId) {
      const creditsDeducted =
        type === "pdf-to-text"
          ? 3 // 3 credits for PDF-to-text
          : type === "code"
          ? 3
          : type === "text-ai"
          ? 2
          : 1; // 1 for text, 2 for text-ai, 3 for code
      await prisma.$transaction([
        prisma.conversion.create({
          data: {
            userId: prismaUserId,
            type:
              type === "code"
                ? "image-to-code"
                : type === "text-ai"
                ? "image-to-text-ai"
                : type === "pdf-to-text"
                ? "pdf-to-text"
                : "image-to-text",
            inputUrl: "some-cloud-url",
            output: text,
          },
        }),
        prisma.user.update({
          where: { id: prismaUserId },
          data: { credits: { decrement: creditsDeducted } },
        }),
      ]);
    } else {
      // Non-logged-in users: store conversion, rely on client-side limit
      await prisma.conversion.create({
        data: {
          userId: null,
          type:
            type === "code"
              ? "image-to-code"
              : type === "text-ai"
              ? "image-to-text-ai"
              : type === "pdf-to-text"
              ? "pdf-to-text"
              : "image-to-text",
          inputUrl: "some-cloud-url",
          output: text,
        },
      });
    }

    return { text, error: null };
  } catch (error) {
    console.error(
      `${
        type === "text" || type === "pdf-to-text" ? "OCR.Space" : "Gemini"
      } conversion error:`,
      error
    );
    return { error: (error as Error).message, text: null };
  }
}
