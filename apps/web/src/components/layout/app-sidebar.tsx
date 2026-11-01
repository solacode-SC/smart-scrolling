"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  Compass,
  Users,
  Bookmark,
  Layers,
  PlusCircle,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: "My Feed", href: "/app/feed", icon: Newspaper },
    { label: "Discover", href: "/app/discover", icon: Compass },
    { label: "Shared Feeds", href: "/app/shared", icon: Users },
    { label: "Bookmarks", href: "/app/bookmarks", icon: Bookmark },
    { label: "Collections", href: "/app/collections", icon: FolderOpen },
    { label: "Following", href: "/app/following", icon: Layers },
    { label: "Add Account", href: "/app/add-account", icon: PlusCircle },
    { label: "Activity", href: "/app/activity", icon: Activity },
    { label: "Settings", href: "/app/settings/profile", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border/70 bg-card/60 backdrop-blur-md transition-all duration-300 select-none z-20 shrink-0 h-screen sticky top-0",
        isCollapsed ? "w-16" : "w-60",
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/50">
        {!isCollapsed && (
          <a
            href="/app/feed"
            className="flex items-center gap-2.5 font-semibold text-lg tracking-tight text-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              S
            </span>
            <span>SocialHub</span>
          </a>
        )}
        {isCollapsed && (
          <a href="/app/feed" className="mx-auto">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm shadow-sm">
              S
            </span>
          </a>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
            isCollapsed && "hidden",
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/app/feed" && pathname?.startsWith(item.href));

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/80 text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground",
                isCollapsed && "justify-center px-0 py-2.5",
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          );
        })}
      </div>

      {/* Collapse button when collapsed */}
      {isCollapsed && (
        <div className="p-2 border-t border-border/40 flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* User Footer */}
      <div className="p-3 border-t border-border/50 bg-card/40">
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "justify-center",
          )}
        >
          <Avatar
            src={user?.avatarUrl}
            fallback={user?.name || "User"}
            size="sm"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={() => logout()}
              className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
