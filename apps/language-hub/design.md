# French Flash Hub — Design Specification

A complete visual design specification for recreating the look and feel of French Flash Hub: a modern, friendly language-learning application with a French-inspired warmth. Following this document should produce a website visually near-identical to the original.

---

## 1. Design Philosophy

- **Modern, minimal, and approachable.** Rounded corners, generous spacing, soft shadows.
- **Blue-primary / orange-accent palette** — the blue evokes trust and focus; the warm orange evokes French tricolor warmth and energy.
- **Friendly encouragement.** Gradient hero backgrounds, trophy icons, progress bars, and gentle bounces reward learner progress.
- **Soft depth through layers.** Cards and buttons elevate on hover via shadow + vertical translation rather than flat ripples.
- **Accessibility-first.** Ring-based focus states, proper contrast, Radix UI primitives.

---

## 2. Color System (HSL tokens)

All colors are defined as CSS custom properties on `:root`, consumed by Tailwind via `hsl(var(--token))`.

### Light mode (default)

| Token | HSL | Hex approx. | Usage |
|---|---|---|---|
| `--background` | `220 30% 98%` | `#F4F5F9` | Page background |
| `--foreground` | `222 47% 11%` | `#1C2333` | Primary text |
| `--primary` | `220 70% 45%` | `#3B5BDB` | Buttons, links, emphasis |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary |
| `--secondary` | `220 20% 94%` | `#EFF2F8` | Light chips, inactive bg |
| `--secondary-foreground` | `222 47% 11%` | `#1C2333` | Text on secondary |
| `--accent` | `15 90% 60%` | `#FF7B3D` | Warm CTA, French accent |
| `--accent-foreground` | `0 0% 100%` | `#FFFFFF` | Text on accent |
| `--success` | `145 60% 45%` | `#2DB67F` | Progress, correct answers |
| `--success-foreground` | `0 0% 100%` | `#FFFFFF` | Text on success |
| `--destructive` | `0 84% 60%` | `#F63A3A` | Delete, errors |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Text on destructive |
| `--muted` | `220 20% 96%` | `#F3F5F9` | Subtle surfaces |
| `--muted-foreground` | `220 10% 45%` | `#6B7280` | Secondary text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card surfaces |
| `--card-foreground` | `222 47% 11%` | `#1C2333` | Text on card |
| `--border` | `220 20% 88%` | `#E8ECF2` | Dividers, input borders |
| `--input` | `220 20% 88%` | `#E8ECF2` | Input border |
| `--ring` | `220 70% 45%` | `#3B5BDB` | Focus ring |

### Dark mode (`.dark` class on `<html>`)

| Token | HSL |
|---|---|
| `--background` | `222 47% 8%` |
| `--foreground` | `210 40% 98%` |
| `--primary` | `220 70% 55%` |
| `--accent` | `15 90% 55%` |
| `--card` | `222 47% 10%` |
| `--border` | `217 33% 20%` |

### Sidebar tokens

`--sidebar-background: 0 0% 98%`, `--sidebar-foreground: 240 5.3% 26.1%`, `--sidebar-primary: 240 5.9% 10%`, `--sidebar-accent: 240 4.8% 95.9%`, `--sidebar-border: 220 13% 91%`, `--sidebar-ring: 217.2 91.2% 59.8%`.

---

## 3. Typography

