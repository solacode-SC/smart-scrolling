"use client";

import React, { useState } from "react";
import { FolderOpen, Plus, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([
    {
      id: "1",
      name: "AI Research",
      description: "Deep learning papers and engineering breakdowns",
      count: 0,
    },
    {
      id: "2",
      name: "Read Later",
      description: "Long-form essays and documentation",
      count: 0,
    },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Collections
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize saved posts into thematic folders.
          </p>
        </div>

        <Button size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          New Collection
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {collections.map((col) => (
          <Card
            key={col.id}
            className="hover:border-primary/40 transition-colors"
          >
            <CardHeader className="space-y-1.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-primary" />
                  {col.name}
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {col.count} items
                </span>
              </div>
              <CardDescription className="text-xs">
                {col.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
