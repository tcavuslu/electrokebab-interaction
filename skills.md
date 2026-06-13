# Frontend Developer Guide — Elektrokebab

Build guide for the interactive one-page site. Read [rf.md](./rf.md), [assets.md](./assets.md), [content.md](./content.md), and [layout.md](./layout.md) first.

## Stack

- **Next.js 14+** App Router
- **React 18** client components for canvas/audio
- **TypeScript**
- **Tailwind CSS 3**
- **Web Audio API** (no external audio library)

## Project Structure

```
/
├── rf.md
├── assets.md
├── content.md
├── layout.md
├── skills.md
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── StrummerCanvas.tsx
│   ├── HeroOverlay.tsx
│   ├── CustomCursor.tsx
│   └── RecordControls.tsx
├── lib/
│   ├── stringPhysics.ts
│   └── baglamaAudio.ts
└── tailwind.config.ts
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Design Tokens (Tailwind)

Use three brand colors plus canvas black:

```tsx
className="bg-black text-off-white"           // hero
className="bg-[#F5D547] text-off-black"       // buttons (yellow pill)
// strings idle stroke: #444444 (canvas)
// string pluck glow: red #E63B2E
```

Fonts via `next/font/google`: **Bebas Neue** (display title), **IBM Plex Mono** (UI + buttons).

Layout: split column — hero band (`h-hero` ~40vh) + string stage (`flex-1`).

## Component Contracts

### `StrummerCanvas`

```tsx
type StrummerCanvasProps = {
  onPluck?: (stringIndex: number, velocity: number) => void;
  reducedMotion?: boolean;
};
```

- Client component (`"use client"`)
- Owns canvas ref, animation loop, resize handler
- Calls `onPluck` when a string is plucked
- Imports physics from `lib/stringPhysics.ts`

### `baglamaAudio`

```ts
export function initAudio(): Promise<void>;
export function pluck(stringIndex: number, velocity: number): Promise<void>;
export function startRecording(): Promise<void>;
export function stopRecording(): Promise<Blob | null>;
export function playRecording(): Promise<void>;
export function uploadRecording(): void;
```

- Singleton `AudioContext`, resumed on first user gesture
Electronic bağlama pluck synth: saw + triangle, bandpass sweep, wave shaper, 60 ms delay. Maps string index to note table in [assets.md](./assets.md). Live audio and recording share one master bus.

### `HeroOverlay`

- Renders copy from [content.md](./content.md)
- `pointer-events-none`, centered flex column

### `CustomCursor`

- Follows mouse via `mousemove` on window
- Hidden when `prefers-reduced-motion` or touch device

### `RecordControls`

- Record / Play / Upload yellow pills at bottom of string stage
- `gap-4` (16px) between buttons; active recording ring `ring-off-black`

## Page Composition (`app/page.tsx`)

```tsx
<main className="flex h-screen flex-col overflow-hidden bg-black">
  <section className="relative h-hero shrink-0">
    <HeroOverlay />
  </section>
  <section className="relative min-h-0 flex-1 basis-0">
    <StrummerCanvas onPluck={handlePluck} reducedMotion={reducedMotion} />
    <RecordControls />
  </section>
  <CustomCursor enabled={!reducedMotion} />
</main>
```

## String Physics

Ported from the reference HTML demo:

- `initStrings(width, height)` — column count from `width / 36`, min 8 strings
- Idle stroke `#444444`, 2px width, full stage height; pluck glow transitions to red
- `pluckString(strings, index, force)` — middle-segment displacement
- `updateStrings(ctx, strings)` — tension/damping simulation + draw; settles after 2.5s

## Audio Implementation

Electronic bağlama pluck synth (original v2):

1. Saw + triangle oscillators with bandpass sweep
2. Soft clipping (wave shaper) and 60 ms delay
3. Gain envelope tied to velocity
4. Master bus → speakers (live) + MediaRecorder (session blob in RAM)

## Accessibility Checklist

- [ ] Record controls keyboard-focusable with visible focus ring (`off-black`)
- [ ] `prefers-reduced-motion` disables cursor + string animation
- [ ] Canvas has descriptive `aria-label`
- [ ] Text contrast: off-white on `#000`
- [ ] Touch: `touch-action: none` on canvas

## Testing Checklist

- [ ] Desktop: drag across strings, hear pitched notes
- [ ] Mobile: touch drag plucks strings
- [ ] Resize: strings re-init without crash
- [ ] Record / Play / Upload capture and playback work
- [ ] Reduced motion: static strings, no cursor dot
- [ ] `npm run build` passes

## Do Not

- Add extra pages or navigation
- Introduce colors beyond off-white, off-black, yellow buttons (+ canvas `#444444` strings, red pluck glow)
- Autoplay audio before user interaction
