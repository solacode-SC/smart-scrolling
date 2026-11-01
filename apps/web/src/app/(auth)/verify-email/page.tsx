"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || "";

  const [token, setToken] = useState(tokenParam);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (tokenToUse: string) => {
    if (!tokenToUse) {
      setError("Please provide a verification token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token: tokenToUse }),
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Verification token is invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenParam) {
      handleVerify(tokenParam);
    }
  }, [tokenParam]);

  return (
    <Card className="border border-border/80 shadow-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Verify your email</CardTitle>
        <CardDescription>
          {success
            ? "Your email address has been successfully verified."
            : "Enter the verification token from your activation email."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {success ? (
          <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              Verification Successful!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              You can now access all authenticated features in your SocialHub
              feed.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="token">Verification Token</Label>
              <Input
                id="token"
                type="text"
                placeholder="Paste verification token here"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        {!success ? (
          <Button
            onClick={() => handleVerify(token)}
            className="w-full"
            isLoading={loading}
          >
            Verify Email
          </Button>
        ) : (
          <a href="/app/feed" className="w-full">
            <Button className="w-full">Proceed to My Feed</Button>
          </a>
        )}
        <p className="text-center text-xs text-muted-foreground">
          <a
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            Back to Sign In
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm mb-3">
            S
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Email Verification
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Confirm your email address for SocialHub.
          </p>
        </div>

        <Suspense
          fallback={
            <Card className="p-6">
              <Skeleton className="h-40 w-full" />
            </Card>
          }
        >
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
