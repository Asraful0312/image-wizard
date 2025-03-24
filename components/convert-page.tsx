"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect, Suspense } from "react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ConvertPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const { isSignedIn, user } = useUser();
  const [freeConversions, setFreeConversions] = useState(0);
  const [credits, setCredits] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<string>(
    typeParam || "text"
  );
  const [language, setLanguage] = useState<string>("eng");
  const [result, setResult] = useState<string | null>(null);
  const [isCodeDetected, setIsCodeDetected] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      const stored = parseInt(localStorage.getItem("freeConversions") || "0");
      setFreeConversions(stored);
      setCredits(0);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn && user) {
      const fetchCredits = async () => {
        try {
          const res = await fetch("/api/user/credits");
          if (!res.ok) throw new Error("Failed to fetch credits");
          const data = await res.json();
          setCredits(data.credits ?? 0);
        } catch (error) {
          console.error("Fetch credits error:", error);
          alert("Failed to load your credits");
          setCredits(0);
        }
      };
      fetchCredits();
    }
  }, [isSignedIn, user]);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleConvert = async () => {
    if (!selectedFile) return;

    if (!isSignedIn && freeConversions >= 3 && conversionType === "text") {
      alert("Please sign in to continue with free Tesseract conversions");
      return;
    }

    if (isSignedIn) {
      const creditsRequired =
        conversionType === "code" ? 3 : conversionType === "text-ai" ? 2 : 0;
      if (credits === null || credits < creditsRequired) {
        alert("Insufficient credits or credits not loaded");
        return;
      }
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("type", conversionType);
      if (conversionType === "text") formData.append("language", language);

      const endpoint =
        conversionType === "text" ? "/api/convert" : "/api/convert-code";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setIsLoading(false);
        throw new Error(errorData.error || "Conversion failed");
      }

      const data = await res.json();

      const isCode = data.type === "code" || detectCode(data.text);
      setIsCodeDetected(isCode);
      setResult(data.text);

      if (!isSignedIn && conversionType === "text") {
        const newCount = freeConversions + 1;
        setFreeConversions(newCount);
        localStorage.setItem("freeConversions", newCount.toString());
      } else if (isSignedIn) {
        const creditsDeducted =
          conversionType === "code" ? 3 : conversionType === "text-ai" ? 2 : 0;
        setCredits((prev) => (prev !== null ? prev - creditsDeducted : 0));
        const creditsRes = await fetch("/api/user/credits");
        const creditsData = await creditsRes.json();
        setCredits(creditsData.credits ?? 0);
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("An error occurred during conversion");
    } finally {
      setIsLoading(false);
      toast.success("Image converted successfully");
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const detectCode = (text: string) => {
    const codePatterns = [
      /function\s+\w+\s*\(/,
      /class\s+\w+/,
      /<\w+.*>/,
      /{\s*[\w-]+\s*:\s*[^;]+;?\s*}/,
      /(if|for|while)\s*\(/,
    ];
    return codePatterns.some((pattern) => pattern.test(text));
  };

  const getCodeLanguage = (text: string) => {
    if (text.includes("<") && text.includes(">")) return "html";
    if (text.includes("{") && text.includes(":")) return "css";
    if (text.includes("function") || text.includes("class"))
      return "javascript";
    return "plaintext";
  };

  const handleBuyCredits = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // No packageId needed
      });
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate credit purchase");
    }
  };

  return (
    <Suspense fallback="<div>Loading...</div>">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-2xl font-bold md:text-3xl">
          Convert Your Image
        </h1>

        <div className="mb-6 grid gap-6 md:grid-cols-[2fr_1fr]">
          <div>
            <FileUpload onFileSelected={handleFileSelected} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Conversion Settings</CardTitle>
            </CardHeader>
            <CardContent>
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
                          Free (Tesseract)
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
                {conversionType === "text" && (
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
                        <SelectItem value="ben">Bangla (Bengali)</SelectItem>
                        <SelectItem value="hin">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {!isSignedIn && conversionType !== "text" ? (
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
                        conversionType === "text") ||
                      (isSignedIn &&
                        (credits === null ||
                          (conversionType === "code" && credits < 3) ||
                          (conversionType === "text-ai" && credits < 2)))
                    }
                    className="w-full bg-blue-500 hover:bg-blue-600 transition-transform duration-200 hover:scale-105"
                  >
                    {isLoading ? "Converting..." : "Convert"}
                  </Button>
                )}

                {!isSignedIn && (
                  <div className="mt-4 text-center">
                    <p className="text-sm font-medium">
                      Free Tesseract Conversions Left: {3 - freeConversions}/3
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
                      Credits: {credits === null ? "Loading..." : credits}
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

        {result && (
          <Card className="mb-6">
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
            <CardContent>
              <div
                className={cn(
                  "max-h-[400px] overflow-auto rounded-md p-4",
                  conversionType === "code"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-black"
                )}
              >
                {isCodeDetected ? (
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
                ) : (
                  <p>{result}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Suspense>
  );
}
