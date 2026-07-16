---
title: 'Add HEVC-with-alpha Joey fallback for iPad Safari'
type: 'bugfix'
created: '2026-07-16'
status: 'done'
baseline_commit: 'c4a74853077f5423cb765fa334b3bf860227d4f3'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/spec-joey-welcome-video.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-joey-click-to-play.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The Meet Joey video is transparent in browsers that correctly render the VP8-alpha WebM, but iPad Safari shows an opaque background. iPadOS Safari needs an Apple-native HEVC-with-alpha source while the existing WebM remains necessary for other browsers.

**Approach:** Convert the existing alpha WebM through a ProRes 4444 intermediate with Apple's AVFoundation HEVC-with-alpha exporter, preserving audio. Add the resulting `.mov` as the first native video source, retain the WebM fallback, verify both media tracks and transparency metadata, then deploy through the repository's existing Azure Static Web Apps workflow.

## Boundaries & Constraints

**Always:** Stop conversion if the WebM does not report `TAG:ALPHA_MODE=1`; use `AVAssetExportPresetHEVCHighestQualityWithAlpha`; require AVFoundation to confirm the final video contains alpha; preserve the 720×1280 dimensions and audio track; keep the existing click-to-play behavior, poster, accessible label, blue background, rings, stars, quote, and responsive layout; list the HEVC `.mov` before the WebM so Safari selects it; retain the WebM for non-Apple browsers; report the final SHA-256 checksum and file size; deploy only after local verification passes.

**Ask First:** Changing Joey's visual or spoken content; removing the WebM fallback; changing the playback interaction; modifying the Azure deployment workflow; using an encoder other than Apple's HEVC-with-alpha preset.

**Never:** Ship the large ProRes intermediate; replace the WebM globally with a MOV-only implementation; claim transparency based only on the `.mov` extension or codec name; modify unrelated page sections, styles, scripts, or dependencies.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| iPad Safari | Browser supports `video/quicktime` HEVC with alpha | Safari selects the HEVC `.mov`; Joey composites over the existing section and plays with audio after the button is pressed | The poster remains visible if media cannot load |
| Other modern browser | Browser does not support the HEVC source but supports VP8-alpha WebM | Browser skips the MOV and selects the existing WebM with unchanged transparent playback and audio | Native video fallback text remains if neither source is supported |
| Invalid conversion | Input lacks alpha, export is incompatible, alpha validation fails, video dimensions change, or audio is absent | No converted asset is shipped or deployed | Stop and report the failed verification gate |

</frozen-after-approval>

## Code Map

- `assets/joey-welcome-transparent.webm` -- Current VP8-alpha source with Joey's embedded welcome audio.
- `assets/joey-welcome-transparent-hevc.mov` -- New Apple-native HEVC-with-alpha output; generated asset to deploy.
- `index.html` -- Native Joey `<video>` source ordering and fallback behavior.
- `app.js` -- Existing click-only audio/playback state machine; must remain behaviorally unchanged.
- `.github/workflows/azure-static-web-apps-happy-flower-0aa290510.yml` -- Existing push-to-`main` deployment path; inspect but do not modify.

## Tasks & Acceptance

**Execution:**
- [x] `assets/joey-welcome-transparent-hevc.mov` -- verify WebM alpha, create ProRes 4444 intermediate, export with Apple's HEVC-alpha preset, and copy only the validated final asset into the deployed assets folder.
- [x] `index.html` -- add the HEVC `.mov` source before the existing WebM source with an explicit QuickTime/HEVC media type so Safari prefers the compatible transparent asset and other browsers retain WebM.
- [x] `_bmad-output/implementation-artifacts/spec-ipad-joey-hevc-alpha.md` -- record conversion checks, checksum, file size, and browser-source verification; deployment and review evidence are appended by the remaining workflow stages.

**Acceptance Criteria:**
- Given the source WebM, when probed before conversion, then it reports VP8 and `TAG:ALPHA_MODE=1`.
- Given the ProRes intermediate, when probed, then it reports ProRes 4444 `ap4h`, 720×1280, and an alpha-capable YUVA pixel format; accept `yuva444p12le` when a current ffprobe exposes ProRes 4444's encoded 12-bit precision even though FFmpeg received the requested `yuva444p10le` encoder input.
- Given the final MOV, when inspected by AVFoundation and ffprobe, then AVFoundation confirms alpha, the video reports HEVC `hvc1` at 720×1280, and an audio stream is present.
- Given the Joey video markup, when Safari evaluates its sources, then the HEVC-alpha MOV appears before WebM; when a browser rejects that MOV type, then the original WebM remains selectable.
- Given the completed page diff, when reviewed, then click-to-play, speech, poster, responsive composition, and all non-Joey content remain unchanged.
- Given all checks pass, when the verified commit reaches `main`, then the Azure Static Web Apps deployment workflow completes successfully and the live site serves the HEVC asset and updated markup.

## Spec Change Log

