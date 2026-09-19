# Brag plan — a cinematic tour of mika-jeske.de

## Planning rubric

1. **What is the project?** mika-jeske.de — Mika Jeske's personal portfolio site. Mika is
   a materials scientist (B.Sc.), focused on measurement, sensors, thin films and NDT.
2. **Who is it for?** Recruiters / labs (a working-student role alongside his Master), plus
   anyone visiting his personal brand. LinkedIn is the linked profile.
3. **What does it do / contain?** A single-page, prerendered React site with chapters: Hero,
   Intro, Seeking (role), Résumé (+ DGZfP award), Volunteering, Story (thin-film research),
   Collaborations (film), and the CheapSeats desktop app project. 5 languages (DE/EN/ES/FR/IT).
4. **What's the hook?** The name reveal — "Mika Jeske" mask-rises huge over off-white paper,
   the exact hero animation, establishing the Apple-flavored plum/sage brand in 2 seconds.
5. **What's the one thing to show?** The site itself — its design language and its chapters —
   with CheapSeats (the thing he built) as the biggest single beat, shown with real screenshots.
6. **Tone?** Cinematic. Trailer-scale motion, dramatic reveals, confident pacing.
7. **Format?** Landscape 16:9, 1920×1080.
8. **Duration?** 20 seconds.
9. **Audio?** Cinematic music bed, beat-synced to cuts. No voiceover. Subtle SFX on band
   wipes and the CheapSeats card tilt.

## Brand (verbatim from ci/tokens/)

- Paper `#F6F6F7`, paper-2 `#EFEFF1`, hairline `#E2E2E7`; ink `#15151A`, text `#3C3C45`,
  muted `#71717C`.
- Plum `#4E2454` / deep `#351839` / lilac-glow `#D88DE2`.
- Sage `#2C6849` / deep `#1E4A33` / mint-glow `#81DAAC`.
- Honey `#ECC77B` (award / warm glow).
- SF Pro Display (embedded OTF). Eyebrow: 12px / 600 / uppercase / .14em / muted.
  Display headings: bold, tracking −0.025em.

## Storyboard (beats, timings in seconds)

| # | Beat | In–Out | On-screen text (verbatim) | Motion | SFX |
|---|------|--------|---------------------------|--------|-----|
| 1 | Hero | 0.0–3.0 | eyebrow `MATERIALS SCIENCE · B.SC.`; `Mika` / `Jeske` | plum glow blob sweeps top-right; eyebrow tracks in; two name lines mask-rise w/ scale+blur; portrait rises blur→sharp at right | soft rise |
| 2 | Intro | 3.0–5.6 | eyebrow `HEY.` (mint); `My name is Mika — a materials scientist focused on measurement.` | plum band wipes up over paper; text fades/rises in white-on-plum | low band whoosh |
| 3a | Seeking | 5.6–7.7 | eyebrow `WHAT I AM LOOKING FOR`; `A working-student role alongside the Master`; rows `Role → Working student, from Nov 2026`, `Fields → Measurement · sensors · thin films · NDT` | cut to paper; heading rises; rows stagger in | tick |
| 3b | Résumé/Award | 7.7–9.3 | eyebrow `RÉSUMÉ`; award card `DGZfP Science Student Award 2025` | honey-glow squircle + card lift-in | tick |
| 3c | Volunteering | 9.3–10.6 | eyebrow `VOLUNTEERING` (mint); `Engagement that matters to me` | sage band wipes in; heading rises | band whoosh |
| 3d | Story/Research | 10.6–12.4 | eyebrow `MY PATH`; `How I ended up in the small scale`; axis label `Seebeck · µV/K` | back to paper; real Ag·100 nm Seebeck line draws L→R on a mini axis | soft draw |
| 4 | CheapSeats | 12.4–16.8 | eyebrow `PROJECT`; `CheapSeats`; `A desktop scoreboard for any NFL or MLB club`; chips `Tauri 2 · Rust` `React 19 · TS` `Vite 7`; scoreboard card `NEXT GAME · WEEK 25` `@ Miami Marlins` + ERA/K/WHIP/W-L tiles | real `overview-light.png` dollies in; dark scoreboard card tilts up in front (perspective); `phone_main_light.png` slides beside; chips stagger | card tilt thunk |
| 5 | Outro | 16.8–20.0 | wordmark `Mika Jeske`; `mika-jeske.de`; chips `DE · EN · ES · FR · IT`; `Let's build something measurable.` + LinkedIn | pull back to paper; plum + sage glows converge; wordmark settles; gentle fade | resolve chord |

Total: 20.0s.

## Music cue guidance

Cinematic bed. Anchor downbeats near the hard cuts at **3.0s** (band up), **5.6s**
(montage start), **12.4s** (CheapSeats), **16.8s** (outro). Swell into the name reveal
(~0.6s), keep montage driving, small hit on the CheapSeats card tilt, resolve on the
wordmark. Cues detected at composition time; readability and pacing stay primary.

## Assets (local, from repo, copied into composition/assets/)

- Portrait: `ci/assets/Bilder/Weitere/site_header.png`
- CheapSeats: `ci/assets/Bilder/CheapSeats/overview-light.png`, `phone_main_light.png`
- Fonts: `ci/assets/fonts/SF-Pro-Display-{Regular,Medium,Semibold,Bold}.otf`
- Seebeck Ag·100 nm data (x=°C, y=µV/K) from `sections-new.jsx` `SEEBECK_T`.
