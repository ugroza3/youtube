---
name: video-libraries
description: How this repository drives anime.js, react-spring, PixiJS, p5.js, Paper.js, tsParticles, three.js and gl-transitions inside Remotion and HyperFrames so every frame renders deterministically. Read before adding any of these libraries to a video scene, or when a render flickers, freezes, crashes with "Target closed" or shows end states too early.
---

# Video libraries in Remotion and HyperFrames

Both frameworks render frames out of order in parallel browser tabs. A frame must be a pure
function of its time. Every library below has its own clock (`requestAnimationFrame`, tickers,
`Math.random`), so it is wrapped in an adapter that takes the clock away from it.

Remotion project: `video/` (adapters in `video/src/adapters/`, working examples in
`video/src/showcase/`). HyperFrames project: `hyperframes-demo/`. Official skills:
`remotion-*`, `hyperframes*`, `gl-transitions` in `.agents/skills/`.

## Which tool for what

| Need | Tool | Remotion adapter |
| --- | --- | --- |
| Timelines, staggers, counters, SVG/text motion | anime.js v4 | `useAnimeTimeline` (`adapters/anime.ts`) |
| Physical springs (overshoot, wobble) | react-spring | `springAt(ms, {from, to, config})` (`adapters/reactSpring.ts`) |
| Thousands of sprites, complex 2D on WebGL | PixiJS v8 | `<PixiCanvas create={() => ({setup, update})}>` |
| Generative backgrounds, noise, patterns | p5.js v2 | `<P5Canvas draw={(p, t) => …}>` |
| Vector diagrams, contours, path drawing | Paper.js | `<PaperCanvas draw={(scope, t) => …}>` |
| Particles with links | tsParticles | `<ParticlesCanvas options seed>` |
| 3D: models, light, camera | three.js + R3F | `<ThreeCanvas>` from `@remotion/three` |
| Scene-to-scene shader transitions | gl-transitions | `glTransition({name})` from `@gl-transitions/remotion` in `<TransitionSeries>` |

## Rules learned the hard way

- **anime.js**: build one `createTimeline({autoplay:false})` and `seek(ms)`. Put start times in
  timeline positions, not `delay` (HyperFrames' seek ignores per-animation `delay`). Before a
  child's start time anime leaves the element untouched, so pin start states with
  `tl.set(targets, {...}, 0)`, or the end state shows on frame 0. Use `stagger()` for per-item delays.
  In HyperFrames push the timeline to `window.__hfAnime`.
- **react-spring**: `Globals.assign({frameLoop:"demand"})`, then a fresh `SpringValue` per call,
  `start(to, {config})` and `advance(dt)` up to the frame time. Do not use `useSpring` hooks: they
  run on rAF and are not seekable.
- **PixiJS**: `autoStart:false`, `app.ticker.stop()`, `preserveDrawingBuffer:true`; update the
  stage from `t`, then `app.render()`. Init is async: hold the frame with `delayRender`. Destroy
  the app on unmount to free the WebGL context.
- **p5.js**: instance mode, `noLoop()`, `pixelDensity(1)`; call `redraw()` per frame; call
  `noiseSeed`/`randomSeed` at the top of `draw` so each frame is reproducible.
- **Paper.js**: own `PaperScope` per canvas, `project.clear()` and rebuild each frame, then
  `view.update()`. No `onFrame`. Progressive stroke: `dashArray=[L,L]`, `dashOffset=L*(1-p)`.
  Import `paper` as a value; type-only imports of its namespace fail `tsc`.
- **tsParticles**: `setRandom(mulberry32(seed))` before `load`, `autoPlay:false`,
  `fullScreen:{enable:false}`; step with `container.canvas.render.drawParticles({value, factor})`
  (`value=1000/fps`, `factor=60*value/1000`). Seeking backwards re-creates the container.
- **three.js**: never `useFrame`; derive rotation/progress from `useCurrentFrame()`. Arcs between
  distant cities must follow the great circle (slerp) lifted above the surface; a bezier through
  the midpoint dips inside the globe.
- **gl-transitions**: scenes are captured with HTML-in-canvas. Works in render, the Studio
  preview needs Chrome 149+ with `chrome://flags/#canvas-draw-element`. Always pick names from
  `node_modules/gl-transitions` (PascalCase, 208 in v3).
- **Randomness**: `adapters/random.ts` (`mulberry32`) everywhere, never `Math.random`.

## Rendering in this sandbox (no GPU)

- `remotion.config.ts` sets `swangle` (SwiftShader). WebGL scenes inside a `TransitionSeries`
  with gl-transitions cost ~1–3 s per frame; a single long render may lose a tab
  ("Target closed"). Render long films in chunks and join without re-encoding:
  `npx remotion bundle --out-dir build`, then
  `npx remotion render build <Comp> out/c1.mp4 --frames=0-169 --concurrency=2`, … and
  `ffmpeg -f concat -safe 0 -i list.txt -c copy out/film.mp4`.
- Check single scenes with `npx remotion still build <SceneId> out/x.png --frame=N` and look at
  the image before rendering the film.
- HyperFrames: `npx hyperframes check --json`, then `npx hyperframes render --quality draft|looks -o out/x.mp4`.
- Do not run two heavy renders at the same time.