### Fonts (loaded via Google Fonts in `index.html` or CSS `@import`)

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Crimson+Pro:wght@400;500;600&display=swap');
```

| CSS variable | Stack | Used for |
|---|---|---|
| `--font-display` | `'Nunito', sans-serif` | Headings (`h1`–`h6`), hero titles |
| `--font-body` | `'Nunito', sans-serif` | Body, buttons, UI chrome |
| `--font-serif` | `'Crimson Pro', serif` | Accented character buttons, quiz answer text |

### Scale

| Role | Tailwind classes |
|---|---|
| Hero `h1` | `text-4xl md:text-5xl font-bold font-display` |
| Section `h2` | `text-2xl font-bold` |
| Card title | `text-2xl font-semibold leading-none tracking-tight` |
| Card description | `text-sm text-muted-foreground` |
| Body | `text-base` |
| Small / meta | `text-sm` |
| Quiz answer display | `text-2xl font-serif font-semibold` |
| Completion score | `text-6xl font-bold gradient-hero bg-clip-text text-transparent` |

Button text defaults: `text-sm font-semibold` (default/sm), `text-base` (lg), `text-lg` (xl).

---

## 4. Spacing, Radii & Container

- Base radius: `--radius: 0.75rem` (12px)
  - `rounded-lg` = 0.75rem
  - `rounded-md` = `calc(0.75rem - 2px)` = 10px
  - `rounded-sm` = `calc(0.75rem - 4px)` = 8px
- Container: centered, `max-width: 1400px`, horizontal padding `2rem`.
- Standard card padding: `p-6` (24px). `CardContent` uses `p-6 pt-0`.
- Section vertical rhythm: `space-y-12` between major blocks; `mb-8` between sibling sections.
- Grid gaps: `gap-4` default, `gap-6` between cards.

---

## 5. Shadows & Gradients

Define as CSS variables; expose as `.shadow-soft`, `.shadow-card`, `.shadow-hover`, `.gradient-hero`, `.gradient-warm`, `.gradient-success` utility classes.

```css
--shadow-soft:  0 4px 20px -4px hsl(220 70% 45% / 0.15);
--shadow-card:  0 2px 12px -2px hsl(220 20% 20% / 0.08);
--shadow-hover: 0 8px 30px -8px hsl(220 70% 45% / 0.25);

--gradient-hero:    linear-gradient(135deg, hsl(220 70% 45%) 0%, hsl(250 60% 55%) 100%);
--gradient-warm:    linear-gradient(135deg, hsl(15 90% 60%) 0%, hsl(35 90% 55%) 100%);
--gradient-success: linear-gradient(135deg, hsl(145 60% 45%) 0%, hsl(165 60% 50%) 100%);
```

- `shadow-card` — resting card elevation.
- `shadow-soft` — resting button elevation.
- `shadow-hover` — applied on hover for buttons and cards (combined with `hover:-translate-y-0.5` or `-translate-y-1`).

Gradient-text effect for emphasis numbers:
```html
<span class="gradient-hero bg-clip-text text-transparent">100%</span>
```

---

## 6. Iconography & Imagery

- **Icon library:** `lucide-react` exclusively.
- **Default sizes:** `h-4 w-4` (inline in buttons), `h-5 w-5` (card headers), `h-10 w-10` up to `h-20 w-20` (hero/emphasis).
- **Common icons:** `Plus`, `Trash2`, `Pencil`, `BookOpen`, `BarChart3`, `Dumbbell`, `Volume2`, `Trophy`, `FolderOpen`, `FolderPlus`, `Sparkles`, `Settings`, `Upload`, `Shuffle`, `RotateCcw`, `ArrowLeft`, `Check`, `X`, `ChevronDown/Up`, `Mail`, `LogOut`, `KeyRound`, `Loader2`.
- **Flag emojis** used inline for language badges: 🇫🇷 French, 🇪🇸 Spanish, 🇬🇧 English.
- **No photographs / hero illustrations.** Visual identity is driven by gradients, typography, and iconography.

---

## 7. Components

### 7.1 Button (`src/components/ui/button.tsx`)

Base class string (all variants):
```
inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg
text-sm font-semibold ring-offset-background transition-all duration-200
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
disabled:pointer-events-none disabled:opacity-50
```

| Variant | Classes |
|---|---|
| `default` | `bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-hover hover:-translate-y-0.5` |
| `accent` | `gradient-warm text-accent-foreground hover:opacity-90 shadow-soft hover:shadow-hover hover:-translate-y-0.5` |
| `hero` | `gradient-hero text-primary-foreground hover:opacity-90 shadow-soft hover:shadow-hover hover:-translate-y-0.5 font-bold` |
| `success` | `bg-success text-success-foreground hover:bg-success/90 shadow-soft hover:shadow-hover hover:-translate-y-0.5` |
| `outline` | `border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground hover:bg-secondary/80` |
| `ghost` | `hover:bg-accent hover:text-accent-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |
| `destructive` | `bg-destructive text-destructive-foreground hover:bg-destructive/90` |

| Size | Classes |
|---|---|
| `default` | `h-10 px-5 py-2` |
| `sm` | `h-9 rounded-md px-4` |
| `lg` | `h-12 rounded-lg px-8 text-base` |
| `xl` | `h-14 rounded-xl px-10 text-lg` |
| `icon` | `h-10 w-10` |

