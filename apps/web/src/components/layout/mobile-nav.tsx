'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, Compass, Bookmark, Layers, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Feed', href: '/app/feed', icon: Newspaper },
    { label: 'Discover', href: '/app/discover', icon: Compass },
    { label: 'Bookmarks', href: '/app/bookmarks', icon: Bookmark },
    { label: 'Following', href: '/app/following', icon: Layers },
    { label: 'Settings', href: '/app/settings/profile', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 border-t border-border/70 bg-card/95 backdrop-blur-md md:hidden px-2">
      <div className="flex w-full items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/app/feed' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 text-[11px] font-medium transition-colors',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
