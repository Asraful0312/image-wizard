import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCodeLanguage = (text: string) => {
  if (text.includes("<") && text.includes(">")) return "html";
  if (text.includes("{") && text.includes(":")) return "css";
  if (text.includes("function") || text.includes("class")) return "javascript";
  return "plaintext";
};

export const detectCode = (text: string) => {
  const codePatterns = [
    /function\s+\w+\s*\(/,
    /class\s+\w+/,
    /<\w+.*>/,
    /{\s*[\w-]+\s*:\s*[^;]+;?\s*}/,
    /(if|for|while)\s*\(/,
  ];
  return codePatterns.some((pattern) => pattern.test(text));
};
