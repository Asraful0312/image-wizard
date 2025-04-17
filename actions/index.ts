"use server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

type ConvertImageToTextOutput = {
  text: string;
  formattedText: string;
  translatedText?: string; // New field for translated text
  contentType: "plain" | "markdown" | "code";
  error: string | null;
};

type ConvertImageToTextInput = {
  file: string;
  type: string;
  language: string;
  translationLanguage?: string | null; // New optional field
  clerkId: string | null;
};

function cleanOcrText(text: string): {
  cleanedText: string;
  formattedText: string;
} {
  const cleaned = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{2,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  const lines = cleaned.split("\n");
  const formattedLines: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^(-|\d+\.)\s/.test(line)) {
      inList = true;
      formattedLines.push(line);
    } else if (inList && line) {
      if (line.startsWith("  ")) {
        formattedLines.push(line);
      } else {
        inList = false;
        formattedLines.push(line);
      }
    } else {
      inList = false;
      formattedLines.push(line);
    }
  }

  const formattedText = formattedLines.join("\n");
  return { cleanedText: cleaned, formattedText };
}

function fixMarkdownLists(text: string): string {
  const lines = text.split("\n");
  const fixedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (line.match(/^-+\s{2,}/)) {
      line = line.replace(/^-+\s{2,}/, "- ");
    } else if (line.match(/^\*\s{2,}/)) {
      line = line.replace(/^\*\s{2,}/, "- ");
    }
    fixedLines.push(line);
  }

  return fixedLines.join("\n");
}

function stripCodeBlockMarkers(text: string): string {
  let cleaned = text.replace(/^```[\w\s]*\n/, "").replace(/\n```$/, "");
  cleaned = cleaned.trim();
  return cleaned;
}

export async function convertImageToText({
  file,
  type,
  translationLanguage,
  clerkId,
}: ConvertImageToTextInput): Promise<ConvertImageToTextOutput> {
  try {
    let prismaUserId: string | null = null;
    if (clerkId) {
      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) {
        return {
          error: "User not found",
          text: "",
          formattedText: "",
          contentType: "plain",
        };
      }
      prismaUserId = user.id;

      const creditsRequired =
        type === "pdf-to-text"
          ? 3
          : type === "code"
          ? 3
          : type === "text-ai"
          ? 2
          : 1;
      if (user.credits < creditsRequired) {
        return {
          error: "Insufficient credits",
          text: "",
          formattedText: "",
          contentType: "plain",
        };
      }
    }

    let text: string;
    let formattedText: string;
    let translatedText: string | undefined;
    let contentType: "plain" | "markdown" | "code" = "plain";

    if (type === "text" || type === "pdf-to-text") {
      const ocrLanguage = "eng";
      const formData = new FormData();
      if (type === "text") {
        formData.append("base64Image", file);
      } else {
        formData.append("base64Image", file);
      }
      formData.append("language", ocrLanguage);
      formData.append("isOverlayRequired", "false");
      formData.append("filetype", type === "pdf-to-text" ? "PDF" : "JPG");
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
        return {
          error: "Failed to extract text from file",
          text: "",
          formattedText: "",
          contentType: "plain",
        };
      }

      const { cleanedText, formattedText: ocrFormatted } = cleanOcrText(text);
      text = cleanedText;
      formattedText = ocrFormatted;
      contentType = "markdown";
    } else if (type === "text-ai" || type === "code") {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt =
        type === "code"
          ? "Extract the code from this image and return only the raw code text as it appears in the image, with proper indentation and syntax preserved. Do not include any Markdown formatting, code block markers (like ```), language identifiers (like ```typescript), or any additional explanations. If no code is present, return the plain text formatted as Markdown with proper headings, lists, and paragraphs."
          : "Extract the text from this image and format it as well-structured Markdown. Use headings, lists, and paragraphs as appropriate. For key-value pairs (e.g., 'Key: Value'), format them as a Markdown list using '- **Key:** Value'. Ensure proper Markdown syntax for lists, tables, and headings. Do not add any extra explanations.";

      const base64Data = file.split(",")[1];
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
      ]);

      formattedText = result.response.text();
      if (type === "code") {
        formattedText = stripCodeBlockMarkers(formattedText);
      } else {
        formattedText = fixMarkdownLists(formattedText);
      }
      text = formattedText;
      contentType = type === "code" ? "code" : "markdown";

      // Handle translation for text-ai if translationLanguage is provided
      if (type === "text-ai" && translationLanguage) {
        const languageMap: { [key: string]: string } = {
          es: "Spanish",
          fr: "French",
          de: "German",
          hi: "Hindi",
          bn: "Bengali",
          en: "English"
        };
        const targetLanguage = languageMap[translationLanguage];
        if (!targetLanguage) {
          throw new Error("Invalid translation language");
        }

        const translationPrompt = `Translate the following text to ${targetLanguage}. Return only the translated text without any additional explanations or formatting:\n\n${text}`;
        const translationResult = await model.generateContent([
          translationPrompt,
        ]);
        translatedText = translationResult.response.text().trim();
      }
    } else {
      return {
        error:
          "Invalid conversion type. Supported types are 'text', 'pdf-to-text', 'text-ai', and 'code'.",
        text: "",
        formattedText: "",
        contentType: "plain",
      };
    }

    if (clerkId && prismaUserId) {
      const creditsDeducted =
        type === "pdf-to-text"
          ? 3
          : type === "code"
          ? 3
          : type === "text-ai"
          ? 2
          : 1;
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
            output: text, // Store only the extracted text
          },
        }),
        prisma.user.update({
          where: { id: prismaUserId },
          data: { credits: { decrement: creditsDeducted } },
        }),
      ]);
    } else {
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
          output: text, // Store only the extracted text
        },
      });
    }

    return { text, formattedText, translatedText, contentType, error: null };
  } catch (error) {
    console.error(
      `${
        type === "text" || type === "pdf-to-text" ? "OCR.Space" : "Gemini"
      } conversion error:`,
      error
    );
    return {
      error: (error as Error).message,
      text: "",
      formattedText: "",
      contentType: "plain",
    };
  }
}
