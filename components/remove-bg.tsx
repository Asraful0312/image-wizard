"use client";

import { useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Button } from "./ui/button";
import { Download, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { ImageComparisonSpring } from "./image-comparition";
import { toast } from "sonner";

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Unified file handling for both input and drag-and-drop
  const handleFile = (selectedFile: File) => {
    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, GIF)");
      setFile(null);
      setPreview(null);
      return;
    }

    // Validate file size: max 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image too large. Max 5MB.");
      setFile(null);
      setPreview(null);
      return;
    }

    // Clear previous state
    setError(null);
    setFile(selectedFile);
    setResultUrl(null);

    // Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read image file");
      setPreview(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Drag-and-drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  // File input handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  // Clear selected file
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Handle button click to remove background
  const handleRemoveBackground = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Remove background and get Blob
      const resultBlob = await removeBackground(file);

      // Create URL from Blob
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      toast.success("Background removed successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to remove background");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Background Remover</h1>
      <Card className="w-full">
        <CardContent className="p-6 w-full">
          {!file ? (
            <div
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors w-full ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mb-4 h-10 w-10 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium">
                Drag and drop your image here
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Supports: JPG, PNG, GIF (max 5MB)
              </p>
              <Button
                onClick={() => inputRef.current?.click()}
                className="transition-transform duration-200 hover:scale-105"
              >
                Browse Files
              </Button>
              <input
                ref={inputRef}
                className="hidden"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="space-y-4 w-full">
              <div className="relative rounded-lg border overflow-hidden flex flex-col items-center justify-center w-full">
                {preview ? (
                  <Image
                    src={preview}
                    alt="Preview"
                    height={300}
                    width={500}
                    className="mx-auto max-h-[300px] w-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100">
                    <Loader2 className="h-16 w-16 text-gray-400 mb-2 animate-spin" />
                    <p className="text-sm text-gray-600">Loading preview...</p>
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          <p className="text-gray-400 mt-4 text-sm">
            This tool removes backgrounds on your device. Processing time
            depends on your device’s performance—a faster device will remove
            backgrounds more quickly. For best results, use images under 5MB.
          </p>

          <button
            onClick={handleRemoveBackground}
            disabled={!file || loading}
            className={`px-4 py-2 rounded w-full flex items-center justify-center gap-2 mt-6 ${
              file && !loading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading && <Loader2 className="size-5 shrink-0 animate-spin" />}
            {loading ? "Removing wait..." : "Remove Background"}
          </button>
        </CardContent>
      </Card>

      {resultUrl && <h2 className="text-2xl font-semibold mt-6">Result</h2>}
      {error && <p className="text-red-500">{error}</p>}
      {resultUrl && (
        <Card className="space-y-2 w-full flex items-center justify-center">
          <CardContent className="flex flex-col justify-center w-full">
            <ImageComparisonSpring
              preview={preview as string}
              converted={resultUrl}
            />
            <a
              href={resultUrl}
              download="no-bg.png"
              className="flex items-center  justify-center gap-2 mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Download className="shrink-0 size-5" />
              Download Image
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
