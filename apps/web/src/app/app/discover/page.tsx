"use client";

import React, { useState } from "react";
import { Compass, Search, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default function DiscoverPage() {
  const [search, setSearch] = useState("");

  const featured = [
    {
      id: "tech-innovators",
      title: "AI & Engineering Research",
      description:
        "Curated mix of top AI researchers on YouTube, arXiv RSS feeds, and machine learning Subreddits.",
      sourcesCount: 14,
      membersCount: 89,
      tags: ["AI", "Research", "Tech"],
    },
    {
      id: "design-systems",
      title: "Design Systems & UI Engineering",
      description:
        "Design publications, frontend engineering blogs, and UI breakdown creators.",
      sourcesCount: 9,
      membersCount: 42,
      tags: ["UI/UX", "Frontend", "Design"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="pb-4 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Discover
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Explore curated shared feeds created by the community.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search topics, publications, or shared feeds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">
          Featured Shared Feeds
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map((feed) => (
            <Card
              key={feed.id}
              className="hover:border-primary/40 transition-colors flex flex-col justify-between"
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="terracotta">{feed.tags[0]}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> {feed.membersCount} members
                  </span>
                </div>
                <CardTitle className="text-base">{feed.title}</CardTitle>
                <CardDescription className="text-xs line-clamp-2">
                  {feed.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                  <span>{feed.sourcesCount} sources</span>
                  <a href={`/app/shared/${feed.id}`}>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      View Feed
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
