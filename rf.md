# Reference File — Color & Font Audit

Extracted from the ImReallyATrex reference HTML for use when building [assets.md](./assets.md).

## Color Tokens

| Tailwind class | Hex (proposed) | Usage in reference | Used in Elektrokebab |
|---|---|---|---|
| `off-white` / `bg-off-white` | `#F5F0E8` | Page background (light mode), overlay masks, input borders | **Primary** — light surface |
| `off-black` / `text-off-black` | `#191926` | Body text (light), dark background, SVG fills (`#191926`) | **Primary** — text / dark surface |
| `text-red` / `bg-red` / `border-red` | `#E63B2E` | Hero headline, link hovers, newsletter input, mobile menu overlay, arrow accents | **Accent** |
| `text-yellow` / `bg-yellow` | `#F5D547` | Mobile nav links, dark-mode link accent, player pill background, product hover | Document only |
| `bg-pink` | `#F2A7B8` | Marquee band (light mode) | Document only |
| `text-white` | `#FFFFFF` | Mobile menu social links, cursor-adjacent UI | Derived from primaries |
| `bg-black` | `#000000` | Canvas demo, image blend overlays | Canvas background |

### Dark Mode Pattern (reference)

- Background: `dark:bg-off-black`
- Text: `dark:text-off-white`
- Accent swap: `text-red dark:text-yellow` on link arrows
- Transition: `transition-colors ease-in-out duration-500`

Elektrokebab keeps primaries + red accent only; no yellow/pink swap.

## Typography

Reference uses two custom font families (`font-display`, `font-mono`). Elektrokebab maps them to Google Fonts equivalents.

### `font-display` (reference — decorative/display)

| Element | Size classes | Notes |
|---|---|---|
| Hero H1 | `text-[12.5vw] leading-[0.82]` | Uppercase, centered, `text-red` |
| Section H2 | `text-[40px] md:text-[7vw] xl:text-[6vw] leading-[0.95]` | Uppercase, centered |
| Section subtitle | `text-[18px] md:text-[26px] xl:text-[32px] 2xl:text-[40px]` | Centered |
| Intro body | `text-[23px] md:text-[32px] xl:text-[40px] 2xl:text-[46px] leading-[1.175]` | `tracking-tight`, text-indent |
| Marquee band | `text-[7vw] md:text-[3vw] xl:text-[2.3vw]` | Uppercase |
| Mobile nav links | `text-[55px] leading-none` | Uppercase, `text-yellow` |
| Newsletter input | `text-[8vw] leading-[0.82]` | Uppercase, `text-red` |
| Product title | `text-[16px] md:text-[26px] xl:text-[38px]` | Uppercase |

### `font-mono` (reference — UI/mono)

| Element | Size classes | Notes |
|---|---|---|
| Header nav | `text-[16px] md:text-[17px] xl:text-[22px]` | Uppercase, hover slide animation |
| Vibe/Chill buttons | `text-[16px] md:text-[20px] xl:text-[24px]` | `tracking-tight` |
| Player marquee | `text-[16px] md:text-[20px] xl:text-[22px]` | Inside yellow pill |
| Footer | `text-[13px] md:text-lg` | Copyright + links |
| Product price | `text-[16px] md:text-[23px] xl:text-[26px]` | Uppercase |
| Carousel arrows | `text-[60px] md:text-[70px] xl:text-[80px]` | `<` `>` controls |

### Elektrokebab mapping (from reference HTML)

| Role | Reference pattern | Elektrokebab implementation |
|---|---|---|
| Artist name | `font-display`, `text-[12.5vw]`, `leading-[0.82]`, uppercase | Bebas Neue, `clamp(2.5rem, 12.5vw, 8rem)`, `leading-[0.82]` |
| Tagline / hint | `font-mono`, `tracking-tight` | IBM Plex Mono, `clamp()` sizes |
| Record / Play / Upload | `font-mono`, `bg-yellow`, `text-off-black`, `tracking-tight` | IBM Plex Mono 600, `#F5D547` pill buttons |
| Player pill (ref) | `bg-yellow rounded-full`, `text-off-black` | Same yellow `#F5D547` on black stage |

## Motion & Interaction Patterns

| Pattern | Classes / behavior | Elektrokebab use |
|---|---|---|
| Color transition | `transition-colors ease-in-out duration-500` | Mute toggle, overlay |
| Nav hover slide | `md:group-hover:translate-y-[32px]` duplicate span | Not used (no nav) |
| Underline grow | `h-[1px] bg-current w-0 group-hover:w-full duration-300` | Not used |
| Marquee | `motion-safe:animate-marquee` | Not used |
| Scroll parallax | `data-scroll-speed` via Locomotive Scroll | Not used |
| String pluck | Canvas physics + brightness pulse | **Core interaction** |
| Custom cursor | Fixed dot, `pointer-events-none`, hidden on touch | **Core interaction** |

## Spacing Reference

| Token | Value | Usage |
|---|---|---|
| Page padding | `px-[20px] md:px-[30px]` | Horizontal gutters |
| Header top | `pt-[20px] md:pt-[25px]` | Fixed header offset |
| Hero top pad | `pt-[100px] md:pt-[140px] xl:pt-[160px]` | Below fixed header |

Elektrokebab uses full-viewport canvas; overlay centered with `p-6 md:p-10`.

## Accessibility Notes from Reference

- `aria-label` on nav links and mode buttons
- `sr-only` on form labels
- `motion-safe:` prefix on decorative animations
- Focus styles on interactive elements (`focus:outline-none` + border change on some inputs)

Elektrokebab adds: `prefers-reduced-motion` fallbacks, record/play/upload controls, audio gated on user gesture.
