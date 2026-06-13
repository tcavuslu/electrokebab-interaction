# Assets & Design Tokens

Design system and audio specification for Elektrokebab. Color values derived from [rf.md](./rf.md).

## Color System (3 colors max)

| Token | CSS variable | Hex | Role |
|---|---|---|---|
| Off white | `--color-bg` | `#F5F0E8` | Primary text on dark / light surface |
| Off black | `--color-fg` | `#191926` | Button label text, dark surface |
| Yellow | `--color-accent` | `#F5D547` | **Button backgrounds** (from ref `bg-yellow`) |

Red (`#E63B2E`, ref `text-red`) is reserved for **string pluck glow** only — not a fourth brand color.

String idle stroke: `#444444` (canvas only, not a brand token).

### Tailwind extension

```ts
colors: {
  "off-white": "#F5F0E8",
  "off-black": "#191926",
  yellow: "#F5D547",
  accent: "#F5D547", // alias for buttons
  red: "#E63B2E",    // string pluck glow only
}
```

### Semantic usage

| Context | Background | Text / stroke | Notes |
|---|---|---|---|
| Page / hero | `#000000` | `off-white` | Pure black stage |
| String canvas | `#000000` | `#444444` idle | 2px lines, 58% stage height |
| Buttons (Record, Play, Upload) | `#F5D547` | `off-black` | Rounded pill, ref player pill |
| Button gap | — | — | `16px` (`gap-4`) |
| Button active (recording) | — | — | 2px ring `off-black` |
| Button focus | — | — | 2px ring `off-black` |
| Active string pluck | — | red glow | Transitions from `#444444` |

## Typography Tokens

| Token | CSS variable | Value |
|---|---|---|
| Display font | `--font-display` | Bebas Neue (Google Fonts) |
| UI font | `--font-mono` | IBM Plex Mono (Google Fonts) |
| Display size | `--text-display` | `clamp(2.5rem, 12.5vw, 8rem)` |
| Tagline size | `--text-tagline` | `clamp(1rem, 2.2vw, 1.35rem)` |
| Hint size | `--text-hint` | `clamp(0.875rem, 1.5vw, 1.125rem)` |
| Tracking display | `--tracking-display` | `0.02em` |
| Line height display | `--leading-display` | `0.82` |

Loaded via `next/font/google` in [layout.tsx](../app/layout.tsx).

## Spacing & Layout Tokens

| Token | Value |
|---|---|
| `--hero-height` | `max(48vh, 300px)` |
| `--string-height-ratio` | `0.58` (strings drawn at 58% of stage height, centered) |
| `--space-page` | `1.5rem` / `2.5rem` (md+) |
| `--button-gap` | `16px` |
| `--z-canvas` | `0` |
| `--z-overlay` | `10` |
| `--z-controls` | `30` |
| `--z-cursor` | `50` |

## Button tokens

| Token | Value | Source |
|---|---|---|
| Background | `#F5D547` | Ref `bg-yellow` |
| Text | `#191926` | Ref `text-off-black` on yellow pill |
| Weight | `600` | Ref mono UI controls |
| Gap | `16px` | Between Record / Play / Upload |
| Active ring | `#191926` | Recording state |
| Radius | `9999px` | Ref `rounded-full` |
| Padding | `0.5rem 1rem` | Compact pill |
| Uppercase | yes | Ref nav / player controls |

## Electronic Bağlama Synth (note-based)

Runtime **electronic pluck synthesizer** — the original v2 sound: saw + triangle oscillators, bandpass sweep, soft clipping, short delay. Psychedelic but clear, not acoustic Karplus.

### Tuning — kısa sap bağlama (A–D–G course pattern)

| String index (mod 7) | Note | Frequency (Hz) | Course |
|---|---|---|---|
| 0 | A2 | 110.00 | Alt tel |
| 1 | D3 | 146.83 | Orta tel |
| 2 | G3 | 196.00 | Üst tel |
| 3 | A3 | 220.00 | Alt tel (+1 oct) |
| 4 | D4 | 293.66 | Orta tel (+1 oct) |
| 5 | G4 | 392.00 | Üst tel (+1 oct) |
| 6 | A4 | 440.00 | Alt tel (+2 oct) |

Strings beyond index 6 repeat at +1 octave (`freq * 2`).

### Synthesis parameters

| Parameter | Value | Notes |
|---|---|---|
| Body | Sawtooth | Pitch bend to 0.98× over 1.2 s |
| Shimmer | Triangle at 2× | Detune +11 cents |
| Filter | Bandpass Q=9 | Sweep 4.5× → 1.8× fundamental |
| Lowpass | 3200 → 900 Hz | Warm decay |
| Saturation | Wave shaper (18) | 2× oversample |
| Delay | 60 ms, 18% wet | Short psychedelic space |
| Decay | ~2.1 s | Matches canvas settle (2.5 s) |
| Velocity → gain | `0.12 + velocity * 0.07` | Capped at 0.75 |
| Velocity → detune | `±velocity * 8` cents | Expressive drift |

### Session recording (demo)

| Topic | Behavior |
|---|---|
| **Live sound** | Every pluck routes to `AudioContext.destination` via master gain (heard immediately) |
| **Record bus** | Same master gain also feeds `MediaStreamDestination` for capture |
| **Storage** | **In-memory only** — `Blob` held in JS for the current page session |
| **Persistence** | Lost on page reload; not written to disk or `localStorage` |
| **Play** | Replays the in-memory blob via temporary object URL (revoked on stop) |
| **Upload** | Triggers browser download (`elektrokebab-recording.webm`) — only way to save locally |
| **New Record** | Clears previous session blob before starting again |

Best practice for this demo: no server upload, no cache API — keep one session recording in RAM, download on demand.

### Controls

| Control | Behavior |
|---|---|
| Record | Captures master bus via `MediaRecorder` (WebM/Opus) |
| Play | Plays back last in-session recording |
| Upload | Downloads recording file to user's device |

## Accessibility Matrix

| Requirement | Implementation | Target |
|---|---|---|
| Hero text | White on `#000` | ≥ 4.5:1 |
| Button text | `off-black` on `yellow` | ≥ 4.5:1 |
| Strings | `#444444` on `#000` | Decorative; pluck adds red glow |
| Motion | `prefers-reduced-motion`: static strings, no custom cursor | WCAG 2.2 |
| Audio | Init on first interaction | Browser policy |
| Touch | `touch-action: none` on canvas; pluck threshold 40px | Mobile usable |
| Keyboard | All controls focusable with visible focus ring | Operable |

## Visual Assets

No image assets. Canvas strings are drawn procedurally.
