const { asset, Reveal, Parallax, Pressable, SplitFeature, Eyebrow, Badge, GlowShape, Scribble, WaveBlend, TimelineEntry, AlignBlock, BlobCluster, useLang, prefersReduced } = window.MJ;

/* entrance delays, in ms */
const HERO_T = { name: 100, nameStep: 120, eyebrow: 500, portrait: 1000, chrome: 1400 };

/* Below this viewport height the template collapses the pinned trailer to a static,
   in-flow hero (@media (max-height: 620px) in index.template.html) — the case a
   reader hits zooming an ultrawide monitor to 200-500%. Keep the two numbers in
   sync: the scrub must not write transforms onto elements CSS has put back in flow. */
const SHORT_VIEWPORT_H = 620;

/* The four ways in. Same destinations + icons as the trailer facade; each label
   is split into per-letter spans so the `lang-wave` runs at any length/language.
   Two flank the film on the left, two on the right; on narrow/portrait they fold
   into a bottom cluster (see .trailer__rail in the template). */
const TRAILER_ICONS = {
  cv: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" />
    </svg>
  ),
  story: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="M16.2 16.2 20.5 20.5" /><rect x="9.2" y="9.2" width="3.6" height="3.6" rx="0.6" />
    </svg>
  ),
  cheapseats: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="12" rx="2" /><path d="M12 6v12" /><path d="M6 10.5h3M15 10.5h3" />
    </svg>
  ),
  volunteering: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" /><circle cx="17.2" cy="9.4" r="2.2" /><path d="M3.6 19a5.4 5.4 0 0 1 10.8 0" /><path d="M15.6 14.4a4.6 4.6 0 0 1 4.8 4.6" />
    </svg>
  ),
};

function TrailerLink({ href, label, icon, delay }) {
  return (
    <a className="tl" href={href} aria-label={label} style={{ transitionDelay: delay + "ms" }}>
      <span className="tl__ico" aria-hidden="true">{icon}</span>
      <span className="tl__label" aria-hidden="true">
        {label.split("").map((ch, i) => (
          <span key={i} className="tl__c" style={{ animationDelay: (i * 80) + "ms" }}>{ch === " " ? " " : ch}</span>
        ))}
      </span>
    </a>
  );
}

