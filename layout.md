# Layout — Single Section (Split Hero + Strings)

One viewport, no header/footer/navigation. Content from [content.md](./content.md). Tokens from [assets.md](./assets.md).

Based on the approved screenshot: **branding on top, playable strings below** — clearer hierarchy and a larger hit area for interaction.

## Wireframe

```
┌─────────────────────────────────────────────┐
│                                             │  ~48vh
│           ELEKTROKEBAB               z-10   │
│   Anatolian Psychedelic · Paris, FR         │
│        Drag across the strings              │
│                                             │
├─────────────────────────────────────────────┤
│  │ │ │ │ │ │ │ │ │ │ │ │ │ │ │ │     z-0   │  ~52vh
│  (strings — full height, top border to bottom) │
│                                             │
│     [Record]  [Play]  [Upload]       z-30   │
│                              ○ cursor z-50  │
└─────────────────────────────────────────────┘
          100vh · flex column · overflow hidden
```

## Regions

| Region | Height | Content | pointer-events |
|---|---|---|---|
| Hero band | `flex: 0 0 48vh` (min 300px) | Title, tagline, hint | none |
| String stage | `flex: 1` | Canvas + record controls | auto on canvas & buttons |

## Layer Stack

| z-index | Layer | Component |
|---|---|---|
| 0 | String canvas | `StrummerCanvas` (fills string stage only) |
| 10 | Hero copy | `HeroOverlay` |
| 30 | Record / Play / Upload | `RecordControls` |
| 50 | Custom cursor | `CustomCursor` |

## Typography placement (hero band)

- **Title:** centered, uppercase, Bebas Neue (`font-display`), `12.5vw` / `leading-[0.82]`
- **Tagline / hint:** IBM Plex Mono (`font-mono`), `tracking-tight`
- Vertical rhythm: title → 1rem gap → tagline → 0.75rem gap → hint
- Hero band uses pure black background; all text `off-white`

## String stage

- Full width of viewport
- Strings span **top to bottom of string stage only** (not behind hero text)
- Idle strings: 2px `#444444` vertical lines, **full stage height** (top border to bottom of viewport)
- Active pluck: red stroke glow (`#E63B2E` blend)
- Record controls: bottom center, yellow pill buttons, **16px gap**, active ring `off-black`

## Interaction Flow

Pluck detection runs only within the string canvas bounds. Audio uses psychedelic synth mapped to bağlama notes.

## Responsive Rules

| Breakpoint | Hero band | Strings |
|---|---|---|
| Mobile | 38vh min-height, scaled type | Touch pluck; no custom cursor |
| Tablet+ | 40vh | Custom cursor enabled |
| All | Type scales via `clamp()` | String count recalculates on resize |

## Accessibility

- Record controls: yellow background, off-black text (≥ 4.5:1 on [assets.md](./assets.md))
- Canvas: `role="img"`, descriptive `aria-label`
- Reduced motion: static strings, no cursor dot
