# Zumwalt — motion graphics package

English-language cards and mechanism explainers for the video
"Zumwalt: why the ship of the future was left without shells" (20-minute script, voiceover in English).

Ready-to-edit MP4 files are in [`final/`](final/) (1920×1080, 30 fps, H.264, no audio).

## Cards (7)

| File | Script scene | What it shows |
| --- | --- | --- |
| `Card01-Title.mp4` | 01 | Title card over the original-configuration photo (two AGS turrets) |
| `Card02-CostPerRound.mp4` | 01, 07 | ≥ $800,000 projected cost per LRLAP round (2016 forecast, CRS) |
| `Card03-Range.mp4` | 03 | > 63 nmi ≈ 116 km, developer's claim from the 2013 tests (BAE Systems) |
| `Card04-Power.mp4` | 05 | ≈ 78 MW generating capacity on one shared network (GE) |
| `Card05-32to3.mp4` | 06 | 32 planned → 3 built (GAO), with the "no finished ships scrapped" caveat |
| `Card06-ProgramCost.mp4` | 08 | $10.6 B per ship, always together with "program cost estimate, not one hull's price" (GAO 2025) |
| `Card07-Timeline.mp4` | 09–11 | 2013 → FY2027, the planned first CPS flight shown as planned (dashed) |

## Mechanism animations (5)

Chosen by how much of the story depends on them:

| File | Script scene | Mechanism |
| --- | --- | --- |
| `Mech01-GuidedRound.mp4` | 03 | LRLAP flight: gun launch → rocket boost → GPS/INS-guided glide, compared with an ordinary shell |
| `Mech02-StealthShape.mp4` | 04 | Flashlight-and-mirror analogy, then radar rays on an upright vs. tumblehome cross-section. Reflections are computed geometrically, not drawn by hand |
| `Mech03-PowerNetwork.mp4` | 05 | Turbines → generators → shared network; fast-transit vs. slow/high-sensor-load modes; plugging in new equipment |
| `Mech04-SmallClassCost.mp4` | 06–07 | Development cost spread over 32 vs. 3 ships, then fixed production cost spread over fewer rounds |
| `Mech05-CPSLaunch.mp4` | 10–11 | Guns and their below-deck volume replaced by launch tubes; missile ≈ four-story building; cold-gas launch → ignition → boost → glide body |

Accuracy rules from the script are kept on screen: "not to scale" / "schematic" stamps, the $10.6 B caveat, the 2016
forecast wording, the ground-test vs. ship-launch distinction, and the planned FY2027 date. No invented percentages,
internal layouts or tube counts.

## Look

Warm paper and charcoal backgrounds, signal red-orange and amber accents (deliberately no blue), Barlow Condensed
headlines with IBM Plex Mono labels, film grain stepped at 12 fps, marker highlights, line draw-ons, and a slow camera
push. Motion follows common explainer practice: containers → nodes → connections → labels, ease-out entrances
with 30–90 ms staggers, and text held long enough to read.

## Editing / re-rendering

```bash
cd Zumwalt
npm i
npx remotion studio            # preview and tweak
npx remotion render <Id> final/<Id>.mp4
```

Composition ids match the file names. Text, timings and colours are in `src/cards/Cards.tsx`,
`src/mechanisms/*.tsx` and `src/theme.ts`.
