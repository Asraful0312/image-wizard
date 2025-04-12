"use client";

import { useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { Button, buttonVariants } from "./ui/button";
import { Download, FileText, Upload, X } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { ImageComparisonSpring } from "./image-comparition";

export default function RemoveBgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);

      // Create preview for images only
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null); // No preview for PDFs
      }
    } else {
      alert("Please upload an image or PDF file");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Handle file selection
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type.startsWith("image/")) {
      setSelectedFile(file);

      // Create preview for images only
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null); // No preview for PDFs
      alert("Please upload an image or PDF file");
    }

    // Validate file size: max 5MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image too large. Max 5MB.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setResultUrl(null); // Clear previous result
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
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);

      setError("Failed to remove background");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Background Remover</h1>
      <Card className="w-full">
        <CardContent className="p-6 w-full">
          {!selectedFile ? (
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
                Drag and drop your image or PDF here
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Supports: JPG, PNG, GIF, PDF (max 5MB)
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
                {selectedFile.type.startsWith("image/") ? (
                  <Image
                    src={preview || ""}
                    alt="Preview"
                    height={300}
                    width={500}
                    className="mx-auto max-h-[300px] w-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] bg-gray-100">
                    <FileText className="h-16 w-16 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      PDF Preview Not Available
                    </p>
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
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleRemoveBackground}
            disabled={!file || loading}
            className={`px-4 py-2 rounded w-full mt-6 ${
              file
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Removing wait..." : " Remove Background"}
          </button>
        </CardContent>
      </Card>
      {/* <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      /> */}

      {resultUrl && <h2 className="text-2xl font-semibold mt-6">Result</h2>}
      {error && <p className="text-red-500">{error}</p>}
      {resultUrl && (
        <Card className="space-y-2 w-full flex items-center justify-center">
          <CardContent className="flex flex-col justify-center w-full">
            {/* <Image
              src={resultUrl}
              alt="Background Removed"
              height={300}
              width={500}
              className="mx-auto max-h-[300px] w-auto object-contain"
            /> */}

            <ImageComparisonSpring
              preview={preview as string}
              converted={resultUrl}
            />
            <a
              href={resultUrl}
              download="no-bg.png"
              className={buttonVariants({
                className: "flex items-center gap-2 mt-6",
              })}
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
