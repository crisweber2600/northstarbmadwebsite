---
title: 'Play Joey welcome audio when Joey enters view'
type: 'feature'
created: '2026-07-16'
status: 'done'
baseline_commit: '8b3fc2c563b699661935f4175c3e2e98f550dab6'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Joey's transparent welcome video contains a spoken greeting, but the website permanently mutes it. Users reaching the Meet Joey section should hear that greeting automatically instead of seeing a silent animation.

**Approach:** Detect when Joey's video becomes meaningfully visible, restart the clip, and attempt one unmuted welcome playback. Because browsers can deny audible autoplay independently of site code, preserve the muted animation and reveal a compact, accessible play-with-sound fallback only when that attempt is rejected.

## Boundaries & Constraints

**Always:** Trigger the welcome when Joey's video—not merely the top of the long section—is at least half visible; restart the clip so speech and animation remain synchronized; play the spoken greeting at most once to completion per page visit; stop, mute, and reset an interrupted greeting after Joey leaves view so audio never continues offscreen; after the greeting completes, resume the existing muted visual loop; handle the `play()` promise without unhandled console errors; show a keyboard-accessible “Play Joey's welcome” button only when audible playback is blocked; retain the transparent WebM, poster, blue background, stars, rings, quote, and responsive composition.

**Ask First:** Replacing or editing the audio/video asset; changing the spoken message; replaying the voice after it has completed once; adding persistent media controls, volume controls, or a site-wide sound preference.

**Never:** Claim to bypass browser or operating-system autoplay policy; start speech before Joey is visible; allow the spoken greeting to loop indefinitely; hide a blocked-playback failure without a usable fallback; alter unrelated sections or third-party dependencies.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| Audible autoplay allowed | Joey video crosses 50% visibility before the greeting has completed | Clip restarts at zero and plays once with audio | On completion, switch back to muted looping animation |
| Audible autoplay denied | `video.play()` rejects with `NotAllowedError` after unmuting | Muted animation continues and the play-with-sound button appears | Button click restarts the clip unmuted from zero and hides the fallback after success |
| Joey leaves during speech | Video falls out of view before the greeting completes | Pause, mute, and reset the clip; no offscreen speech | Re-entering view makes a fresh automatic attempt because the greeting did not complete |
| Media failure | Playback rejects for a reason other than autoplay policy | Keep the poster or muted playable state without breaking the page | Do not expose an audio button that cannot work; log one concise diagnostic |

</frozen-after-approval>

## Code Map

- `index.html` -- Joey video markup and the hidden accessible fallback button.
- `app.js` -- Existing top-level vanilla JavaScript and IntersectionObserver patterns; owns visibility-triggered playback state.
- `styles.css` -- Joey composition styles and fallback-button positioning without changing transparency or decorations.
- `assets/joey-welcome-transparent.webm` -- Existing VP8-alpha video with embedded Opus speech; unchanged.
- `_bmad-output/implementation-artifacts/spec-joey-welcome-video.md` -- Completed source-replacement constraints that remain in force.

## Tasks & Acceptance

**Execution:**
- [x] `index.html` -- add a hidden, semantic play-with-sound fallback next to the Joey video while preserving native muted autoplay as the safe visual baseline.
- [x] `app.js` -- observe Joey visibility, coordinate one-shot audible playback and muted looping states, stop offscreen audio, and handle rejected play promises.
- [x] `styles.css` -- style the fallback as a clear, responsive overlay that appears only when JavaScript reports blocked audible autoplay.

**Acceptance Criteria:**
- Given Joey's voice has not completed, when the video becomes at least 50% visible and the browser permits audible autoplay, then the greeting starts from the beginning with sound.
- Given the browser blocks audible autoplay, when the automatic attempt rejects, then Joey continues visually without sound and a keyboard-operable fallback appears.
- Given the fallback is visible, when the user activates it, then the greeting restarts from zero with sound and the fallback is removed after playback starts.
- Given the greeting has completed once, when the video loops or Joey re-enters view, then only the muted animation plays and the voice does not repeat.
- Given Joey leaves view mid-greeting, when the observer reports it offscreen, then speech stops immediately and no unhandled playback error reaches the console.
- Given the completed change at desktop and mobile widths, when the Meet Joey section renders, then transparency, stars, rings, copy, spacing, and the rest of the page remain unchanged.

## Spec Change Log

## Design Notes

Scrolling or an IntersectionObserver callback is not a trusted activation in major browsers. The automatic attempt is still worthwhile for users whose browser grants site media permission or engagement-based autoplay, but the rejection path is part of the feature rather than an optional enhancement. Keep the logic as a small block after the existing active-section observer; do not couple media state to reveal animations or navigation highlighting.

## Verification

**Commands:**
- `git diff --check` -- expected: no whitespace errors.
- `rg -n "joey.*audio|NotAllowedError|IntersectionObserver" app.js index.html styles.css` -- expected: the feature remains scoped to Joey.

**Manual checks (if no CLI):**
- Test both allowed and blocked autoplay paths, scroll away during speech, re-enter, finish one greeting, and confirm no repeated voice or console errors at 1440px and 375px.

## Verification Results

- `node --check app.js` and `git diff --check` pass.
- Browser policy-denial path verified: the muted visual loop continues and the fallback remains usable after rejected automatic and click attempts.
- Visibility exit below 50% verified: playback pauses, resets to zero, mutes, and hides the fallback; re-entry makes a fresh attempt.
- Responsive checks at 1440×900 and 375×812 keep Joey and the 44px-minimum fallback within the viewport without changing the 30px quote gap.
- Browser diagnostics remained empty during the exercised paths; the allowed-playback completion path was covered by the focused state-machine review because the test browser enforces audible-autoplay denial.

## Suggested Review Order

**Playback state machine**

- Coordinates automatic speech, blocked-autoplay recovery, completion, and media failures.
  [`app.js:59`](../../app.js#L59)

- Preserves the fallback until audible playback actually succeeds.
  [`app.js:118`](../../app.js#L118)

**Visibility lifecycle**

- Stops speech below 50% visibility and while the document is hidden.
  [`app.js:194`](../../app.js#L194)

**Accessible fallback**

- Adds the live, keyboard-operable play-with-sound action beside Joey.
  [`index.html:225`](../../index.html#L225)

- Keeps the control responsive, readable, and touch-sized across viewports.
  [`styles.css:716`](../../styles.css#L716)
