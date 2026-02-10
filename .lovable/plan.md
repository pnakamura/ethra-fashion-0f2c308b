

# Fix: Background not visible in Light Mode for visitors

## Problem
The `ArtBackground` component renders at `z-[-1]` (behind everything). In light mode, two opaque layers completely cover it:

1. `Landing.tsx` uses `bg-background` which is solid white in light mode
2. `HeroSection.tsx` has `bg-gradient-to-br from-background` which is also solid white in light mode

Additionally, 15% opacity is extremely subtle and nearly invisible even without the covering layers.

## Solution (3 changes)

### 1. Landing.tsx (line 58)
Make the landing page background transparent in light mode too (currently only dark mode is transparent):

Change: `bg-background dark:bg-transparent`
To: `bg-transparent`

### 2. HeroSection.tsx (line 18)
Make the hero gradient overlay transparent in light mode to let the art background show through:

Change: `bg-gradient-to-br from-background via-secondary/30 to-primary/10 dark:from-transparent dark:via-transparent dark:to-transparent`
To: `bg-gradient-to-br from-transparent via-secondary/20 to-primary/5 dark:from-transparent dark:via-transparent dark:to-transparent`

### 3. BackgroundSettingsContext.tsx (line 37)
Increase the default light mode opacity from 0.15 to 0.25 for better visibility:

Change: `opacity: 0.15`
To: `opacity: 0.25`

(This applies to the `defaultSettings` object and both localStorage fallback values at lines 66 and 88)

## Files affected: 3
- `src/pages/Landing.tsx` -- 1 line
- `src/components/landing/HeroSection.tsx` -- 1 line
- `src/contexts/BackgroundSettingsContext.tsx` -- 3 lines (default + 2 fallbacks)

## Risk assessment
- Dark mode: No change (already uses transparent backgrounds)
- Authenticated users: Their saved opacity preference is preserved from database
- Only unauthenticated visitors in light mode are affected by the opacity default change

