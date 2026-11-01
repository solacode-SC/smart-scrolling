"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Users, ArrowLeft, Plus, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SharedFeedDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <a
          href="/app/shared"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Shared Feeds
        </a>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Shared Feed: {id}
            </h1>
            <Badge variant="terracotta">PUBLIC</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Curated sources collection. Read and subscribe without exposing
            personal credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share Link
          </Button>
          <Button size="sm">Join Feed</Button>
        </div>
      </div>

      <div className="rounded-lg border border-border/70 p-6 bg-card text-center space-y-3">
        <Users className="h-8 w-8 text-muted-foreground mx-auto" />
        <h3 className="text-sm font-semibold">Feed Sources and Posts</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Posts from approved sources in this collection will appear here.
        </p>
      </div>
    </div>
  );
}
