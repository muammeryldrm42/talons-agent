'use client';

import type { AnalysisResponse } from '@/lib/schemas/analysis';

export type WatchlistItem = {
  coinId: string;
  symbol: string;
  name: string;
  image?: string;
};

export type HistoryItem = {
  id: string;
  coinId?: string;
  symbol: string;
  name: string;
  timeframe: string;
  createdAt: string;
  analysis: AnalysisResponse;
};

const WATCHLIST_KEY = 'talons.watchlist';
const HISTORY_KEY = 'talons.history';
const PREFERENCES_KEY = 'talons.preferences';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeRead<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!canUseStorage()) return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function getWatchlist() {
  return safeRead<WatchlistItem[]>(WATCHLIST_KEY, []);
}

export function saveWatchlist(items: WatchlistItem[]) {
  return safeWrite(WATCHLIST_KEY, items);
}

export function toggleWatchlist(item: WatchlistItem) {
  const existing = getWatchlist();
  const exists = existing.some((entry) => entry.coinId === item.coinId);
  const next = exists
    ? existing.filter((entry) => entry.coinId !== item.coinId)
    : [item, ...existing].slice(0, 50);

  saveWatchlist(next);
  return { items: next, added: !exists };
}

export function getHistory() {
  return safeRead<HistoryItem[]>(HISTORY_KEY, []);
}

export function addHistory(item: HistoryItem) {
  const next = [item, ...getHistory()].slice(0, 100);
  saveHistory(next);
  return next;
}

export function saveHistory(items: HistoryItem[]) {
  return safeWrite(HISTORY_KEY, items);
}

export function getPreferences() {
  return safeRead<Record<string, unknown>>(PREFERENCES_KEY, {});
}

export function setPreference(key: string, value: unknown) {
  const next = {
    ...getPreferences(),
    [key]: value,
  };

  safeWrite(PREFERENCES_KEY, next);
  return next;
}
