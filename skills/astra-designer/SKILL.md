---
name: astra-designer
description: Build and deploy distinctive branded websites, cinematic landing pages and scroll-driven experiences with layered heroes, optional Higgsfield AI media, responsive layouts and visual verification. Use when asked for Astra Designer or to create a premium interactive website; not for standalone video editing.
---

# Astra Designer

A website design and deployment skill by Samin Yasar. Turn a real brand brief into an expressive, useful site. Use the client's identity for each website; Astra Designer is the tool identity, not a mandatory footer badge.

## Brand and brief
Reuse the user's context and assets. Ask only about missing decisions that materially affect the work: audience, promise, next action, visual direction, existing assets and publishing destination. When creative direction is delegated, record assumptions and proceed. Do not force an interview or extra approval for already authorized work.

For Samin's own projects, identify the owner as Samin Yasar and the tool as Astra Designer. Use provided brand assets when available. If no kit is supplied, propose ink, ivory and electric blue with editorial type as a starter direction, not an established brand standard. Other client briefs override these defaults. Do not invent Samin's statistics or endorsements. Do not carry template companies, external creator logos, demo testimonials or provider badges into visible pages, metadata, favicons, social previews or structured data. Preserve required third-party licenses in source distributions; legal notices need not be marketing UI.

Record the brief in the build folder: source facts, assumptions, visitor journey, emotional peak, CTA and asset plan. Respect any local Markdown review workflow when user review is requested.

## Bootstrap
Resolve `<skill>` to this folder. Run:

```bash
node <skill>/scripts/doctor.mjs
node <skill>/scripts/workspace.mjs --ensure
node <skill>/scripts/new-site.mjs /absolute/path/to/new-site
```

The starter is a working static seed, not a finished bespoke design. The destination must be absent or empty. Install verification dependencies in the build project with `npm install --save-dev playwright-core` if needed. Node 18+, a full ffmpeg build for media, and Chrome/Chromium for visual checks are supported. Optional overrides: `ASTRA_DESIGNER_FFMPEG`, `ASTRA_DESIGNER_CHROME`. Workspace resolution: `ASTRA_DESIGNER_HOME`, nearest `.astra-designer.json` with a `workspace` field, then `<project-root>/astra-designer` (cwd if no git root). Keep output and credentials outside the installed skill.

## Design and build
Read [taste.md](references/taste.md), [uniqueness.md](references/uniqueness.md), [hero-depth.md](references/hero-depth.md) and [approved-collection.md](references/approved-collection.md) when planning a new premium site. Choose a grammar that fits the journey: filmic, editorial, live surface, continuous world, poster, gallery, split stage or rhythmic cuts. Treat the reference constraints as creative defaults; explicit user direction wins. Vary structure across projects using the workspace FINGERPRINTS.md registry; start empty, never claim inherited examples as your portfolio.

Use [feel.md](references/feel.md) for pacing and one memorable peak. Keep short pages short; do not pad them to satisfy an act/device quota. Invent a meaningful signature interaction when the brief benefits from motion. For static or restrained briefs, prioritize composition and usability.

Read [devices.md](references/devices.md) for engine markup, and [worlds.md](references/worlds.md) for visual direction. Copy `engine/astra-designer.js` and `.css` into the site; use semantic HTML with `data-sc-*` attributes and theme `--sc-*` tokens. The neutral `sc` selectors are implementation details. Runtime API: `window.AstraDesigner`. Put bespoke behavior in the page, keep the engine reusable. [template.html](references/template.html) is a device reference with sample asset paths; replace every sample before shipping.

Use separate background, subject and foreground planes when dimensional depth serves the brand. Keep type legible, contact anchors consistent and the mobile composition deliberate. No fake claims, dead controls, unsolicited audio or essential information hidden behind animation.

## Media
Read [assets.md](references/assets.md) when imagery is needed. Prefer supplied assets; use the official Higgsfield CLI for missing generated stills and video. The bundled `media.mjs` handles discovery and submission. Users connect their own account interactively. Never embed credentials in websites. If the provider is unavailable, use existing assets or a static composition and state the limitation. For a specifically requested continuous camera journey, also read [worldflight.md](references/worldflight.md).

## Verify
Read [verify.md](references/verify.md). Serve the finished site, walk intermediate scroll positions, inspect desktop, phone and reduced-motion contact sheets, then exercise navigation, focus, forms and CTA destinations.

```bash
node <skill>/scripts/serve.mjs --root /absolute/path/to/site --port 4500
# Separate terminal, from the build project:
node <skill>/scripts/shoot.mjs --url http://localhost:4500 --out lab/desktop
node <skill>/scripts/shoot.mjs --url http://localhost:4500 --out lab/mobile --width 390 --height 844
node <skill>/scripts/shoot.mjs --url http://localhost:4500 --out lab/reduced --reduced-motion
```

Read the actual generated sheet images. A successful script is not a visual review. Test no-JavaScript content, missing-media fallbacks and links. Headless mobile emulation is not a physical phone test; report that limit. For continuous-flight sites, use `worldflight-assert.mjs` too. Fix material defects and repeat affected checks.

## Deploy and deliver
When publishing is requested, follow [deploy.md](references/deploy.md). Default to here.now for static sites; honor a specified host. Build server-based frameworks for their supported host instead of uploading unbuilt source. Publish only the intended public artifact directory. Never publish credentials, raw client materials, internal briefs or lab output. Verify the returned live URL and key assets before calling deployment complete.

Deliver the site or live URL, a concise verification result and any real limitations. Update the workspace fingerprint registry after completing a site. Do not claim a provider is connected, media is generated or a site is deployed without observing the corresponding result.
