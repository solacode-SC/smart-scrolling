"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SyncSettingsPage() {
  const { user, updatePreferences } = useAuth();

  const [syncEnabled, setSyncEnabled] = useState(
    user?.preference?.syncEnabled ?? true,
  );
  const [syncInterval, setSyncInterval] = useState(
    user?.preference?.syncIntervalMinutes ?? 30,
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.preference?.notificationsEnabled ?? true,
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updatePreferences({
        syncEnabled,
        syncIntervalMinutes: syncInterval,
        notificationsEnabled,
      });
      setMessage("Synchronization parameters updated successfully.");
    } catch (err: any) {
      alert(err?.message || "Failed to update sync settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Background Sync Frequency</CardTitle>
          <CardDescription className="text-xs">
            Configure how frequently the autonomous BullMQ agent polls your
            connected platforms.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-400">
              {message}
            </div>
          )}

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={syncEnabled}
              onChange={(e) => setSyncEnabled(e.target.checked)}
              className="rounded border-input text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">
              Enable automated background synchronization
            </span>
          </label>

          <div className="space-y-2 pt-2">
            <Label>Preferred Polling Interval</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { value: 15, label: "Every 15 mins (Active)" },
                { value: 30, label: "Every 30 mins (Standard)" },
                { value: 60, label: "Every 1 hour (Relaxed)" },
                { value: 120, label: "Every 2 hours (Conserve)" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSyncInterval(opt.value)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                    syncInterval === opt.value
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/70 hover:bg-secondary/60 text-muted-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Note: Provider API rate limits always take precedence over custom
              intervals.
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-border/60">
            <Label>Notification Alerts</Label>
            <label className="flex items-center gap-2.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-foreground">
                Notify me when a provider authentication expires or rate limits
                are reached
              </span>
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" onClick={handleSave} isLoading={saving}>
            Save Sync Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
