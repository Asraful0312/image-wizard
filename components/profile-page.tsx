// app/profile/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Loader from "./Loader";

type ProfileData = {
  email: string;
  credits: number;
  memberSince: string;
  purchases: {
    id: string;
    date: string;
    credits: number;
    amount: number;
    variant?: string;
  }[];
};

async function fetchProfileData(): Promise<ProfileData> {
  const res = await fetch("/api/profile");
  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }
  return res.json();
}

export function ProfilePage() {
  const { isSignedIn } = useUser();

  const {
    data: profileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfileData,
    enabled: isSignedIn, // Only fetch when user is signed in
    retry: 1, // Retry once on failure
  });

  const handleBuyCredits = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate credit purchase");
    }
  };

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-6">
            <h2 className="mb-4 text-xl font-semibold">Sign In Required</h2>
            <p className="mb-6 text-center text-gray-600">
              Please sign in to view your profile.
            </p>
            <Button
              asChild
              className="transition-transform duration-200 hover:scale-105"
            >
              <a href="/sign-in">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading profile data</div>;

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-xl md:text-2xl font-bold ">Your Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="mb-4 text-center">
                <p className="text-3xl font-bold">{profileData?.credits}</p>
                <p className="text-sm text-gray-500">Available Credits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="w-full">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p>{profileData?.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Plan</h3>
                <p>Pay As You Go</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Member Since
                </h3>
                {profileData?.memberSince && (
                  <p>
                    {new Date(profileData?.memberSince).toLocaleDateString()}
                  </p>
                )}
              </div>
              <SignOutButton>
                <Button
                  variant="outline"
                  className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-transform duration-200 hover:scale-105"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </SignOutButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 w-full">
        <CardHeader>
          <CardTitle>Buy Credits</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <Button
            onClick={handleBuyCredits}
            className="bg-green-500 hover:bg-green-600 transition-transform duration-200 hover:scale-105"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Buy Credits
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 w-full">
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          {profileData?.purchases.length === 0 ? (
            <p>No purchase history available.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="overflow-x-auto">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Credits Bought</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Package</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profileData?.purchases.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {new Date(item.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.credits}</TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>{item.variant || "Unknown"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