function Hero() {
  const [lang, t] = useLang();
  /* The entrance used to be a `mounted` state flip: everything rendered at opacity 0
     and only became visible once React had hydrated. That made the hero name — the
     LCP element — wait on the whole bundle (Lighthouse: 2134ms of element render
     delay inside a 4.1s LCP), and it cost a full re-render of the hero on hydration.
     It is now pure CSS (@keyframes hero-*, in index.template.html), so the prerendered
     text animates in from first paint and the markup is identical on both sides. */
  const words = ["Mika", "Jeske"];

  const wrapRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const nameRef = React.useRef(null);
  const faceRef = React.useRef(null);
  const ambientRef = React.useRef(null);
  const hintRef = React.useRef(null);
  const aiRef = React.useRef(null);
  const replayRef = React.useRef(null);

  /* The scrub. Written entirely via refs + direct .style (like useParallax), so
     the server and client first render match and hydration stays clean. Name and
     portrait travel up into the corners and OUT of frame; the film rises; the
     four ways in appear when it ends. Reversible on scroll-back. */
  React.useEffect(() => {
    const wrap = wrapRef.current, stage = stageRef.current, video = videoRef.current;
    const name = nameRef.current, face = faceRef.current, ambient = ambientRef.current;
    const hint = hintRef.current, ai = aiRef.current;
    if (!wrap || !stage || !video) return;

    const mm = window.matchMedia;
    const portrait = mm && mm("(max-aspect-ratio: 3/4)").matches;
    /* The film is rendered per theme as well as per language and aspect, so a
       light page never plays a dark film. In "auto" the attribute is absent,
       so the OS query is the only source of truth. */
    const schemeQ = mm && mm("(prefers-color-scheme: dark)");
    const isDark = () => {
      const t = window.I18N && window.I18N.getTheme ? window.I18N.getTheme() : "auto";
      return t === "dark" || (t !== "light" && !!(schemeQ && schemeQ.matches));
    };
    const pick = (kind) => video.dataset[kind + (portrait ? "9" : "16") + (isDark() ? "Dark" : "Light")];
    let src = pick("src");
    video.poster = pick("poster");

    const replay = replayRef.current;
    let finished = false;
    function onRefused() { finished = true; if (stage.classList.contains("is-playing")) stage.classList.add("is-revealed"); }
    function onEnded() { finished = true; if (stage.classList.contains("is-playing")) stage.classList.add("is-revealed"); }
    /* replay: hide the ways in, rewind and play the film again; it re-reveals
       them when it ends. */
    function onReplay() { stage.classList.remove("is-revealed"); try { video.currentTime = 0; } catch (e) {} video.playbackRate = 0.8125; const pr = video.play(); if (pr && typeof pr.catch === "function") pr.catch(onRefused); }
    video.addEventListener("ended", onEnded);

    /* The theme can change mid-play. Swap to the matching film and restore the
       position, so a toggle reads as a re-grade rather than a restart. Before
       the film is lazily fetched there is nothing to swap — just retarget. */
    function syncTheme() {
      const next = pick("src");
      video.poster = pick("poster");
      if (next === src) return;
      src = next;
      if (!video.src) return;
      const at = video.currentTime, wasPlaying = !video.paused && !video.ended;
      video.addEventListener("loadedmetadata", function onMeta() {
        video.removeEventListener("loadedmetadata", onMeta);
        /* Resume only once the seek has landed. Calling play() while the seek
           is still pending lets playback start at 0 and supersede it. The
           timeout covers the case where the seek is a no-op and fires nothing. */
        let resumed = false;
        function resume() {
          if (resumed) return;
          resumed = true;
          video.removeEventListener("seeked", resume);
          if (!wasPlaying) return;
          video.playbackRate = 0.8125;
          const pr = video.play();
          if (pr && typeof pr.catch === "function") pr.catch(onRefused);
        }
        video.addEventListener("seeked", resume);
        setTimeout(resume, 400);
        try { video.currentTime = at; } catch (e) { resume(); }
      });
      video.src = next;
    }
    /* themechange fires on an explicit toggle; the media query covers the OS
       flipping underneath "auto", which fires no event of its own. */
    window.addEventListener("themechange", syncTheme);
    if (schemeQ && schemeQ.addEventListener) schemeQ.addEventListener("change", syncTheme);
    function offTheme() {
      window.removeEventListener("themechange", syncTheme);
      if (schemeQ && schemeQ.removeEventListener) schemeQ.removeEventListener("change", syncTheme);
    }

    /* Reduced motion: no scrub, no autoplay. Show the resolved composition —
       poster + ways in + caption, name/portrait faded out (decided in CSS). */
    if (prefersReduced()) {
      stage.classList.add("is-playing", "is-revealed");
      return () => { video.removeEventListener("ended", onEnded); offTheme(); };
    }

    if (replay) replay.addEventListener("click", onReplay);

    const DOCK_END = 0.62, PLAY_AT = 0.9;
    const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

    function tryPlay() { if (!video.src) video.src = src; video.playbackRate = 0.8125; const pr = video.play(); if (pr && typeof pr.catch === "function") pr.catch(onRefused); }
    function setDocked(docked) {
      const was = stage.classList.contains("is-playing");
      if (docked === was) { if (docked && !finished && video.paused) tryPlay(); return; }
      stage.classList.toggle("is-playing", docked);
      stage.classList.toggle("is-revealed", docked && finished);
      if (docked) { if (!finished && video.paused) tryPlay(); }
      else if (!video.paused) video.pause();
    }

    /* Cache viewport size so apply() never forces a layout reflow on every
       scroll tick. Refreshed on resize (which already goes through rAF). */
    let cachedVw = window.innerWidth, cachedVh = window.innerHeight;

    /* latched so a scroll tick in static mode is a single comparison, not five
       redundant style writes */
    let wasShort = false;

    function apply(p) {
      if (cachedVh <= SHORT_VIEWPORT_H) {
        if (!wasShort) {
          wasShort = true;
          /* Static hero. Drop every inline value the scrub owns so the CSS in
             @media (max-height: 620px) is what actually decides the layout, and
             stop the film (it is display:none there anyway). */
          name.style.transform = ""; name.style.opacity = "";
          if (face) { face.style.transform = ""; face.style.opacity = ""; }
          if (ambient) ambient.style.opacity = "";
          if (ai) ai.style.opacity = "";
          if (hint) hint.style.opacity = "";
          setDocked(false);
        }
        return;
      }
      wasShort = false;

      const vw = cachedVw, vh = cachedVh;
      const raw = p < DOCK_END ? p / DOCK_END : 1; // 0 hero → 1 docked
      const u = 1 - raw;
      const k = ease(raw);                          // 0 hero → 1 exit
      const arc = Math.sin(Math.PI * raw);          // 0 at both ends, 1 mid
      const fade = clamp((u - 0.1) / 0.3, 0, 1);    // name/portrait opacity

      /* name → up and out toward the top-left, with a leftward arc.
         The trailing translateY(-50%) re-applies the centring that React declares
         inline (top:50% + translateY(-50%)); writing a bare translate() here used to
         clobber it, dropping the whole name half a viewport down. Harmless on a tall
         screen, but on a short one it pushed the name straight out of the stage. */
      name.style.transform = "translate(" + (-0.12 * vw * k - 0.05 * vw * arc) + "px," + (-0.98 * vh * k) + "px) translateY(-50%) scale(" + (1 - 0.45 * k) + ")";
      name.style.opacity = String(fade);
      // portrait → up and out toward the top-right
      if (face) {
        face.style.transform = "translate(" + (0.12 * vw * k + 0.05 * vw * arc) + "px," + (-1.02 * vh * k) + "px) scale(" + (1 - 0.5 * k) + ")";
        face.style.opacity = String(fade);
      }
      if (ambient) ambient.style.opacity = String(clamp((u - 0.1) / 0.6, 0, 1));
      // "AI-edited image" disclaimer fades out early — the fade-to-white refinement
      if (ai) ai.style.opacity = String(clamp((u - 0.85) / 0.15, 0, 1));
      if (hint) hint.style.opacity = u > 0.92 ? String((u - 0.92) / 0.08) : "0";

      setDocked(raw >= PLAY_AT);
    }

    function progress() {
      const range = wrap.offsetHeight - cachedVh;
      return range > 0 ? clamp((window.pageYOffset - wrap.offsetTop) / range, 0, 1) : 0;
    }
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { apply(progress()); ticking = false; });
    }
    function onResize() {
      cachedVw = window.innerWidth;
      cachedVh = window.innerHeight;
      onScroll();
    }

    apply(progress());
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      video.removeEventListener("ended", onEnded);
      if (replay) replay.removeEventListener("click", onReplay);
      offTheme();
    };
  }, []);

  const links = [
    { side: "l", key: "cv", href: "#lebenslauf", delay: 0 },
    { side: "l", key: "story", href: "#story", delay: 70 },
    { side: "r", key: "cheapseats", href: asset("projects/cheapseats/"), delay: 140 },
    { side: "r", key: "volunteering", href: "#ehrenamt", delay: 210 },
  ];
  const side = (s) => links.filter((l) => l.side === s).map((l) => (
    <TrailerLink key={l.key} href={l.href} label={t("trailer." + l.key)} icon={TRAILER_ICONS[l.key]} delay={l.delay} />
  ));

  return (
    <section ref={wrapRef} id="top" data-section className="herostage-wrap">
      <div ref={stageRef} className="hero herostage">
        <video ref={videoRef} className="herostage__video" muted playsInline preload="auto" disablePictureInPicture aria-hidden="true"
          data-src16-light={asset("ci/assets/video/brag_" + lang + "-16x9_light.mp4")} data-src16-dark={asset("ci/assets/video/brag_" + lang + "-16x9_dark.mp4")}
          data-src9-light={asset("ci/assets/video/brag_" + lang + "-9x16_light.mp4")} data-src9-dark={asset("ci/assets/video/brag_" + lang + "-9x16_dark.mp4")}
          data-poster16-light={asset("ci/assets/video/brag_" + lang + "-16x9_light.webp")} data-poster16-dark={asset("ci/assets/video/brag_" + lang + "-16x9_dark.webp")}
          data-poster9-light={asset("ci/assets/video/brag_" + lang + "-9x16_light.webp")} data-poster9-dark={asset("ci/assets/video/brag_" + lang + "-9x16_dark.webp")} />
        <div className="herostage__scrim" aria-hidden="true" />

        <div ref={ambientRef} className="herostage__ambient" aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <GlowShape shape="blob" glow="duo" size={420} seed={1} parallax="--depth-3" className="hero-glow-blob hero-fade-in" style={{ position: "absolute", top: "-8%", right: "-6%", animationDelay: "200ms", pointerEvents: "none" }} />
          <GlowShape shape="arch" glow="plum" size={240} seed={2} parallax="--depth-2" className="hero-glow-arch hero-fade-in" style={{ position: "absolute", bottom: "8%", left: "-4%", animationDelay: "340ms", pointerEvents: "none" }} />
        </div>

        {/* ≥1440px only, see .hero-photo */}
        {/* Not aria-hidden any more. The wrapper used to carry aria-hidden="true",
            which suppresses the ENTIRE subtree — so the portrait's alt text and,
            more importantly, the Art. 50 AI-disclosure label inside it were both
            invisible to screen readers. aria-hidden on an ancestor cannot be
            undone by a descendant, so the attribute had to come off here. */}
        <div ref={faceRef} className="hero-photo" style={{ position: "absolute", zIndex: 3, right: "clamp(80px, 15vw, 340px)", bottom: 0, height: "clamp(520px, 66vh, 820px)", pointerEvents: "none" }}>
          <div className="hero-photo__in" style={{ position: "relative", height: "100%", animationDelay: HERO_T.portrait + "ms" }}>
            <Scribble seed={9} glow="duo" size={340} style={{ top: "42%", left: "50%", width: "84%", height: "84%", zIndex: 0 }} />
            {/* .hero-photo is display:none below 1440x820, but a plain <img> in a
                display:none subtree is still fetched — 159 KB downloaded on every phone
                and every zoomed-in viewport that never draws it (loading="lazy" does not
                help: with no layout box Chrome gives up observing and fetches anyway).
                <picture> decides before the fetch: the real portrait only when the same
                query that reveals it matches, otherwise a 43-byte transparent pixel.
                Keep the <source> query in sync with .hero-photo and with the
                <link rel="preload"> in index.template.html. */}
            <picture>
              <source media="(min-width: 1440px) and (min-height: 820px)" srcSet={asset("ci/assets/Bilder/Weitere/site_header.webp")} />
              <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt={t("hero.portraitAlt")} className="drift-soft" width={1844} height={2304} fetchpriority="high"
                style={{ position: "relative", zIndex: 1, display: "block", height: "100%", width: "auto" }} />
            </picture>
            <span ref={aiRef} className="hero-ailabel" style={{ position: "absolute", zIndex: 2, right: 10, bottom: 10, fontFamily: "var(--font-text)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-body)",
              /* This is the Art. 50 AI-disclosure label and it sits on top of
                 the portrait, so a ratio against --paper was never the real
                 measurement. It used to be #808080 (3.66:1 even against bare
                 paper) held together by a background-coloured text-shadow,
                 which fails wherever the photo underneath is busy. It now
                 carries its own surface, in the same glass-chrome language as
                 the globe, contact chip and replay button — so it is legible
                 over any pixel of the image and themes with the page. */
              background: "var(--material-chrome)",
              WebkitBackdropFilter: "var(--blur-chrome)", backdropFilter: "var(--blur-chrome)",
              borderRadius: "var(--radius-xs)",
              padding: "3px 9px" }}>
              {t("hero.aiImageLabel")}
            </span>
          </div>
        </div>

        <div ref={nameRef} className="hero-namewrap" style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", zIndex: 4, paddingInline: "var(--gutter)" }}>
          <div className="hero-namewrap__col">
            <div style={{ overflow: "hidden", marginBottom: 8 }}>
              <span className="hero-line hero-line--label" style={{ display: "inline-block", fontFamily: "var(--font-text)", fontSize: "var(--fs-label)", fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--label)", animationDelay: HERO_T.eyebrow + "ms" }}>
                {t("hero.eyebrow")}
              </span>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 8 }}>
              <span className="hero-line hero-line--label" style={{ display: "inline-block", fontFamily: "var(--font-text)", fontSize: "var(--fs-label)", fontWeight: 600, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: "var(--label)", animationDelay: (HERO_T.eyebrow + 80) + "ms" }}>
                {t("hero.eyebrow2")}
              </span>
            </div>
            <h1 className="hero-name" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--fs-display-hero)", lineHeight: 0.98, letterSpacing: "var(--ls-display)", color: "var(--ink)", margin: 0 }}>
              {words.map((w, i) => (
                <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.14em", marginBottom: "-0.14em" }}>
                  <span className="hero-line hero-line--word" style={{ display: "inline-block", transformOrigin: "0% 100%", animationDelay: (HERO_T.name + i * HERO_T.nameStep) + "ms" }}>{w}</span>
                </span>
              ))}
            </h1>
          </div>
        </div>

        <nav className="trailer__rail" aria-label={t("trailer.enterLabel")}>
          <div className="trailer__side" data-side="l">{side("l")}</div>
          <div className="trailer__side" data-side="r">{side("r")}</div>
        </nav>

        <button ref={replayRef} type="button" className="herostage__replay" aria-label={t("trailer.replay")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v5h-5" />
          </svg>
        </button>

        <p className="herostage__caption">{t("trailer.caption")}</p>

        <div ref={hintRef} className="hero-hint" style={{ position: "absolute", zIndex: 4, bottom: 30, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, animationDelay: HERO_T.chrome + "ms" }}>
          <span style={{ fontFamily: "var(--font-text)", fontSize: 13, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink)", textShadow: "0 0 10px var(--bg), 0 0 18px var(--bg)" }}>{t("hero.scrollHint")}</span>
          <span className="scroll-dot" style={{ width: 2, height: 42, borderRadius: 2, background: "var(--hairline-strong)", position: "relative", overflow: "hidden", boxShadow: "0 0 12px 4px var(--bg)" }}>
            <span style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 16, background: "var(--ink)", animation: "scrollHint 1.8s var(--ease-in-out) infinite" }} />
          </span>
        </div>
      </div>
    </section>
  );
}

