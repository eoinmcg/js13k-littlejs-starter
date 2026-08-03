# Agent Context: js13k Games LittleJS Starter Kit

You are assisting a developer building a game for **js13kGames**, a competition where the ENTIRE zipped package (HTML, JS, CSS, sound, assets) must remain **under 13,312 bytes (13KB)**.

## Core Rules & Mandates

1. **Size is Priority #1:** 
   - Never suggest adding external npm libraries or heavy dependencies.
   - Write dense, idiomatic, golfable JavaScript/TypeScript.
   - Favor built-in web APIs or LittleJS built-ins over custom utility functions.
   - Avoid verbose object-oriented abstractions if a simple flat array, bitmask, or plain object works.

2. **LittleJS Constraints:**
   - LittleJS handles rendering (WebGL/2D Canvas), audio (ZzFX), physics, input, and particle systems natively. Use its built-in API functions before writing custom code.
   - Always reference LittleJS global helpers (`vec2`, `rand`, `cameraPos`, `tile`, etc.) instead of recreating math functions.
   - Audio MUST use ZzFX sound strings (`zzfx(...)`). Do not load external `.mp3` or `.wav` assets.

3. **Project Variants (Vanilla / ESM / TS):**
   - Keep syntax compatible with the project structure chosen by the user:
     - **Vanilla:** Global script includes, no imports/exports.
     - **ESM:** Standard ES Modules (`import`/`export`).
     - **TS:** Strict types, but avoid heavy TypeScript-only features like large Enums that compile to bloated JS IIFEs. Use `const enum` or plain union types instead.

---

## Build System & Optimization Guidelines

- **Bundling/Minification:** The build pipeline uses Roadroller / Terser / micro-bundlers.
- **Minifier-Friendly Patterns:**
  - Prefer flat function structures.
  - Avoid object dynamic property access (e.g., `obj[dynamicKey]`) where possible, as minification breaks property mangling.
  - Reuse vector instances (`vec2()`) rather than allocating new objects in hot render/update loops to keep memory low and code short.

---

## LittleJS Quick Reference Checklist

When writing or refactoring game logic:
- [ ] **Game Loop:** Put update logic inside `gameUpdate()` and rendering in `gameRender()`.
- [ ] **Objects:** Inherit from `EngineObject` for physics/rendering integration.
- [ ] **Input:** Use `keyIsDown()`, `mousePos`, `gamepadIsDown()`.
- [ ] **Sound:** Generate sounds using ZzFX syntax or `Sound()` wrapped objects.
- [ ] **Sprites:** Use `tileSize` and `tile()` index mappings rather than separate image assets.
