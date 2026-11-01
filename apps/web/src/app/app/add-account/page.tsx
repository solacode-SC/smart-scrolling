"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  Youtube,
  Rss,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function AddAccountPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("YOUTUBE");
  const [identifier, setIdentifier] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const platforms = [
    {
      id: "YOUTUBE",
      name: "YouTube",
      status: "SUPPORTED",
      hint: "Channel handle (e.g. @veritasium) or Channel URL",
      badge: "SUPPORTED",
      badgeVariant: "success" as const,
    },
    {
      id: "REDDIT",
      name: "Reddit",
      status: "SUPPORTED",
      hint: "Subreddit name (e.g. r/technology) or creator user",
      badge: "SUPPORTED",
      badgeVariant: "success" as const,
    },
    {
      id: "RSS",
      name: "RSS / Atom",
      status: "SUPPORTED",
      hint: "Feed URL (e.g. https://news.ycombinator.com/rss)",
      badge: "SUPPORTED",
      badgeVariant: "success" as const,
    },
    {
      id: "X",
      name: "X (Twitter)",
      status: "AUTH_REQUIRED",
      hint: "X username (e.g. @jack)",
      badge: "AUTH REQUIRED",
      badgeVariant: "warning" as const,
    },
    {
      id: "TIKTOK",
      name: "TikTok",
      status: "AUTH_REQUIRED",
      hint: "TikTok creator handle",
      badge: "AUTH REQUIRED",
      badgeVariant: "warning" as const,
    },
    {
      id: "INSTAGRAM",
      name: "Instagram",
      status: "AUTH_REQUIRED",
      hint: "Instagram professional creator account",
      badge: "AUTH REQUIRED",
      badgeVariant: "warning" as const,
    },
  ];

  const currentPlatform = platforms.find((p) => p.id === selectedPlatform);

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      setLoading(false);
      setFeedback(
        `Source validation prepared for ${selectedPlatform}: ${identifier}`,
      );
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="pb-4 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add Account
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Follow creators, publications, subreddits, and open feeds across
          supported platforms.
        </p>
      </div>

      {/* Platform Selection */}
      <div className="space-y-3">
        <Label>Select Platform</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {platforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedPlatform(p.id);
                setFeedback(null);
              }}
              className={`flex flex-col items-start p-3.5 rounded-lg border text-left transition-all ${
                selectedPlatform === p.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/70 bg-card hover:bg-secondary/60"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-semibold text-sm text-foreground">
                  {p.name}
                </span>
                <Badge
                  variant={p.badgeVariant}
                  className="text-[10px] px-1.5 py-0"
                >
                  {p.badge}
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground line-clamp-1">
                {p.hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Form */}
      <Card className="border border-border/80">
        <CardHeader>
          <CardTitle className="text-lg">
            Connect to {currentPlatform?.name}
          </CardTitle>
          <CardDescription>
            {currentPlatform?.status === "AUTH_REQUIRED"
              ? "This platform requires developer API credentials or OAuth authorization."
              : `Enter the profile identifier or URL to follow this ${currentPlatform?.name} source.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePreview} className="space-y-4">
            {feedback && (
              <div className="rounded-md bg-secondary border border-border p-3 text-xs text-foreground flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                {feedback}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="identifier">Profile Identifier or URL</Label>
              <Input
                id="identifier"
                placeholder={currentPlatform?.hint}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Category (Optional)</Label>
              <Input
                id="category"
                placeholder="e.g. Technology, Design, News, Gaming"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              className="w-full sm:w-auto"
            >
              Preview &amp; Add to Feed
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
