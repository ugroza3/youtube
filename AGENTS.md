# Agent notes

Video production repository: videos are built in code.

- `video/` — Remotion 4 project (main tool). Showcase of every library: `video/src/showcase/`.
- `hyperframes-demo/` — HyperFrames (HTML → video) example.
- Skills: `.agents/skills/` (mirrored in `.claude/skills/`). Before writing any scene read
  `video-libraries`, then `remotion-best-practices` or `hyperframes`.
- Voiceover is provided by the user as audio files; do not synthesize voice.
- Put audio, images and footage into `video/public/` and reference them with `staticFile()`.
- Render outputs (`out/`, `build/`) are not committed.
