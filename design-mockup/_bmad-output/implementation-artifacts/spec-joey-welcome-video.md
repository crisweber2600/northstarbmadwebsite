---
title: 'Replace Joey artwork with morning welcome video'
type: 'feature'
created: '2026-07-15'
status: 'done'
baseline_commit: 'a0277ab714623a5bb4ae08df89c87f34351152a9'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Meet Joey section currently renders a static Joey image with the speech bubble while CSS adds an olive/yellow aura behind it. The user-provided transparent morning-welcome WebM should become the foreground media without losing the section's existing blue, ring, and star composition.

**Approach:** Add the supplied alpha-enabled WebM as a local site asset and replace only the Joey `<img>` with a responsive HTML `<video>`. Preserve the surrounding aura container, rings, and star elements, while removing the aura pseudo-element that creates the yellow blur so the existing background remains visible around Joey.

## Boundaries & Constraints

**Always:** Work on `codex/joey-welcome-video`; use the supplied transparent WebM; keep the video speech bubble visible; preserve the Meet Joey copy, role table, quote, section gradient, decorative rings, and star elements; keep the background transparent so the existing stars/rings and blue section remain visible around Joey; make the portrait video fit without clipping or overlapping the quote at desktop and mobile widths; use browser-compatible muted inline autoplay and looping so playback is not blocked.

**Ask First:** Adding visible playback controls or an audio/unmute interaction; preprocessing, color-keying, re-encoding, or otherwise modifying the supplied video; changing any Meet Joey content or decorative element outside the foreground media and its yellow aura.

**Never:** Replace the whole Joey section; remove or redesign the star/ring background; delete `assets/joey.png`; introduce JavaScript or third-party video dependencies when native HTML/CSS suffices; remove unrelated background glows elsewhere on the page.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Normal playback | Browser supports the supplied alpha-enabled WebM | Joey and the attached speech bubble render with a transparent background as a muted, inline, looping animation inside the existing composition | Existing transparent Joey PNG remains available as the video poster |
| Narrow viewport | Meet Joey grid is single-column at 980px or below | Full portrait video remains visible, centered, and separated from the quote without horizontal overflow | Responsive sizing caps width/height instead of cropping the speech bubble or Joey |

</frozen-after-approval>

## Code Map

- `index.html` -- Meet Joey markup; replace only `.joey-img` with `.joey-video` and native playback attributes.
- `styles.css` -- Joey aura, media sizing, rings, stars, and responsive layout; remove the character aura blur and add portrait-video rules.
- `assets/joey-welcome-transparent.webm` -- Local copy of the user-supplied alpha-enabled video, renamed to a URL-safe filename.
- `assets/joey.png` -- Existing artwork retained as an untouched legacy asset.

## Tasks & Acceptance

**Execution:**
- [x] `assets/joey-welcome-transparent.webm` -- copy the supplied transparent WebM into the deployed asset folder without transcoding so the static site can load it locally.
- [x] `index.html` -- replace the Joey image element with an accessible native video using muted autoplay, loop, and plays-inline behavior while leaving the surrounding rings/stars unchanged.
- [x] `styles.css` -- remove only `.joey-aura::before`, add responsive portrait-video sizing, and reserve enough layout height to prevent quote overlap while preserving the existing decorative composition.

**Acceptance Criteria:**
- Given the Meet Joey section loads in a modern browser, when the foreground media appears, then the supplied transparent Joey morning-welcome video replaces the old static image, its speech bubble remains fully visible, and no opaque video background covers the existing star composition.
- Given browser autoplay policy, when the page loads, then the video starts muted, plays inline, and loops without requiring interaction.
- Given the existing Joey composition, when the replacement is rendered, then the blue section background, ring elements, and star elements remain present while the olive/yellow CSS aura immediately around Joey is absent.
- Given viewport widths around 1440px, 980px, 640px, and 375px, when the section is viewed, then the video is not cropped, does not overlap the quote, and causes no horizontal overflow.
- Given the completed diff, when unrelated page sections and scripts are inspected, then they remain unchanged.

## Spec Change Log

- 2026-07-16 — The user replaced the original opaque MP4 with `Joey_welcome_transparent_final (1).webm` and explicitly requested complete background removal. Updated the approved source format/path and transparency acceptance requirement to avoid the known-bad opaque gold rectangle. KEEP: native autoplay/muted/loop/plays-inline behavior, transparent PNG poster, responsive portrait sizing, original ring geometry, star elements, section copy, and removed CSS aura.

## Design Notes

The WebM is portrait-oriented and materially taller than the current square aura container. Size it as a contained foreground layer and let the layout reserve its actual visual height; do not use `object-fit: cover`, which would cut the speech bubble or Joey's feet. Preserve its alpha channel so the original rings, stars, and blue section background show through around Joey.

## Verification

**Commands:**
- `git diff --check` -- expected: no whitespace errors.
- `file assets/joey-welcome-transparent.webm` -- expected: WebM in the deployed asset path.
- `python3 -m http.server 4173` -- expected: the static site serves locally for browser inspection.

**Manual checks (if no CLI):**
- Inspect the Meet Joey section at 1440px, 980px, 640px, and 375px; confirm playback, alpha transparency around Joey, full speech-bubble/character visibility, retained rings/stars, no CSS yellow aura, no quote overlap, and no Joey-caused horizontal overflow.

## Suggested Review Order

**Foreground media replacement**

- Replaces only Joey's static artwork with native transparent autoplay video.
  [`index.html:213`](../../index.html#L213)

- Ships the supplied alpha-enabled WebM unchanged under a URL-safe name.
  [`joey-welcome-transparent.webm:1`](../../assets/joey-welcome-transparent.webm#L1)

**Composition and responsive layout**

- Removes the yellow aura while retaining the original ring and star layers.
  [`styles.css:685`](../../styles.css#L685)

- Centers the portrait video and reserves its overflow without clipping.
  [`styles.css:700`](../../styles.css#L700)

- Keeps the quote within narrow viewports beneath the taller video.
  [`styles.css:733`](../../styles.css#L733)
