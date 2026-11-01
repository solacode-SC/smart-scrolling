'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Palette, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: 'Profile', href: '/app/settings/profile', icon: User },
    { label: 'Appearance', href: '/app/settings/appearance', icon: Palette },
    { label: 'Sync & Intervals', href: '/app/settings/sync', icon: RefreshCw },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 space-y-6">
      <div className="pb-4 border-b border-border/60">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manage your personal account, reading preferences, and background sync parameters.
        </p>
      </div>

      <div className="flex items-center gap-1 border-b border-border/60 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-secondary text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}