/* px the plum band overhangs the section below, so it draws its own bottom seam */
const LAP = 48;

function Intro() {
  const [, t] = useLang();
  const ip = t("intro.photos") || [];
  return (
    <section id="intro" data-section className="on-plum" style={{ position: "relative", zIndex: 1, overflow: "hidden", padding: `12mm 0 calc(5mm + ${LAP}px)`, marginBottom: -LAP }}>
      {/* plum, not paper: the section above is now the dark trailer film, so the
          crest waves plum up into the film instead of flashing a white band */}
      <WaveBlend edge="top" color="var(--plum)" seed={5} shadow="rgb(var(--accent-1-deep-rgb) / 0.55)" z={2} />
      <WaveBlend edge="bottom" lap="under" color="var(--paper)" seed={63} shadow="rgb(var(--accent-1-rgb) / 0.45)" z={2} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <SplitFeature bleed
          bleedTop="12mm" bleedBottom={`calc(5mm + ${LAP}px)`}
          src={asset("ci/assets/Bilder/Weitere/i_zfp.webp")}
          alt={ip[0]} caption={ip[0]} focus="25% 40%">
          <Reveal><Eyebrow color="var(--sage-glow)">{t("intro.eyebrow")}</Eyebrow></Reveal>
          <Reveal delay={80}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h2)", lineHeight: 1.22, letterSpacing: "var(--ls-heading)", color: "var(--on-dark-strong)", margin: "20px 0 0", maxWidth: "18ch" }}>
              {t("intro.headline")}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "24px 0 0", maxWidth: "46ch" }}>
              {t("intro.p1")}
            </p>
          </Reveal>
          <Reveal delay={220}>
            <p style={{ fontSize: "var(--fs-lead)", lineHeight: "var(--lh-relaxed)", color: "var(--on-dark-body)", margin: "16px 0 0", maxWidth: "46ch" }}>
              {t("intro.p2")}
            </p>
          </Reveal>
          <Reveal delay={300}>
            {/* 46ch mirrors the paragraphs, so the signature centres on the text
                measure and not on the wider copy column; invert() paints the
                black source white for the plum band */}
            <div style={{ maxWidth: "46ch", marginTop: "clamp(24px,3vw,40px)" }}>
              <img src={asset("ci/assets/Bilder/Weitere/signatur-mika-jeske.webp")}
                alt="Mika Andreas Jeske" loading="lazy" width={500} height={180}
                style={{ display: "block", marginInline: "auto", width: "min(300px, 66%)", height: "auto", filter: "invert(1)", opacity: 0.9 }} />
            </div>
          </Reveal>
        </SplitFeature>
      </div>
    </section>
  );
}

