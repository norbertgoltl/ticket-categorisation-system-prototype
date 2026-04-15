import { Category } from "../types";

// Next.js szerver memóriájában él a process lifetime-ja alatt.
// Productionban ezt vektor DB váltja ki.
let cachedCategories: Category[] | null = null;

export function getCachedCategories(): Category[] | null {
  return cachedCategories;
}

export function setCachedCategories(categories: Category[]): void {
  cachedCategories = categories;
}

export function isCacheReady(): boolean {
  return cachedCategories !== null && cachedCategories.length > 0;
}
