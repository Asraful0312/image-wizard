// app/HistoryPage.tsx
"use client";

import { useState } from "react";
import { Eye, FileText, Code } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface Conversion {
  id: string;
  date: string;
  type: "text" | "code";
  inputUrl: string;
  output: string;
}

// Define the API response type
interface ConversionsResponse {
  conversions: Conversion[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

async function fetchConversions(
  page: number,
  pageSize: number
): Promise<ConversionsResponse> {
  const response = await fetch(
    `/api/conversions?page=${page}&pageSize=${pageSize}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch conversions");
  }
  return response.json();
}

export function HistoryPage() {
  const { isSignedIn, user } = useUser();
  const [selectedItem, setSelectedItem] = useState<Conversion | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery<ConversionsResponse, Error>({
    queryKey: ["conversions", page],
    queryFn: () => fetchConversions(page, pageSize),
    enabled: isSignedIn && !!user,
    placeholderData: keepPreviousData, // Updated for v5
  });

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <h2 className="mb-4 text-xl font-semibold">Sign In Required</h2>
            <p className="mb-6 text-center text-gray-600">
              Please sign in to view your conversion history.
            </p>
            <SignInButton mode="modal">
              <Button className="transition-transform duration-200 hover:scale-105">
                Sign In
              </Button>
            </SignInButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        Conversion History
      </h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Recent Conversions</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading history...</p>
          ) : error ? (
            <p className="text-center text-red-500">
              Failed to load history: {error.message}
            </p>
          ) : !data?.conversions?.length ? (
            <p className="text-center text-gray-500">No conversions yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Date</TableHead>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
                      <TableHead className="whitespace-nowrap">
                        Input Preview
                      </TableHead>
                      <TableHead className="whitespace-nowrap">
                        Output
                      </TableHead>
                      <TableHead className="whitespace-nowrap w-[80px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.conversions.map((item: Conversion) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.type === "text" ? (
                              <FileText className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Code className="h-4 w-4 text-purple-500" />
                            )}
                            <span className="capitalize">{`Image to ${item.type}`}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Image
                            src="/placeholder.png"
                            alt="Input preview"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.output}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedItem(item)}
                                className="transition-all duration-200 hover:scale-110"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View details</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle>Conversion Details</DialogTitle>
                              </DialogHeader>
                              {selectedItem && (
                                <div className="grid gap-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h3 className="mb-2 text-sm font-medium">
                                        Date
                                      </h3>
                                      <p>
                                        {new Date(
                                          selectedItem.date
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <h3 className="mb-2 text-sm font-medium">
                                        Type
                                      </h3>
                                      <p className="capitalize">{`Image to ${selectedItem.type}`}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h3 className="mb-2 text-sm font-medium">
                                      Input Image
                                    </h3>
                                    <Image
                                      src="/placeholder.png"
                                      alt="Input"
                                      height={300}
                                      width={200}
                                      className="h-40 w-auto rounded-md object-contain"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="mb-2 text-sm font-medium">
                                      Output
                                    </h3>
                                    <div
                                      className={`max-h-[300px] overflow-auto rounded-md bg-gray-50 p-4 ${
                                        selectedItem.type === "code"
                                          ? "font-mono text-sm"
                                          : ""
                                      }`}
                                    >
                                      {selectedItem.type === "code" ? (
                                        <pre>{selectedItem.output}</pre>
                                      ) : (
                                        <p>{selectedItem.output}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {data.totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <Button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {data.page} of {data.totalPages}
                  </span>
                  <Button
                    disabled={page === data.totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
