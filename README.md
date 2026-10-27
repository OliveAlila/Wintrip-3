# Wintrip 3 — Wintrip Safaris destination discovery

A frontend-only travel website concept based on the supplied listing-directory design reference. The layout is adapted for Wintrip Safaris with a destination-focused hero, overlapping travel photographs, destination search, travel-category shortcuts, and a filtered destination grid.

This repository is an independent design experiment. It does not modify the original `wintrip-safaris`, `Wintrip-1`, or `Wintrip-2` repositories.

## Files

- `index.html` — page structure and content
- `assets/css/styles.css` — responsive desktop and mobile styling
- `assets/js/main.js` — navigation, destination filters and search interactions
- `vercel.json` — static Vercel configuration

The Wintrip Safaris logo is referenced from the existing public repository. Destination photography uses remote Unsplash image URLs for prototype purposes; replace these with licensed or company-owned photos before production.

## Preview locally

Open `index.html` in a browser, or run a static server in the project root:

```bash
npx serve .
```

## Deploy to Vercel

Import this repository into Vercel with:

- Framework Preset: **Other**
- Build Command: leave blank
- Output Directory: `.`
- Install Command: leave blank
- Environment variables: none

## Prototype behaviour

The destination search and filters run in the browser. Enquiry links open email or jump to the contact section. There is no booking backend, availability feed, or database in this frontend-only prototype. Confirm all contact details and image rights before publishing.
