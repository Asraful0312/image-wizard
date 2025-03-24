"use client";

import { useState, useEffect } from "react";
import { Eye, FileText, Code } from "lucide-react";
import { useUser, SignInButton } from "@clerk/nextjs"; // Clerk integration
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
  date: string; // ISO string from database
  type: "text" | "code";
  inputUrl: string; // URL of the uploaded image
  output: string;
}

export function HistoryPage() {
  const { isSignedIn, user } = useUser(); // Clerk auth state
  const [history, setHistory] = useState<Conversion[]>([]);
  const [selectedItem, setSelectedItem] = useState<Conversion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch conversion history when authenticated
  useEffect(() => {
    if (isSignedIn && user) {
      const fetchHistory = async () => {
        try {
          setIsLoading(true);
          const res = await fetch("/api/conversions"); // New endpoint for history
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to fetch history");
          setHistory(data.conversions);
        } catch (error) {
          console.error("Fetch history error:", error);
          alert( "Failed to load conversion history");
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    } else {
      setIsLoading(false); // No need to load if not signed in
    }
  }, [isSignedIn, user]);

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
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">
        Conversion History
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-gray-500">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-center text-gray-500">No conversions yet.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Input Preview</TableHead>
                      <TableHead>Output</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
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
                                      src={"/placeholder.png"}
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

              {/* Responsive view for mobile */}
              <div className="mt-6 grid gap-4 md:hidden">
                {history.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.type === "text" ? (
                              <FileText className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Code className="h-4 w-4 text-purple-500" />
                            )}
                            <span className="font-medium capitalize">{`Image to ${item.type}`}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Image
                            src={"/placeholder.png"}
                            width={48}
                            height={48}
                            alt="Input preview"
                            className="h-12 w-12 rounded object-cover"
                          />
                          <div className="flex-1">
                            <p className="line-clamp-2 text-sm">
                              {item.output}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                                className="transition-all duration-200 hover:scale-105"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
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
                                      src={"/placeholder.png"}
                                      width={300}
                                      height={200}
                                      alt="Input"
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
