# hibiscus

## Current State
Full-stack pastel Y2K timetable app with:
- 3 pages: Today, Tomorrow, Archive
- Backend: Motoko with addEntry, updateEntry, deleteEntry, getEntriesForDate, archiveDay, unarchiveDay, getArchivedDaysWithinYear
- Frontend: React + TanStack Router, glassmorphism cards, Y2K SVG decorations
- PWA support with service worker
- Branding: "Dreamy Timetable" throughout (index.html title, Navigation logo text, manifest.json, apple-mobile-web-app-title)

## Requested Changes (Diff)

### Add
- New PWA icon with hibiscus flower Y2K aesthetic (pink/purple pastel, sparkle accents)
- Custom PWA icon for home screen

### Modify
- App name / branding renamed from "Dreamy Timetable" → "hibiscus" everywhere:
  - index.html: `<title>`, `apple-mobile-web-app-title`, meta description
  - Navigation.tsx: sidebar logo text
  - manifest.json: name and short_name
- PWA icon references updated to new hibiscus icon

### Remove
- Nothing removed functionally

## Implementation Plan
1. Generate new hibiscus-themed PWA icon (192x192 and 512x512)
2. Update index.html: title, meta tags, icon references
3. Update Navigation.tsx: logo text from "Dreamy" / "Timetable" to "hibiscus"
4. Update manifest.json: name and short_name
5. Validate frontend build
