import { z } from 'zod';

export const THEMES = ['calm', 'light'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

export const ACCENTS = ['#4f9d8c', '#5f97c8', '#c89a4f', '#b07c8a'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  why: z.string(),
  at: z.number(),
});
export type Item = z.infer<typeof itemSchema>;

export const settingsSchema = z.object({
  holdHrs: z.number().int().min(6).max(72),
  currency: z.string().min(1).max(3),
  theme: themeSchema,
  accent: accentSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  items: z.array(itemSchema),
  kept: z.number().nonnegative(),
});
export type PersistedState = z.infer<typeof persistedStateSchema>;
