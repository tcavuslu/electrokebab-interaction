export default function HeroOverlay() {
  return (
    <div className="pointer-events-none flex h-full flex-col items-center justify-center px-6 text-center text-off-white md:px-10">
      <h1
        className="font-display uppercase leading-[0.82]"
        style={{
          fontSize: "var(--text-display)",
          letterSpacing: "var(--tracking-display)",
        }}
      >
        Elektrokebab
      </h1>
      <p
        className="mt-4 font-mono font-normal tracking-tight"
        style={{ fontSize: "var(--text-tagline)" }}
      >
        Anatolian Psychedelic · Paris, FR
      </p>
      <p
        className="mt-3 font-mono font-normal tracking-tight text-off-white/75"
        style={{ fontSize: "var(--text-hint)" }}
      >
        Drag across the strings
      </p>
    </div>
  );
}