function Seeking() {
  const [, t] = useLang();
  const s = t("seeking");
  return (
    <section id="werkstudent" data-section style={{ position: "relative", overflow: "hidden", padding: "var(--section-y-sm) 0 var(--section-y)" }}>
      {/* top seam is drawn by Intro, which overhangs this section by LAP px */}
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="seeking">
          <div>
            <Reveal><Eyebrow>{s.eyebrow}</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--fs-h2)", lineHeight: 1.15, letterSpacing: "var(--ls-heading)", color: "var(--heading)", margin: "16px 0 0", maxWidth: "14ch" }}>
                {s.heading}
              </h2>
            </Reveal>
          </div>
          <div>
            <Reveal>
              <dl className="seeking__list">
                {s.rows.map((r, i) => (
                  <React.Fragment key={i}>
                    <dt className="seeking__k">{r.k}</dt>
                    <dd className="seeking__v">{r.v}</dd>
                  </React.Fragment>
                ))}
              </dl>
            </Reveal>
            <Reveal delay={80}>
              <Pressable as="a" className="cta-ink" href="https://www.linkedin.com/in/mika-jeske-835092313/" target="_blank" rel="noopener" lift={-3}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: "clamp(24px,3vw,36px)", padding: "12px 22px", background: "var(--ink)", color: "var(--paper)", borderRadius: "var(--radius-md)", fontFamily: "var(--font-text)", fontSize: "var(--fs-body)", fontWeight: 600, textDecoration: "none" }}>
                {s.cta} <span aria-hidden className="cta-arrow">&rarr;</span>
              </Pressable>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

window.SECTIONS_A = { Hero, Intro, Seeking };
