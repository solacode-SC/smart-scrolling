"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-provider";
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

export default function AppearanceSettingsPage() {
  const { user, updatePreferences } = useAuth();
  const { theme: currentClientTheme, setTheme } = useTheme();

  const [theme, setLocalTheme] = useState(user?.preference?.theme || "system");
  const [font, setFont] = useState(user?.preference?.font || "Geist");
  const [fontSize, setFontSize] = useState(user?.preference?.fontSize || "M");
  const [feedDensity, setFeedDensity] = useState(
    user?.preference?.feedDensity || "comfortable",
  );
  const [cardStyle, setCardStyle] = useState(
    user?.preference?.cardStyle || "standard",
  );
  const [contentWidth, setContentWidth] = useState(
    user?.preference?.contentWidth || "standard",
  );
  const [autoplay, setAutoplay] = useState(user?.preference?.autoplay ?? false);
  const [embedLoading, setEmbedLoading] = useState(
    user?.preference?.embedLoading || "click-to-load",
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updatePreferences({
        theme,
        font,
        fontSize,
        feedDensity,
        cardStyle,
        contentWidth,
        autoplay,
        embedLoading,
      });
      setTheme(theme as "light" | "dark" | "system");
      setMessage("Appearance preferences successfully saved and applied.");
    } catch (err: any) {
      alert(err?.message || "Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Reading Experience &amp; Aesthetics
          </CardTitle>
          <CardDescription className="text-xs">
            Tailor the editorial interface to your visual and reading
            preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <div className="rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-700 dark:text-emerald-400">
              {message}
            </div>
          )}

          {/* Theme Option */}
          <div className="space-y-2">
            <Label>Color Palette</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "system", label: "System Default" },
                { id: "light", label: "Warm Neutral Light" },
                { id: "dark", label: "Charcoal Dark" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLocalTheme(opt.id)}
                  className={`p-3 rounded-lg border text-xs font-medium text-left transition-all ${
                    theme === opt.id
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/70 hover:bg-secondary/60 text-muted-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-2">
            <Label>Typography &amp; Typeface</Label>
            <div className="grid grid-cols-4 gap-2">
              {["Geist", "Inter", "Roboto", "System"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFont(f)}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                    font === f
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-border/70 hover:bg-secondary/60 text-muted-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size & Feed Density */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type Size</Label>
              <div className="flex gap-2">
                {[
                  { id: "S", label: "Small" },
                  { id: "M", label: "Medium" },
                  { id: "L", label: "Large" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFontSize(s.id)}
                    className={`flex-1 p-2 rounded-md border text-xs font-medium text-center ${
                      fontSize === s.id
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/70 text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Feed Density</Label>
              <div className="flex gap-2">
                {[
                  { id: "compact", label: "Compact" },
                  { id: "comfortable", label: "Comfortable" },
                  { id: "spacious", label: "Spacious" },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setFeedDensity(d.id)}
                    className={`flex-1 p-2 rounded-md border text-xs font-medium text-center ${
                      feedDensity === d.id
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/70 text-muted-foreground"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video & Embed Handling */}
          <div className="space-y-3 pt-3 border-t border-border/60">
            <Label>External Media &amp; Embed Behavior</Label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-foreground">
                  Autoplay embedded video preview (off by default)
                </span>
              </label>

              <div className="flex items-center gap-3 pt-2">
                <span className="text-muted-foreground">Embed Loading:</span>
                {["click-to-load", "load-when-visible"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setEmbedLoading(mode)}
                    className={`px-2.5 py-1 rounded text-xs border ${
                      embedLoading === mode
                        ? "border-primary bg-primary/10 text-primary font-semibold"
                        : "border-border/70 text-muted-foreground"
                    }`}
                  >
                    {mode === "click-to-load"
                      ? "Click to Load"
                      : "Load when visible"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button size="sm" onClick={handleSave} isLoading={saving}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
