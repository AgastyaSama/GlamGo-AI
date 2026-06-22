# GlamGo AI - Design System Specification

## 1. Overview & Creative North Star
Our Creative North Star is **"The Editorial Parlour"**. 
The interface is designed to evoke the tactile, sensory experience of browsing a premium, luxury print magazine or visiting an upscale, high-end cosmetic boutique (e.g., Aesop). We reject the clinical, dark, glowing "neon dashboard" tropes of standard tech in favor of generous whitespace, sophisticated serif typography, and an organic luxury palette. 

Every view is structured with **asymmetrical layouts, spacious column rhythm, and subtle tonal borders** rather than grids of heavy boxes. Interactivity is conveyed through tactile micro-animations and understated, premium buttons.

---

## 2. Color Palette (Organic Luxury)
Our color system is built entirely on OKLCH/Hex values representing tinted, natural materials. We completely shift away from high-vibrancy neons and deep charcoal-blacks.

### Color Tokens
*   **Base Background (Warm Ivory)**: `--bg-primary: #F7F4EF;` (OKLCH `0.96 0.008 75` — a soft, warm paper off-white)
*   **Surface Layer (Soft Cream)**: `--bg-secondary: #FCFBF7;` (OKLCH `0.98 0.005 75` — elevated cards and sections)
*   **Ink Text (Charcoal)**: `--text-primary: #1C1C1C;` (OKLCH `0.15 0.0 0` — deep, soft charcoal-black for readability)
*   **Muted Ink (Slate Gray)**: `--text-secondary: #5C5A56;` (OKLCH `0.45 0.005 75` — body and subtitle text)
*   **Disabled / Placeholders**: `--text-muted: #8E8B85;` (OKLCH `0.65 0.005 75`)
*   **Accent Primary (Champagne Gold)**: `--accent-gold: #C5A880;` (OKLCH `0.75 0.025 80` — borders, buttons, highlights)
*   **Accent Primary Hover**: `--accent-gold-hover: #B4966F;` (OKLCH `0.70 0.025 80`)
*   **Accent Secondary (Muted Rose)**: `--accent-rose: #C39797;` (OKLCH `0.68 0.02 20` — verified badges, highlights, warm metrics)
*   **Error / Danger State**: `--state-error: #B95C5C;` (OKLCH `0.55 0.03 20` — warnings and alerts)
*   **Separator Tones**: `--border-light: rgba(197, 168, 128, 0.18);` (soft gold tint border)
*   **Separator Dark**: `--border-dark: rgba(28, 28, 28, 0.08);` (soft charcoal tint border)

---

## 3. Typography: Editorial Pairing
We use a deliberate contrast between a high-fashion Serif header font and a clean, spacious Sans-serif body font.

*   **Display Font (Headers)**: `Playfair Display`, serif. Used for page headings (`h1`, `h2`) and major section titles.
    *   *Styling*: Slightly heavier weights (600 or 700), low letter-spacing, and italicized accents for dramatic emphasis.
*   **Body/Label Font**: `Outfit` or `Albert Sans`, sans-serif. Used for readable body copy, forms, tags, and navigation labels.
    *   *Styling*: Normal weight (400) for body, medium (500) for interactive elements, and semi-bold (600) for subheaders.
*   **Contrast Axis**: Pair a large, elegant `Playfair Display` header with a small, uppercase, widely-spaced `Outfit` label (e.g., `letter-spacing: 0.1em; text-transform: uppercase; font-size: 11px;`).

---

## 4. Spacing, Borders, and Elevation
*   **Restrained Corners**: We avoid fully rounded pill shapes. Buttons and cards use a soft, elegant radius of `6px` or `8px`. Larger containers use `12px`.
*   **Spacious Breathing Room**: Margins and paddings are doubled. Main wrapper containers use a minimum of `48px` vertical and `32px` horizontal spacing. Avoid crowding elements.
*   **Ambient Shadows**: No dark, muddy, heavy shadows. We rely primarily on subtle background color shifts (`bg-primary` vs `bg-secondary`) and thin gold-tinted borders. When shadows are required (e.g., dropdown menus or floats), use:
    *   `box-shadow: 0px 8px 24px rgba(28, 28, 28, 0.03);` (very faint, ambient gray-brown)

---

## 5. Component Refactoring Rules

### Primary CTA Buttons
*   **Visuals**: Solid background of Charcoal (`#1C1C1C`) with Warm Ivory (`#F7F4EF`) text, or Champagne Gold (`#C5A880`) background. Subtle scale transformations on hover.
*   **Border Buttons**: Warm Ivory background, fine border of Champagne Gold (`#C5A880`), Charcoal text.

### Cards & Containers
*   **Rule**: No cards-inside-cards. A section should be defined by a clean, solid block of Soft Cream (`#FCFBF7`) on top of the Warm Ivory background, separated by a thin 1px border of `--border-light`.

### Badges & Verification Status
*   **Rule**: Replace glowing neon badges with elegant, high-contrast text badges.
    *   *Verified*: Soft Rose background (`#F9ECEC`) with deep Rose text (`#9E5A5A`), or simple gold outlines.
    *   *AI Diagnostic*: Soft Cream background with a gold star icon and charcoal typography.

### Input Fields & Forms
*   **Visuals**: Clean, borderless inputs with a 1px solid bottom border (`--border-dark`). On focus, the border transitions to Champagne Gold (`#C5A880`) with a very light cream background. No heavy 4-sided boxes.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical spacing. Leave generous whitespace (e.g., 60px to 80px) around headers.
*   **Do** use italics for key words in headers to evoke a luxury editorial feel (e.g., *"Your Personal* AI Beauty *Concierge"*).
*   **Do** use clean 1px borders for separator boundaries.
*   **Do** ensure text contrast is high (Ink text on Warm Ivory is extremely legible).

### Don't
*   **Don't** use neon gradients (purple-to-pink) or dark sci-fi background shades.
*   **Don't** use standard material rounded buttons.
*   **Don't** use drop-shadows on standard page cards.
*   **Don't** compress items to save screen height; luxury is defined by space.
