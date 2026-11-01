"use client";

import React, { useState } from "react";
import {
  Layers,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
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

export default function FollowingPage() {
  const [accounts, setAccounts] = useState<any[]>([]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Following
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your connected platforms, creators, subreddits, and RSS
            subscriptions.
          </p>
        </div>

        <a href="/app/add-account">
          <Button size="sm">
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Account
          </Button>
        </a>
      </div>

      {accounts.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="You aren't following any accounts yet"
          description="Connect YouTube channels, Reddit communities, RSS feeds, or other platforms to start populating your feed."
          action={
            <a href="/app/add-account">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Source
              </Button>
            </a>
          }
        />
      ) : (
        <div className="space-y-3">{/* List of followed accounts */}</div>
      )}
    </div>
  );
}