**Hover behavior:** lift by 2px (`-translate-y-0.5`), shift shadow from `shadow-soft` to `shadow-hover`, keep `transition-all duration-200`.

### 7.2 Card (`src/components/ui/card.tsx`)

```
Card:        rounded-lg border bg-card text-card-foreground shadow-sm
CardHeader:  flex flex-col space-y-1.5 p-6
CardTitle:   text-2xl font-semibold leading-none tracking-tight
CardDescr.:  text-sm text-muted-foreground
CardContent: p-6 pt-0
CardFooter:  flex items-center p-6 pt-0
```

**Interactive card** (e.g., folder tiles, set tiles):
```
shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer
```

### 7.3 Input

```
flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base
ring-offset-background placeholder:text-muted-foreground
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
disabled:cursor-not-allowed disabled:opacity-50
```

### 7.4 Dialog / Modal

- Overlay: `fixed inset-0 bg-black/80` with fade in/out.
- Content: fixed centered, `max-w-lg`, `rounded-lg`, `bg-background`, `p-6`, `shadow-lg`.
- Enter/exit: zoom-in-95 + fade from Radix + `tailwindcss-animate`.

### 7.5 Progress Bar

```html
<div class="w-full h-2 bg-secondary rounded-full overflow-hidden">
  <div class="h-full gradient-success transition-all duration-500" style="width:{pct}%"></div>
</div>
```

The in-header quiz progress bar is `h-2`; the celebratory set-mastery bar is the same.

### 7.6 Badge / Language chip

```
inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary
```

Prefix with flag emoji: `🇫🇷 French`, `🇪🇸 Spanish`.

### 7.7 Accent character buttons

A horizontal row of tiny outline buttons that insert French/Spanish diacriticals into the focused input.

- Button: `variant="outline"`, `size="sm"`, class override `h-8 w-8 p-0 text-sm font-serif`.
- French set: `à â ä æ ç è é ê ë î ï ô œ ù û ü ÿ`
- Spanish set: `á é í ó ú ü ñ ¿ ¡`
- Container: `flex flex-wrap gap-1 mt-2`.

### 7.8 Quiz-type indicator pill

Colored pills distinguishing question modes, using tinted background and matching text:

| Mode | Classes |
|---|---|
| FR → EN | `bg-primary/10 text-primary` |
| EN → FR | `bg-accent/10 text-accent` |
| Dictation | `bg-success/10 text-success` |

Optionally prefix with 🇫🇷 / 🇬🇧 / 🎧.

### 7.9 Feedback surfaces

- Correct: container `bg-success/10` with success-colored icon + text.
- Incorrect: container `bg-destructive/10` with destructive-colored icon + text.
- Both animate in with `animate-slide-up`.

---

## 8. Layout Patterns

### 8.1 Header (quiz / sub-page)

Sticky translucent bar with backdrop blur:
```
sticky top-0 z-10 border-b border-border bg-card/50 backdrop-blur-sm
```
Contents: left-aligned back arrow + title, right-aligned action buttons, progress bar rendered immediately below.

### 8.2 Hero section (home)

```html
<section class="gradient-hero py-16 px-6">
  <div class="max-w-4xl mx-auto text-center animate-slide-up">
    <h1 class="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 font-display">…</h1>
    <p  class="text-lg text-primary-foreground/90 my-8 max-w-2xl mx-auto">…</p>
    <div class="flex flex-wrap justify-center gap-4">
      <!-- accent + outline buttons -->
    </div>
  </div>
</section>
```

### 8.3 Content grid (home)

- Folders: `grid md:grid-cols-3 gap-6`
- Vocabulary sets: `grid md:grid-cols-2 gap-6`
- Cards enter with `animate-slide-up` and staggered `animationDelay` (`0s, 0.05s, 0.1s …`).

### 8.4 Completion screen

Centered card, heavy whitespace:
```html
<Card class="text-center py-12 animate-bounce-soft">
  <Trophy class="h-20 w-20 text-accent mx-auto mb-6" />
  <div class="text-6xl font-bold gradient-hero bg-clip-text text-transparent mb-2">100%</div>
  <p class="text-muted-foreground">You nailed this set.</p>
</Card>
```

