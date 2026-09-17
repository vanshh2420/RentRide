# RentRide 2.0 — UI Design System Specification

A unified, modern mobility & automotive visual language for RentRide.

---

## 1. Brand Identity & Design Principles

RentRide connects vehicle renters with verified fleet owners across Central India (Indore, Bhopal, Gwalior). The visual language must communicate:
- **Velocity & Precision**: Clean typography, crisp geometric lines, and instantaneous interactive feedback.
- **Trust & Reliability**: Zero ambiguity in pricing, vehicle specifications, booking status, and insurance details.
- **Eco-Mobility & Innovation**: Electric green accents alongside high-performance cobalt and obsidian surfaces.
- **Data-Dense Operational Clarity**: Clear, readable metrics for vendors and administrators.

---

## 2. Color Tokens

### Primary Palette (Mobility Cobalt)
- `brand-50`: `#eef4ff` — Soft tinted backgrounds
- `brand-100`: `#d9e6ff` — Subtle badges & chips
- `brand-200`: `#bcd5ff` — Hover borders
- `brand-500`: `#3b76f6` — Interactive elements & links
- `brand-600`: `#2557eb` — Primary button background, active tab indicators, brand focal points
- `brand-700`: `#1d42d8` — Primary hover state
- `brand-900`: `#1e328a` — Deep accent
- `brand-950`: `#172254` — Dark mode tinted surface

### Electric / Eco Accent (Emerald Volt)
- `emerald-400`: `#34d399` — High-visibility EV badges
- `emerald-500`: `#10b981` — Success indicators, confirmed status, zero-deposit guarantee
- `emerald-600`: `#059669` — Success actions & badges

### Warm Accent (Radiant Amber)
- `accent-400`: `#fbbf24` — Rating stars, pending alerts
- `accent-500`: `#f59e0b` — Important notices, special offers, vendor tier highlights
- `accent-600`: `#d97706`

### AI Intelligence (Spectrum Indigo-Sky)
- `ai-gradient`: `linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)`
- `ai-glow`: `rgba(99, 102, 241, 0.25)`

### Surface & Neutral Architecture
- Light Mode:
  - Background: `#f8fafc` (`slate-50`)
  - Surface Card: `#ffffff` (`white`)
  - Elevated Surface: `#ffffff` (`shadow-card`)
  - Border: `rgba(226, 232, 240, 0.85)` (`slate-200`)
  - Text Primary: `#0f172a` (`slate-900`)
  - Text Secondary: `#475569` (`slate-600`)
  - Text Muted: `#94a3b8` (`slate-400`)
- Dark Mode:
  - Background: `#070b14` (`slate-950` deep night)
  - Surface Card: `#0f172a` (`slate-900`)
  - Elevated Surface: `#172033` (`slate-850`)
  - Border: `rgba(30, 41, 59, 0.85)` (`slate-800`)
  - Text Primary: `#f8fafc` (`slate-50`)
  - Text Secondary: `#cbd5e1` (`slate-300`)
  - Text Muted: `#64748b` (`slate-500`)

---

## 3. Typography Hierarchy

RentRide uses **Outfit** for display/headings and **Inter** for UI, numbers, and body copy.

| Style | Font Family | Size | Weight | Line Height | Tracking |
|---|---|---|---|---|---|
| Display Hero | Outfit | 3.5rem - 4.5rem (56-72px) | Black (900) | 1.08 | -0.03em |
| Heading 1 (H1) | Outfit | 2.5rem - 3rem (40-48px) | ExtraBold (800) | 1.15 | -0.025em |
| Heading 2 (H2) | Outfit | 1.75rem - 2.25rem (28-36px) | Bold (700) | 1.2 | -0.02em |
| Heading 3 (H3) | Outfit | 1.25rem - 1.5rem (20-24px) | Bold (700) | 1.3 | -0.015em |
| Heading 4 (H4) | Outfit | 1rem - 1.125rem (16-18px) | SemiBold (600) | 1.4 | 0 |
| Body Regular | Inter | 0.9375rem (15px) | Regular (400) | 1.6 | 0 |
| Body Medium | Inter | 0.875rem (14px) | Medium (500) | 1.5 | 0 |
| Small / Caption | Inter | 0.75rem - 0.8125rem (12-13px) | Medium/SemiBold | 1.4 | 0.01em |
| Micro / Pill | Inter | 0.625rem - 0.6875rem (10-11px) | Bold/Extrabold | 1.2 | 0.05em (Uppercase) |
| Price / Numeric | Outfit / Inter | 1.5rem - 2.5rem | Black (900) / Bold | 1 | -0.02em (Tabular nums) |

---

## 4. Spacing Scale

Strict 4px/8px incremental grid:
- `4px` (`0.25rem` / `gap-1`, `p-1`) — Micro tags, pill internal spacing
- `8px` (`0.5rem` / `gap-2`, `p-2`) — Icon buttons, chip paddings
- `12px` (`0.75rem` / `gap-3`, `p-3`) — Small card interiors, compact list items
- `16px` (`1rem` / `gap-4`, `p-4`) — Standard card interiors, form field gaps
- `20px` (`1.25rem` / `gap-5`, `p-5`) — Large card padding
- `24px` (`1.5rem` / `gap-6`, `p-6`) — Section container padding
- `32px` (`2rem` / `gap-8`, `p-8`) — Grid gutters, modal padding
- `48px` (`3rem` / `py-12`) — Section padding
- `64px` (`4rem` / `py-16`) — Major section intervals
- `80px - 96px` (`5rem - 6rem` / `py-20 - py-24`) — Hero banner intervals

---

## 5. Border Radius & Shadows

### Border Radius
- Small: `0.375rem` (`rounded-md`) — Small inputs, inline badges
- Medium: `0.5rem` (`rounded-lg`) — Select menus, dropdowns, table cells
- Large: `0.75rem` (`rounded-xl`) — Form inputs, standard buttons
- Extra-Large: `1rem` (`rounded-2xl`) — Modal dialogs, vehicle cards, metric widgets
- 3XL: `1.5rem` (`rounded-3xl`) — Major hero cards, promotional banners
- Full: `9999px` (`rounded-full`) — Pill chips, status badges, avatars

### Shadows
- Subtle: `0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.03)`
- Card: `0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.03)`
- Hover: `0 20px 35px -8px rgba(37, 87, 235, 0.16), 0 8px 16px -4px rgba(15, 23, 42, 0.06)`
- Floating: `0 24px 48px -12px rgba(15, 23, 42, 0.16)`

---

## 6. Reusable Component Conventions

1. **Buttons**:
   - `primary`: `bg-brand-600 hover:bg-brand-500 text-white shadow-md active:scale-[0.99]`
   - `secondary`: `bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100`
   - `outline`: `border border-slate-300 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200`
   - `ghost`: `hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300`
   - `danger`: `bg-rose-600 hover:bg-rose-500 text-white shadow-xs`
   - `ai`: `bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white shadow-md`

2. **Form Controls**:
   - Crisp focus ring: `focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500`
   - Clear placeholder contrast: `placeholder:text-slate-400 dark:placeholder:text-slate-500`
   - Consistent height: Small `h-9` (36px), Medium `h-11` (44px), Large `h-13` (52px)

3. **Status Badges**:
   - `AVAILABLE` / `CONFIRMED` / `ACTIVE`: Emerald pill
   - `BOOKED` / `IN_PROGRESS`: Sky blue pill
   - `MAINTENANCE` / `PENDING`: Amber/orange pill
   - `CANCELLED` / `INACTIVE`: Slate / rose pill