- 2026-07-16 — Acceptance review found that FFmpeg 8.1.2 reports the valid `ap4h` ProRes 4444 intermediate as `yuva444p12le`, contradicting the version-sensitive `yuva444p10le` output expectation. Amended the intermediate criterion to require the 4444 codec tag, dimensions, and an alpha-capable YUVA format while retaining the requested 10-bit encoder input. This avoids rejecting a valid higher-precision ProRes stream accepted by Apple's alpha exporter. KEEP: VP8 `ALPHA_MODE=1` gate, temporary ProRes-only workflow, Apple HEVC-alpha preset and `.containsAlphaChannel` validation, final `hvc1`/audio/dimension checks, MOV-first/WebM fallback, click-only playback, unchanged layout/content, checksum reporting, and browser fallback QA.

## Design Notes

Source order is the compatibility switch: Safari receives the Apple-native alpha format first, while browsers without QuickTime/HEVC support fall through to WebM. The conversion must use a temporary working directory so the ProRes intermediate never enters the static deployment.

## Verification

**Commands:**
- `ffprobe ... assets/joey-welcome-transparent.webm` -- expected: VP8 plus `TAG:ALPHA_MODE=1`.
- `ffprobe ... joey-intermediate-prores4444.mov` -- expected: ProRes 4444 `ap4h`, 720×1280, and an alpha-capable YUVA pixel format (`yuva444p12le` with FFmpeg 8.1.2).
- `swift hevc-alpha.swift intermediate.mov output.mov` -- expected: `HEVC-with-alpha export succeeded`.
- `ffprobe ... assets/joey-welcome-transparent-hevc.mov` -- expected: HEVC `hvc1`, 720×1280, and an audio stream.
- `shasum -a 256 assets/joey-welcome-transparent-hevc.mov` -- expected: stable checksum recorded in this spec.
- `node --check app.js` and `git diff --check` -- expected: no JavaScript syntax or whitespace errors.
- Azure workflow status and live asset request -- expected: successful production deployment and HTTP 200 for the MOV.

**Manual checks:**
- On a compatible iPad Safari, press “Play Joey's welcome” and confirm the background remains transparent, audio plays, and the ring/star composition is visible through the video background.

## Verification Results

- Source gate passed: `codec_name=vp8` and `TAG:ALPHA_MODE=1`; FFmpeg decoded a 720×1280 alpha plane and found the original 48 kHz stereo Opus track.
- Intermediate gate passed: 720×1280 ProRes 4444, profile `4444`, tag `ap4h`, `yuva444p12le`, 12-bit. FFmpeg received the required `yuva444p10le` encoder input; current ffprobe exposes ProRes 4444's encoded precision as 12-bit.
- The supplied AVFoundation script printed `HEVC-with-alpha export succeeded` and independently confirmed `.containsAlphaChannel` on the output track after the review-loop re-export.
- AVFoundation decoded representative frames at 0.5, 3, 6, and 10 seconds to RGBA. Every sample contained alpha values from 0 through 255 with substantial transparent, partially transparent, and opaque pixel populations, ruling out an all-opaque alpha plane.
- Final video: HEVC `hvc1`, 720×1280. Final audio: AAC, 48 kHz, stereo. Both source and output contain 364 decoded video frames; output duration is 12.133333 seconds versus 12.156000 seconds for the WebM (less than one 30 fps frame difference).
- Final size: 11,245,100 bytes. SHA-256: `63f79291c32e9fd321f07cbd11c6559818d8a651822e0919836439a642610293`.
- Repeated local browser verification confirmed MOV-first/WebM-second ordering. A browser without QuickTime HEVC support selected the WebM, remained paused until the existing button was pressed, then started unmuted playback; no console warnings/errors occurred.
- At a 768×1024 viewport, the Joey media rendered at 368×654 with no page-level horizontal overflow.
- `node --check app.js` and `git diff --check` pass; `app.js` and `styles.css` are unchanged.
- Review iteration 2: the acceptance auditor reported no implementation findings. Remaining adversarial observations are target-device or post-deployment checks, or concern HEVC behavior outside the supported iPad Safari target.

## Suggested Review Order

**Safari source selection**

- Prefers Apple HEVC-alpha while retaining transparent WebM fallback everywhere else.
  [`index.html:223`](../../index.html#L223)

**Validated media**

- Ships the AVFoundation-validated HEVC-alpha movie with preserved AAC audio.
  [`joey-welcome-transparent-hevc.mov:1`](../../assets/joey-welcome-transparent-hevc.mov#L1)

- Records codec, frame-alpha, synchronization, checksum, browser, and responsive evidence.
  [`spec-ipad-joey-hevc-alpha.md:83`](spec-ipad-joey-hevc-alpha.md#L83)

**Review correction**

- Documents why current ffprobe exposes valid ProRes 4444 as 12-bit.
  [`spec-ipad-joey-hevc-alpha.md:63`](spec-ipad-joey-hevc-alpha.md#L63)
