"use client";

import React from "react";
import {
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Cpu,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActivityPage() {
  const stats = [
    {
      label: "Sync Status",
      value: "Active",
      icon: CheckCircle,
      badge: "HEALTHY",
    },
    { label: "Connected Sources", value: "0", icon: Activity, badge: "IDLE" },
    {
      label: "Next Scheduled Sync",
      value: "In 15m",
      icon: Clock,
      badge: "SCHEDULED",
    },
    { label: "Failed Jobs", value: "0", icon: AlertTriangle, badge: "NONE" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Activity &amp; Sync Health
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor automated background workers, sync intervals, and provider
            rate limits.
          </p>
        </div>

        <Button variant="outline" size="sm">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh Status
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="text-[10px]">
                  {stat.badge}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold text-foreground mt-0.5">
                  {stat.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Sync Jobs Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            Background Synchronization Jobs
          </CardTitle>
          <CardDescription className="text-xs">
            Recent deterministic BullMQ executions, discoveries, and rate-limit
            checkpoints.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/60 p-6 text-center text-xs text-muted-foreground">
            No synchronization history recorded yet. Add sources to trigger the
            background sync agent.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
