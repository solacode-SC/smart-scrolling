"use client";

import React, { useState } from "react";
import { Users, Plus, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SharedFeedsPage() {
  const [feeds, setFeeds] = useState<any[]>([]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Shared Feeds
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curate and share collections of sources with teams, communities, or
            publicly.
          </p>
        </div>

        <Button size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create Shared Feed
        </Button>
      </div>

      {feeds.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No shared feeds created yet"
          description="Create a shared feed to bundle multiple YouTube creators, Subreddits, and RSS publications into a single shareable stream."
          action={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Shared Feed
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {feeds.map((feed) => (
            <Card key={feed.id}>
              <CardHeader>
                <CardTitle>{feed.name}</CardTitle>
                <CardDescription>{feed.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
