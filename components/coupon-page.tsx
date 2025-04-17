"use client";

import { useState } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Gift, Loader2, Lock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";

export function CouponPage() {
  const queryClient = useQueryClient();
  const { isSignedIn, isLoaded } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(
    null
  );

  const handleRedeem = async () => {
    if (!couponCode) {
      setAlert({ title: "Error", message: "Please enter a coupon code." });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/coupon/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          title: "Success",
          message: `Coupon redeemed! You received ${data.credits} credits.`,
        });
        await queryClient.invalidateQueries({ queryKey: ["userCredits"] });
      } else {
        setAlert({ title: "Error", message: "Failed to redeem coupon." });
      }
    } catch {
      setAlert({ title: "Error", message: "Failed to redeem coupon." });
    } finally {
      setLoading(false);
      setCouponCode("");
    }
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center w-full">
        <Card className="w-full max-w-md border-2 border-muted shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Sign In Required
            </CardTitle>
            <CardDescription>
              You need to be signed in to redeem coupon codes.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-6 pt-2">
            <SignInButton mode="modal">
              <Button
                variant="link"
                className="mt-1 h-auto p-0 text-blue-500 w-full"
              >
                Sign In to Continue
              </Button>
            </SignInButton>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
      <div className="mb-8 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Redeem Your Coupon
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your coupon code below to receive credits to your account
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <Card className="border-2 border-muted shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <span>Redeem Coupon</span>
            </CardTitle>
            <CardDescription>
              Enter your coupon code to receive credits instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter coupon code (e.g. WELCOME50)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={loading}
                className="h-12 text-lg tracking-wider placeholder:text-sm"
                maxLength={16}
              />
              {couponCode && (
                <p className="text-xs text-muted-foreground">
                  Coupon codes are case-insensitive and will be converted to
                  uppercase
                </p>
              )}
            </div>
            <Button
              onClick={handleRedeem}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redeeming...
                </>
              ) : (
                "Redeem Coupon"
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col text-sm text-muted-foreground">
            <p>Coupon can only be redeemed once per account.</p>
          </CardFooter>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal space-y-2 pl-5">
                <li>Enter your unique coupon code</li>
                <li>Click the Redeem Coupon button</li>
                <li>Credits will be added to your account</li>
                <li>Use your credits for purchases</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you&rsquo;re having trouble redeeming your coupon, please
                contact our support team for assistance.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {alert && (
        <AlertDialog open={!!alert} onOpenChange={() => setAlert(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alert.title}</AlertDialogTitle>
              <AlertDialogDescription>{alert.message}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => setAlert(null)}>Close</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
