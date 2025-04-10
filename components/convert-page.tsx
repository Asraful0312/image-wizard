"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Check, Sparkles } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn, getCodeLanguage } from "@/lib/utils";
import { toast } from "sonner";
import { convertImageToText } from "@/actions";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function fetchCredits() {
  const res = await fetch("/api/user/credits");
  if (!res.ok) throw new Error("Failed to fetch credits");
  const data = await res.json();
  return data.credits ?? 0;
}

export function ConvertPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const { isSignedIn, user } = useUser();
  const queryClient = useQueryClient();

  const [freeConversions, setFreeConversions] = useState(0);
  const [contentType, setContentType] = useState<"plain" | "markdown" | "code">(
    "plain"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>(
    typeParam || "text"
  );
  const [language, setLanguage] = useState<string>("eng");
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch credits with React Query
  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ["userCredits"],
    queryFn: fetchCredits,
    enabled: isSignedIn && !!user, // Only fetch if signed in
    initialData: isSignedIn ? null : 0, // Default to 0 if not signed in
  });

  useEffect(() => {
    if (typeParam) {
      setConversionType(typeParam);
    }
  }, [typeParam]);

  useEffect(() => {
    if (!isSignedIn) {
      const stored = parseInt(localStorage.getItem("freeConversions") || "0");
      setFreeConversions(stored);
    }
  }, [isSignedIn]);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    if (
      !isSignedIn &&
      freeConversions >= 3 &&
      (conversionType === "text" || conversionType === "pdf-to-text")
    ) {
      alert("Please sign in to continue with free conversions");
      return;
    }

    if (isSignedIn) {
      const creditsRequired =
        conversionType === "pdf-to-text"
          ? 3
          : conversionType === "code"
          ? 3
          : conversionType === "text-ai"
          ? 2
          : 1;
      if (credits === null || credits < creditsRequired) {
        alert("Insufficient credits or credits not loaded");
        return;
      }
    }

    setIsLoading(true);
    try {
      const buffer = await selectedFile.arrayBuffer();
      const base64File = `data:${selectedFile.type};base64,${Buffer.from(
        buffer
      ).toString("base64")}`;

      const { formattedText, contentType, error } = await convertImageToText({
        file: base64File,
        type: conversionType,
        language,
        clerkId: user?.id || null,
      });

      if (error) {
        throw new Error(error);
      }

      setResult(formattedText);
      setContentType(contentType);
      toast.success("Conversion successful");

      if (
        !isSignedIn &&
        (conversionType === "text" || conversionType === "pdf-to-text")
      ) {
        const newCount = freeConversions + 1;
        setFreeConversions(newCount);
        localStorage.setItem("freeConversions", newCount.toString());
      } else if (isSignedIn) {
        // Refetch credits after conversion
        await queryClient.invalidateQueries({ queryKey: ["userCredits"] });
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("An error occurred during conversion");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBuyCredits = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const { checkoutUrl } = await res.json();
      window.open(checkoutUrl, "_blank");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate credit purchase");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Convert Your File</h1>

      <div className="mb-6 grid gap-6 w-full lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FileUpload onFileSelected={handleFileSelected} />
        </div>
        <Card className="w-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversion Settings</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Conversion Type
                </label>
                <Select
                  value={conversionType}
                  onValueChange={setConversionType}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="text">
                      Image to Text{" "}
                      <span className="rounded-full bg-yellow-100 text-xs py-0.5 px-2">
                        {isSignedIn
                          ? "1 credit (OCR.Space)"
                          : "Free (OCR.Space)"}
                      </span>
                    </SelectItem>
                    <SelectItem value="pdf-to-text">
                      PDF to Text{" "}
                      <span className="rounded-full bg-yellow-100 text-xs py-0.5 px-2">
                        {isSignedIn
                          ? "3 credits (OCR.Space)"
                          : "Free (OCR.Space)"}
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="text-ai"
                      className="flex items-center gap-1"
                    >
                      Image to Text{" "}
                      <span className="flex items-center">
                        (
                        <Sparkles className="shrink-0 size-3 text-purple-500" />{" "}
                        AI)
                      </span>
                      <span className="rounded-full bg-yellow-100 text-xs py-0.5 px-2">
                        2 credits
                      </span>
                    </SelectItem>
                    <SelectItem
                      value="code"
                      className="flex items-center gap-1"
                    >
                      Image to Code{" "}
                      <span className="flex items-center">
                        (
                        <Sparkles className="shrink-0 size-3 text-purple-500" />{" "}
                        AI)
                      </span>
                      <span className="rounded-full bg-yellow-100 text-xs py-0.5 px-2">
                        3 credits
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(conversionType === "text" ||
                conversionType === "pdf-to-text") && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Language
                  </label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="eng">English</SelectItem>
                      <SelectItem value="ben" disabled>
                        Bangla (Bengali) - Not Supported
                      </SelectItem>
                      <SelectItem value="hin" disabled>
                        Hindi - Not Supported
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">
                    Note: Only English is supported for OCR.Space conversions.
                    use AI model for more accurate conversions.
                  </p>
                </div>
              )}

              {!isSignedIn &&
              (conversionType === "text-ai" || conversionType === "code") ? (
                <SignInButton mode="modal">
                  <Button
                    variant="link"
                    className="mt-1 h-auto p-0 text-blue-500 w-full"
                  >
                    Sign In to Continue
                  </Button>
                </SignInButton>
              ) : (
                <Button
                  onClick={handleConvert}
                  disabled={
                    !selectedFile ||
                    (!isSignedIn &&
                      freeConversions >= 3 &&
                      (conversionType === "text" ||
                        conversionType === "pdf-to-text")) ||
                    (isSignedIn &&
                      (credits === null ||
                        credits === undefined ||
                        (conversionType === "pdf-to-text" && credits < 3) ||
                        (conversionType === "code" && credits < 3) ||
                        (conversionType === "text-ai" && credits < 2) ||
                        (conversionType === "text" && credits < 1)))
                  }
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-transform duration-200 hover:scale-105"
                >
                  {isLoading ? "Converting..." : "Convert"}
                </Button>
              )}

              {!isSignedIn && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium">
                    Free Conversions Left: {3 - freeConversions}/3
                  </p>
                  {freeConversions >= 3 && (
                    <SignInButton mode="modal">
                      <Button
                        variant="link"
                        className="mt-1 h-auto p-0 text-blue-500"
                      >
                        Sign In to Continue
                      </Button>
                    </SignInButton>
                  )}
                </div>
              )}

              {isSignedIn && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Credits:{" "}
                    {creditsLoading ? "Loading..." : credits ?? "Not loaded"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBuyCredits}
                    className="text-green-500 border-green-500 hover:bg-green-50 hover:text-green-600 transition-transform duration-200 hover:scale-105"
                  >
                    Buy Credits
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {!isLoading && result && (
        <Card className="mb-6 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Conversion Result</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="transition-all duration-200 hover:scale-105"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </CardHeader>
          <CardContent className="w-full">
            <div
              className={cn(
                "max-h-[400px] overflow-auto rounded-md p-4 w-full",
                contentType === "code"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-black"
              )}
            >
              {contentType === "code" ? (
                <SyntaxHighlighter
                  language={getCodeLanguage(result)}
                  style={vscDarkPlus}
                  customStyle={{
                    background: "transparent",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {result}
                </SyntaxHighlighter>
              ) : contentType === "markdown" ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              ) : (
                <p>{result}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