---

## 9. Animations

Defined as Tailwind keyframes / utility classes.

```css
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bounce-soft {
  0%   { transform: scale(0.95); opacity: 0; }
  50%  { transform: scale(1.02); }
  100% { transform: scale(1);    opacity: 1; }
}
@keyframes float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-10px); }
}
@keyframes pulse-soft {
  0%,100% { opacity: 1; }
  50%     { opacity: 0.7; }
}

.animate-slide-up   { animation: slide-up   0.5s ease-out; }
.animate-bounce-soft{ animation: bounce-soft 0.6s ease-out; }
.animate-float      { animation: float       3s ease-in-out infinite; }
.animate-pulse-soft { animation: pulse-soft  2s ease-in-out infinite; }
```

Standard transitions:
- Buttons: `transition-all duration-200`
- Cards: `transition-all duration-300`
- Progress fills: `transition-all duration-500`

Radix/tailwindcss-animate utilities (`animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-top-2`) power dialogs, tooltips, dropdowns.

---

## 10. Responsive Rules

Mobile-first, single breakpoint emphasized: `md:` (~768px).

| Concern | Mobile | ≥ `md` |
|---|---|---|
| Hero title | `text-4xl` | `text-5xl` |
| Folder grid | 1 column | 3 columns |
| Set grid | 1 column | 2 columns |
| Hero button row | wrap | inline, centered |
| Side padding | `px-6` | `px-6` (container centers) |

Never drop horizontal padding below `px-6`. Cards stretch to full container width on mobile.

Respect `@media (prefers-reduced-motion: reduce)` by disabling infinite animations (float, pulse-soft).

---

## 11. Tailwind Config Essentials

```ts
// tailwind.config.ts (excerpt)
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        border:'hsl(var(--border))', input:'hsl(var(--input))', ring:'hsl(var(--ring))',
        background:'hsl(var(--background))', foreground:'hsl(var(--foreground))',
        primary:   { DEFAULT:'hsl(var(--primary))',   foreground:'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT:'hsl(var(--secondary))', foreground:'hsl(var(--secondary-foreground))' },
        accent:    { DEFAULT:'hsl(var(--accent))',    foreground:'hsl(var(--accent-foreground))' },
        success:   { DEFAULT:'hsl(var(--success))',   foreground:'hsl(var(--success-foreground))' },
        destructive:{DEFAULT:'hsl(var(--destructive))',foreground:'hsl(var(--destructive-foreground))'},
        muted:     { DEFAULT:'hsl(var(--muted))',     foreground:'hsl(var(--muted-foreground))' },
        card:      { DEFAULT:'hsl(var(--card))',      foreground:'hsl(var(--card-foreground))' },
        popover:   { DEFAULT:'hsl(var(--popover))',   foreground:'hsl(var(--popover-foreground))' },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        serif:   ['var(--font-serif)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        soft:  'var(--shadow-soft)',
        card:  'var(--shadow-card)',
        hover: 'var(--shadow-hover)',
      },
      backgroundImage: {
        'gradient-hero':    'var(--gradient-hero)',
        'gradient-warm':    'var(--gradient-warm)',
        'gradient-success': 'var(--gradient-success)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## 12. Implementation Checklist

- [ ] Install `tailwindcss`, `tailwindcss-animate`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`.
- [ ] Add shadcn/ui primitives (`button`, `card`, `input`, `dialog`, `progress`, `dropdown-menu`, `tooltip`) into `src/components/ui/`.
- [ ] Import Nunito + Crimson Pro from Google Fonts.
- [ ] Declare all CSS variables on `:root` and `.dark` in `src/index.css`.
- [ ] Register gradient / shadow utility classes (`.gradient-hero`, `.shadow-card`, …).
- [ ] Define the four custom keyframes and their `.animate-*` classes.
- [ ] Build pages with the hero → grid-of-cards layout and the sticky-header quiz layout.
- [ ] Use lucide icons exclusively; flag emojis for language indicators.
- [ ] Ensure every interactive tile lifts with `hover:-translate-y-1` + `shadow-card → shadow-hover`.
- [ ] Verify accent-character row under text inputs accepting French/Spanish input.

Follow this spec top-to-bottom and the resulting UI will be visually indistinguishable from French Flash Hub.
