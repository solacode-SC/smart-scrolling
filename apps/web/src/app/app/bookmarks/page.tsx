"use client";

import React, { useState } from "react";
import { Bookmark, FolderOpen, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bookmarks
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Saved articles, videos, and discussions organized into personal
            collections.
          </p>
        </div>

        <a href="/app/collections">
          <Button variant="outline" size="sm">
            <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
            Manage Collections
          </Button>
        </a>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks saved yet"
          description="Click the bookmark icon on any post in your feed to save it for reading later or categorize into collections."
          action={
            <a href="/app/feed">
              <Button>Browse Your Feed</Button>
            </a>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Populated bookmarks list will render here */}
        </div>
      )}
    </div>
  );
}
