
# Fix: Background not appearing in Light Mode for visitors

## Problem
The default background settings define light mode variant as `'none'` (line 36-37 of `BackgroundSettingsContext.tsx`). When a visitor (not logged in) opens the app in light mode:
1. No localStorage data exists
2. No database settings are loaded (no user)
3. The default `'none'` variant is used
4. `ArtBackground` returns `null` -- no background rendered

## Solution
Change the default light mode variant from `'none'` to `'abstract'` in the `defaultSettings` constant.

## Technical Changes

### File: `src/contexts/BackgroundSettingsContext.tsx`
- Change `defaultSettings.light.variant` from `'none'` to `'abstract'`
- This ensures visitors and non-authenticated users see the abstract background in light mode
- Authenticated users who previously customized their settings will still have their preferences loaded from localStorage/database

```text
Before:
  light: {
    variant: 'none',
    opacity: 0.15,
  }

After:
  light: {
    variant: 'abstract',
    opacity: 0.15,
  }
```

This same change must also be applied to the fallback values on lines 66 and 88 where `'none'` is used as the default for `parsed.light?.variant`, ensuring consistency when localStorage data has missing fields.

### Files affected: 1
- `src/contexts/BackgroundSettingsContext.tsx` (3 line changes)

### No risk to existing users
Authenticated users who set their preference to `'none'` explicitly will still have that preference respected, since it's loaded from their saved settings in localStorage/database.
