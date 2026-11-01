import { describe, it, expect } from 'vitest';
import { cn, formatDate } from '../src/lib/utils';

describe('Web Utilities', () => {
  it('cn() merges Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('formatDate() formats recent and past timestamps', () => {
    const now = new Date();
    expect(formatDate(now)).toBe('Just now');

    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    expect(formatDate(tenMinutesAgo)).toBe('10m ago');

    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(formatDate(twoHoursAgo)).toBe('2h ago');
  });
});

