# Pixel Meteor Film Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan in this session. User has requested continuous production through a finished MP4.

**Goal:** Deliver the approved 48-second, 16:9 pixel-and-paper comedy with synchronized game music and in-scene comic dialogue.

**Architecture:** A deterministic Canvas scene renderer inside an HTML composition. A paused GSAP timeline drives the same absolute time used by the 16-shot cue sheet. HyperFrames renders the HTML composition and muxes a locally synthesized 48-second soundtrack.

**Tech Stack:** HTML, CSS, JavaScript Canvas 2D, GSAP, HyperFrames, Python/NumPy/SciPy audio synthesis, FFmpeg.

**Spec:** https://chatgpt.com/space/page_9cadf5ef1d6481918860c9a928a5fac0 and https://chatgpt.com/space/page_e03ef33ee1f88191adf479feb8dcfe25. Local sound specification: /workspace/asset/音乐/画面同步声音参考.json.

## Global Constraints
- 48 seconds, 1920×1080, 30 fps; continuous approved 16-shot timing.
- Original red/yellow/blue/green/purple cast and recognizable pixel Tiga/Spark Lence.
- Warm paper daily life, indigo paper night, stepped pixel figures and hand-drawn environments.
- No human voices. Dialogue uses synthetic game bleeps and in-scene comic speech bubbles; no bottom subtitles.
- Music and effects follow actual motion, meteor approach, transformation, 0.5-second reaction silence, liftoff and meteor contact.
- Approved nine source images and demo remain intact.

## Review Focus
- Seeking a scene out of order must produce the same frame as continuous playback.
- Chinese speech bubbles must fit their panels, remain legible and point at their speaker.
- Five characters and four distinct shocked reactions must remain identifiable.
- The meteor must visibly change from approaching Earth to moving away after contact.
- Audio/video durations must agree and the intentional reaction silence must contain no music or speech.

### Task 1: Deterministic composition and production assets
Files: index.html, src/timeline.js, src/film.js, assets/, tests/timeline.test.mjs.
- [x] Pin local runtime dependencies and confirm HyperFrames contract and browser availability.
- [x] Test 16 contiguous shot ranges totaling 48 seconds and boundary selection, then implement timeline exports.
- [x] Preserve source assets and prepare animation resources and fonts.

### Task 2: Scene animation
Files: src/art.js, src/actors.js, src/scenes.js, src/film.js.
Interface: renderFrame(ctx, time) paints the entire 1920×1080 frame from an absolute second value.
- [x] Build reusable pixel puppets, props, paper environments, bubbles and effects.
- [x] Implement all 16 scenes and continuity beats on the fixed timeline.
- [x] Capture key frames and inspect full-size readability, framing, transformation and meteor trajectory.
- [x] Verify deterministic seeking, font/image loading and absence of browser errors.

### Task 3: Picture-driven sound
Files: scripts/compose_score.py, assets/audio/full-mix.wav, assets/audio/stems/, output/audio-cues.json.
- [x] Compose the original 48-second chiptune score from the approved demo's motif and timbres.
- [x] Synthesize per-character game dialogue and action sound effects using shared cue timing.
- [x] Verify 48 kHz stereo duration, finite samples, peak headroom and 32.5–33 second musical/speech silence.

### Task 4: Render and deliver
Files: scripts/check-browser.mjs, output/说好只是看流星.mp4, output/verification.json, README.md.
- [x] Lint the HyperFrames composition and render the complete MP4.
- [x] Verify codec, dimensions, frame count, audio stream, 48-second duration and decodability.
- [x] Review representative frames from the encoded film, fix any material visual defects, and package sources.
- [x] Provide the local MP4 and reproducible project to the user.

## Production review record

- Timeline: four tests pass, sixteen contiguous shots covering 0–48 seconds.
- Browser: twenty-three keyframes captured; suppressed-callback and out-of-order seeking produce identical frames.
- Sound: original 48-second stereo mix and nine stems; exact zero samples at 32.5–33 seconds.
- Full HyperFrames check: lint/runtime/contrast pass; intentional edge-to-edge Canvas marked explicitly.
- Final independent review: corrected the 45-second cut to match meteor position/radius, hero position/scale and Earth framing exactly. No remaining material findings.
- Final MP4 verified: H.264 yuv420p, 1920×1080, 30 fps, 1440 frames, exactly 48 seconds; AAC stereo 48 kHz, exactly 48 seconds. Full decode has no errors. Eight encoded keyframes match source frames (mean absolute pixel error 1.95–2.77); audio correlation 0.99914 and reaction-pause interior RMS 0.0. Final HyperFrames check has zero errors and warnings.
