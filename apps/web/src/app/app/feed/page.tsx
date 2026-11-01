"use client";

import React, { useState } from "react";
import { Newspaper, Plus, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeedPage() {
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // Initial empty state for new user

  const filters = [
    { id: "ALL", label: "All Sources" },
    { id: "YOUTUBE", label: "YouTube" },
    { id: "REDDIT", label: "Reddit" },
    { id: "RSS", label: "RSS & Blogs" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Feed
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your personalized, unified stream of creators, subreddits, and
            publications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            isLoading={isLoading}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Sync
          </Button>
          <a href="/app/add-account">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Source
            </Button>
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              selectedFilter === f.id
                ? "bg-foreground text-background font-semibold"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border/70 p-5 space-y-3 bg-card">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <EmptyState
          icon={Newspaper}
          title="Your feed is waiting for sources"
          description="You haven't followed any YouTube creators, Subreddits, or RSS publications yet. Add your favorite sources to start curating your feed."
          action={
            <a href="/app/add-account">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Follow Your First Source
              </Button>
            </a>
          }
        />
      )}
    </div>
  );
}
