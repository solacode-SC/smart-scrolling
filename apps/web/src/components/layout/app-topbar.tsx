"use client";

import React from "react";
import { useTheme } from "@/lib/theme-provider";
import { Sun, Moon, Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AppTopbar({ title }: { title?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border/70 bg-background/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search posts or creators..."
            className="h-9 w-full rounded-md border border-input bg-card/60 pl-8 pr-3 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 bg-card/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-700" />
          )}
        </button>
      </div>
    </header>
  );
}
