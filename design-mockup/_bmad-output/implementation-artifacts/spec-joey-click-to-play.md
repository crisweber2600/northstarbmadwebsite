---
title: 'Play Joey only on button click'
type: 'feature'
created: '2026-07-16'
status: 'done'
route: 'one-shot'
---

# Play Joey only on button click

## Intent

**Problem:** Joey's animation and voice started from viewport visibility, but the user wants the media to remain completely paused while scrolling.

**Approach:** Remove native and scripted autoplay, keep the poster visible with an always-available play button, and play the welcome once with sound only after that button is activated. Restore the button after completion, interruption, or failure so playback always requires a fresh click.

## Suggested Review Order

**Click-only playback**

- Makes the button the sole playback entry point with guarded recovery.
  [`app.js:59`](../../app.js#L59)

- Removes autoplay and looping attributes while retaining the transparent source.
  [`index.html:213`](../../index.html#L213)

**Control presentation**

- Connects the persistent accessible button directly to Joey's video.
  [`index.html:226`](../../index.html#L226)

- Prevents direct video interaction and communicates disabled playback state.
  [`styles.css:708`](../../styles.css#L708)
