// app/components/file-upload.tsx
"use client";
export const dynamic = "force-dynamic";

import type React from "react";
import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

export function FileUpload({ onFileSelected }: FileUploadProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    const maxSizeMB = 1;

    if (!isPDF && !isImage) {
      alert("Please upload an image or a PDF file.");
      return;
    }

    if (isPDF && file.size > maxSizeMB * 1024 * 1024) {
      alert("PDF must be less than 1MB.");
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);

    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null); // No preview for PDFs
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 w-full">
        {!selectedFile ? (
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors w-full ${
              dragActive ? "border-blue-500 bg-purple-50" : "border-gray-300"
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
              Supports: JPG, PNG, GIF, PDF (max 1MB)
            </p>
            <Button
              onClick={() => inputRef.current?.click()}
              className="transition-transform duration-200 hover:scale-105 bg-purple-600 hover:bg-purple-700"
            >
              Browse Files
            </Button>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={handleChange}
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
      </CardContent>
    </Card>
  );
}
