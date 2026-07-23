import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Target,
  Layers,
  Clock,
  BarChart3,
  MapPin,
  Lock,
  Mail,
  Phone,
  Menu,
  X,
  Camera,
  LineChart,
  Handshake,
  Sparkles,
  Send,
  Zap,
  Cookie,
  ArrowLeft,
} from "lucide-react";


/* ============================== DATA ============================== */

/**
 * Kam se posílají odpovědi z kontaktního formuláře.
 *
 * Web je čistě statický (žádný vlastní server), takže formulář posílá data
 * na Formspree — bezplatnou službu, která submit přijme a přepošle vám ho
 * e-mailem. Založení zabere ~2 minuty:
 *   1. Vytvořte si účet na https://formspree.io (stačí e-mail, zdarma).
 *   2. Založte nový formulář, Formspree vám dá endpoint ve tvaru
 *      https://formspree.io/f/xxxxxxxx
 *   3. Vložte tenhle endpoint sem místo placeholderu níže.
 * Bez vyplnění endpointu formulář zobrazí chybovou hlášku a poptávka se
 * nikam neodešle — nic se ale "nerozbije".
 */
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";

const NAV_LINKS = [
  { href: "#reseni", label: "Řešení" },
  { href: "#proc-my", label: "Proč Progma" },
  { href: "#cenik", label: "Ceník" },
  { href: "#tym", label: "Tým" },
  { href: "#kontakt", label: "Kontakt" },
];

const CHAOS_ITEMS = [
  "Post na Facebook, když je čas",
  "Známý, co umí trochu grafiku",
  "Web z roku 2016",
  "Reklama bez cíle a bez čísel",
  "Poptávky podle štěstí",
  "Nikdo neví, co vlastně funguje",
];

const SYSTEM_ITEMS = [
  "Strategie postavená na datech vašeho oboru a regionu",
  "Kampaně cílené na lidi, kteří skutečně platí",
  "Obsah a video v kvalitě, která prodává",
  "Přehledný report — víte, kam jde každá koruna",
  "Predikovatelný přísun poptávek, měsíc co měsíc",
];

const PILLARS = [
  {
    icon: Target,
    title: "Marketing jako byznys, ne koníček",
    copy: "Neděláme „nějakou“ reklamu. Stavíme systém napojený přímo na vaše tržby — každá koruna v kampani má jasný úkol: přivést zákazníka, který zaplatí.",
    span: "md:col-span-3",
  },
  {
    icon: Layers,
    title: "Kompletní tým pod jednou střechou",
    copy: "Strategie, obchodní komunikace i video produkce v jednom balíčku. Jeden tým, jedna odpovědnost.",
    span: "md:col-span-3",
  },
  {
    icon: Clock,
    title: "Váš čas patří řemeslu",
    copy: "Přestanete být marketingovým manažerem vlastní firmy. Marketing přebíráme kompletně — vy se vracíte k práci, kterou umíte nejlépe.",
    span: "md:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Reporting na úrovni investora",
    copy: "Každý měsíc jasný přehled: co jsme utratili, co to přineslo a jaká je hodnota.",
    span: "md:col-span-2",
  },
  {
    icon: Zap,
    title: "Rychlost, na kterou nejste zvyklí",
    copy: "Kampaně spouštíme do 14 dnů.",
    span: "md:col-span-2",
  },
];

const PRICING_TIERS = [
  {
    name: "Základ",
    price: "4 099",
    tagline: "Pevné základy digitální přítomnosti",
    features: [
      "Nastavení a optimalizace Google profilu firmy",
      "Profesionální web / vizitka firmy",
      "Základní správa sociálních sítí (2 výstupy týdně)",
      "Měsíční přehled výkonu",
    ],
    cta: "Chci pevný základ",
    highlighted: false,
  },
  {
    name: "Výkon",
    price: "6 499",
    tagline: "Kompletní správa a video produkce",
    features: [
      "Vše ze Základu",
      "Kompletní správa PPC a sociálních kampaní",
      "Měsíční video produkce na místě (reels, ukázky práce)",
      "Cílení na poptávky, ne na lajky",
      "Osobní account manager",
      "Detailní report + doporučení dalšího kroku",
    ],
    cta: "Chci systematický růst",
    highlighted: true,
    badge: "Nejoblíbenější",
  },
  {
    name: "Dominance",
    price: "Individuální",
    priceOnRequest: true,
    tagline: "Agresivní růst a tržní dominance",
    features: [
      "Vše z Výkonu",
      "Týdenní video produkce v prémiové kvalitě",
      "Vícekanálová strategie (Google, Meta, YouTube, LinkedIn)",
      "Prioritní přidělení kreativního i obchodního týmu",
      "Exkluzivita — jediná firma z oboru v regionu",
      "Čtvrtletní strategické review s vedením Progma",
    ],
    cta: "Chci ovládnout trh",
    highlighted: false,
  },
];

const TEAM = [
  {
    name: "Erik Eis",
    role: "Strategie & Výkon",
    icon: LineChart,
    bio: "Za každou úspěšnou kampaní stojí přesná strategie. Erik navrhuje systémy, které z reklamního rozpočtu dělají předvídatelný zdroj poptávek — měřeno, testováno, doladěno k dokonalosti.",
    bioLong:
      "Erik stál u zrodu Progma s jasnou představou: marketing pro řemeslné a lokální firmy se většinou dělá špatně — nahodile, bez čísel, bez odpovědnosti. Roky sledoval, jak majitelé firem platí za reklamy, které nikam nevedou, a rozhodl se to změnit.\n\nDnes navrhuje strategie, které mají jeden jediný cíl: aby se každá investovaná koruna vrátila jako nová poptávka. Nemá rád prázdné marketingové fráze — když vám něco vysvětluje, uslyšíte čísla a grafy. Na schůzkách je to on, kdo dokáže za pět minut ukázat, kde firma zbytečně ztrácí peníze.",
    initials: "EK",
    photo: "/team/erik.jpg",
  },
  {
    name: "Adam Kryštof",
    role: "Obchod & Klientský růst",
    icon: Handshake,
    bio: "Adam je spojka mezi vaší firmou a výsledky. Stará se, aby každý klient přesně věděl, kam kampaně směřují, a aby se z poptávky stala reálná zakázka — ne jen číslo v tabulce.",
    bioLong:
      "Adam je první zastupující firmy při oslovení potencionálního zákazníka a ten, kdo s ním komunikuje a zodpovídá za rychlé vyřešení a odbavení požadavku.  Adam se zabýval budováním vztahů s obchodními partnery už před vznikem Progmy a stál u zrození také několika spoluprací, mimo jiné i s úspěšnými podnikateli a majiteli firem. Jeho styl komunikace a kvality jsou jedna z věcí, proč právě on je ten, kdo klienty oslovuje.  Lidé nekupují pouze službu, ale i důvěru. Právě proto ke každému klientovi přistupuje jako k dlouhodobému partnerství. Adam je ten, kdo na schůzce vysvětlí kalkulaci tak, aby dávala smysl i těm bez marketingového vzdělání.",
    initials: "AD",
    photo: "/team/adam.jpg",
  },
  {
    name: "Jan Makovický",
    role: "Kreativa & Video produkce",
    icon: Camera,
    bio: "Kamera, střih, příběh. Mako proměňuje běžný pracovní den vaší firmy v obsah, který lidi zastaví u scrollování — a přesvědčí je, že vy jste ta správná volba.",
    bioLong:
      "Honza natočil stovky hodin záběrů ze sportovních událostí, cestování, servisů a provozoven po celé republice — a ví, že nejlepší reklama nevypadá jako reklama. Jeho přístup je jednoduchý: ukázat řemeslo takové, jaké skutečně je, bez zbytečné okázalosti.\n\nZa kamerou i u střihu hledá autentický moment — tu vteřinu, kdy se z běžného pracovního dne stane obsah, který lidi zastaví u scrollování. Technika je pro něj prostředek, ne cíl. Na natáčení u klienta se snaží být co nejméně vidět, aby zůstal zachycený skutečný provoz firmy, ne nastudovaná scénka.",
    initials: "MK",
    photo: "/team/mako.jpg",
  },
];

/* ============================== UTILITIES ============================== */

// Správa souhlasu s cookies. Volba se ukládá do localStorage prohlížeče
// (běžný prohlížeč, ne sandboxované prostředí — tady je to v pořádku).
//
// Až budete přidávat Google Analytics nebo Meta Pixel, načtěte jejich skript
// teprve po ověření souhlasu, např.:
//   if (hasConsent("analytics")) { /* načíst Google Analytics */ }
//   if (hasConsent("marketing")) { /* načíst Meta Pixel */ }
// Nejjednodušší místo pro to je uvnitř useEffectu v komponentě CookieConsent
// níže, hned po uložení souhlasu, a znovu při každém načtení stránky, pokud
// souhlas už existuje.
const COOKIE_CONSENT_KEY = "progma-cookie-consent";

function getStoredConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeConsent(consent) {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ ...consent, timestamp: new Date().toISOString() }));
  } catch {
    // soukromé prohlížení apod. — appka funguje dál, jen si to nezapamatuje
  }
}

// Pro budoucí použití při napojování Google Analytics / Meta Pixel.
function hasConsent(category) {
  const consent = getStoredConsent();
  if (!consent) return false;
  if (category === "necessary") return true;
  return Boolean(consent[category]);
}

function GlowOrb({ className = "", color = "rgba(186,58,237,0.3)" }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ background: color }}
    />
  );
}

function GridTexture({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(rgba(219,139,250,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(219,139,250,0.08) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
      }}
    />
  );
}

/**
 * Ambient showreel background for the hero.
 *
 * - Always shows a static poster first (fast paint, works everywhere).
 * - Plays on both desktop and mobile, skipped only when the visitor has
 *   asked for reduced motion. Playback is driven by an explicit .play()
 *   call (with retries on canplay/loadeddata/visibilitychange) rather than
 *   relying on the autoPlay attribute alone, since mobile browsers silently
 *   drop that attribute more often than you'd expect.
 *
 * Drop your files in /public as:
 *   showreel.webm        (preferred, smaller)
 *   showreel.mp4          (fallback for browsers without webm support)
 *   showreel-poster.jpg   (first-frame still, shown before/without video)
 */
function HeroVideoBackground() {
  const [showVideo, setShowVideo] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Reduced-motion is a genuine accessibility signal from the visitor's OS —
    // worth respecting even though it means no video for them. Everything
    // else (data-saver, connection speed) was removed on purpose: it made
    // the video skip itself on some phones for no visible reason.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShowVideo(!reducedMotion);
  }, []);

  useEffect(() => {
    if (!showVideo || !videoRef.current) return;
    const video = videoRef.current;

    // The autoPlay attribute alone is unreliable on mobile — browsers
    // sometimes silently skip it (low power mode, a slow first frame, the
    // tab having been backgrounded, etc.) without firing any error we could
    // catch. Calling .play() ourselves and retrying on the events below
    // catches the vast majority of those cases instead of leaving the
    // visitor stuck on the static poster.
    const tryPlay = () => { video.play().catch(() => {}); };
    tryPlay();
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);
    return () => {
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [showVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-950">
      {/* Static first frame — always present, keeps the hero fast and works with zero JS.
          Falls back to a plain brand gradient if the file hasn't been added yet. */}
      {!posterError ? (
        <img
          src="/showreel-poster.jpg"
          alt=""
          onError={() => setPosterError(true)}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-zinc-950 to-zinc-950" />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-top"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/showreel-poster.jpg"
          onError={() => setShowVideo(false)}
        >
          <source src="/showreel.webm" type="video/webm" />
          <source src="/showreel.mp4" type="video/mp4" />
        </video>
      )}

      {/* Scrim: violet-tinted so the video reads on-brand, still keeps the headline legible on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-950/95 via-violet-950/75 to-violet-950/45" />
      {/* Fade into the page background at the bottom edge of the hero */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-zinc-950" />
    </div>
  );
}

function Counter({ to, suffix = "", decimals = 0, duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf;
    let start;
    const step = (ts) => {
      if (start === undefined) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * to);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {decimals > 0
        ? value.toLocaleString("cs-CZ", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : Math.floor(value)}
      {suffix}
    </span>
  );
}

function Eyebrow({ children, tone = "violet" }) {
  const dotColor = tone === "violet" ? "#db8bfa" : "#fca5a5";
  const textClass = tone === "violet" ? "text-violet-300" : "text-rose-300/80";
  return (
    <div className="inline-flex items-center gap-2 mb-4">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
      <span className={`font-jb text-xs sm:text-sm font-semibold tracking-widest uppercase ${textClass}`}>
        {children}
      </span>
    </div>
  );
}

function SectionHeading({ eyebrow, tone, title, sub, align = "left" }) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-16`}>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-5">
        {title}
      </h2>
      {sub && <p className="text-zinc-400 text-lg leading-relaxed">{sub}</p>}
    </div>
  );
}

/* ============================== NAVBAR ============================== */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-zinc-950/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center">
          <img src="/logo.png" alt="Progma" className="h-8 sm:h-9 w-auto" />
        </a>

        <div className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-zinc-300 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-violet-900/40"
          >
            Nezávazná konzultace
          </a>
        </div>

        <button className="lg:hidden text-zinc-200" onClick={() => setOpen(!open)} aria-label="Otevřít menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden bg-zinc-950/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-base text-zinc-200">
                  {l.label}
                </a>
              ))}
              <a
                href="#kontakt"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Nezávazná konzultace
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ============================== HERO ============================== */

function Hero() {
  const stats = [
    { icon: Zap, value: 14, suffix: "", label: "dní do spuštění kampaně" },
    { icon: MapPin, value: 1, suffix: "", label: "firma na obor a region" },
    { icon: Clock, value: 100, suffix: " %", label: "vašeho času zpět do podnikání" },
  ];

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-48 sm:pb-32 px-6 sm:px-8 lg:px-12">
      <HeroVideoBackground />
      <GlowOrb className="w-96 h-96 top-20 -right-40" color="rgba(202,92,246,0.18)" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-7"
        >
          <Eyebrow>Prémiový marketing pro zavedené firmy</Eyebrow>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight mb-7">
            Marketing, který pracuje,
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-violet-400 to-violet-200 bg-clip-text text-transparent">
              i když vy zrovna ne.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-xl mb-10">
            Progma přebírá kompletní marketing vaší firmy — strategii, kampaně i produkci — a mění náhodné
            poptávky v systém, který funguje každý měsíc. Vy se vracíte k řemeslu. My se staráme o zbytek.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <a
              href="#kontakt"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-7 py-4 text-base font-semibold text-white transition-all shadow-xl shadow-violet-900/50"
            >
              Chci nezávaznou analýzu
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#cenik"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 px-7 py-4 text-base font-semibold text-white transition-all"
            >
              Prohlédnout balíčky
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg">
            {stats.map((item, i) => (
              <div key={i}>
                <item.icon className="w-4 h-4 text-violet-400 mb-2" />
                <div className="font-jb text-xl sm:text-2xl font-semibold text-white">
                  <Counter to={item.value} suffix={item.suffix} />
                </div>
                <div className="text-xs text-zinc-500 leading-snug mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== PROBLEM VS SOLUTION ============================== */

function ProblemSolution() {
  const rotations = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];
  const positions = [
    "top-0 left-0",
    "top-2 right-4",
    "top-16 left-12",
    "top-24 right-0",
    "top-32 left-2",
    "top-40 right-16",
  ];

  return (
    <section id="reseni" className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Realita vs. systém"
          title="Marketing na koleni firmu neroztočí."
          sub="Většina majitelů řeší marketing, až když dojdou zakázky. My ho měníme v předvídatelný zdroj růstu, na který se dá spolehnout každý měsíc."
        />

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 flex flex-col"
          >
            <span className="font-jb text-xs uppercase tracking-widest text-rose-300/70">Bez systému</span>
            <h3 className="font-display text-2xl font-semibold text-white mt-3 mb-10">
              Jak marketing řeší většina firem
            </h3>

            <div className="relative h-56">
              {CHAOS_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className={`absolute ${positions[i]} ${rotations[i]} inline-block rounded-lg border border-dashed border-zinc-700 bg-zinc-900/80 px-3 py-2 text-xs sm:text-sm text-zinc-400 whitespace-nowrap`}
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="text-sm text-zinc-500 border-t border-white/10 pt-6 mt-auto">
              Výsledek: nejistota, ztracený čas a peníze utopené v reklamě bez návratnosti.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-950/40 to-white/5 p-8 sm:p-10 shadow-xl shadow-violet-950/30 flex flex-col"
          >
            <span className="font-jb text-xs uppercase tracking-widest text-violet-300">Se systémem od nás</span>
            <h3 className="font-display text-2xl font-semibold text-white mt-3 mb-8">Jak marketing řeší Progma</h3>

            <ul className="space-y-4 mb-8 flex-1">
              {SYSTEM_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-zinc-200">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-zinc-400 border-t border-white/10 pt-6 mt-auto">
              Výsledek: firma, která roste, i když vy zrovna nepracujete.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================== WHY US ============================== */

function WhyUs() {
  return (
    <section id="proc-my" className="relative overflow-hidden py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <GlowOrb className="w-96 h-96 top-40 -right-48" color="rgba(186,58,237,0.15)" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Proč Progma"
          title="Nejlepší obchodní rozhodnutí, které letos uděláte."
          sub="Jsme partner, kterému jde o vaše tržby stejně jako vám."
        />

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`group relative rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/40 transition-colors duration-300 p-8 ${p.span}`}
            >
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:bg-violet-500/20 transition-colors">
                <p.icon className="w-5 h-5 text-violet-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white mb-3">{p.title}</h3>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">{p.copy}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/50 via-zinc-900/40 to-zinc-900/40 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="w-12 h-12 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-violet-300" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">Exkluzivita ve vašem regionu</h3>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl">
              V každém oboru a regionu pracujeme jen s jednou firmou. Nikdy tak neděláme marketing i vaší
              konkurenci o dva domy vedle.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== PRICING ============================== */

function Pricing() {
  return (
    <section id="cenik" className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Investice, ne náklad"
          title="Vyberte si tempo, kterým chcete růst."
          sub="Žádné skryté poplatky, žádné dlouhodobé zámky, které vás svazují. Jen tempo růstu, které si zvolíte sami."
          align="center"
        />

        <div className="grid lg:grid-cols-3 gap-x-6 gap-y-12 lg:gap-y-6 items-start">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 sm:p-9 flex flex-col ${
                tier.highlighted
                  ? "border-2 border-violet-500 bg-gradient-to-b from-violet-950/60 to-zinc-900/60 shadow-2xl shadow-violet-900/50 lg:-translate-y-4"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {tier.badge && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-jb text-xs font-semibold uppercase tracking-wider bg-violet-500 text-white px-4 py-1.5 rounded-full shadow-lg shadow-violet-900/50">
                  {tier.badge}
                </span>
              )}

              <h3 className="font-display text-2xl font-semibold text-white mb-1">{tier.name}</h3>
              <p className="text-sm text-zinc-400 mb-6">{tier.tagline}</p>

              {tier.priceOnRequest ? (
                <div className="mb-8">
                  <span className="font-display text-3xl sm:text-4xl font-bold text-white">Individuální</span>
                  <p className="text-zinc-400 text-sm mt-1.5">Cena na míru podle rozsahu spolupráce</p>
                </div>
              ) : (
                <div className="mb-8 flex items-baseline gap-1">
                  <span className="font-jb text-4xl sm:text-5xl font-bold text-white">{tier.price}</span>
                  <span className="text-zinc-400 text-sm">Kč / měsíc</span>
                </div>
              )}

              <ul className="space-y-3.5 mb-9 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        tier.highlighted ? "text-violet-300" : "text-zinc-500"
                      }`}
                    />
                    <span className="text-sm text-zinc-300">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#kontakt"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all ${
                  tier.highlighted
                    ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/50"
                    : "border border-white/15 hover:border-white/30 hover:bg-white/5 text-white"
                }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-zinc-600 mt-10">
          * Ceny jsou uvedeny bez DPH. Minimální spolupráce 3 měsíce — systém potřebuje čas, aby ukázal svůj
          výkon.
        </p>
      </div>
    </section>
  );
}

/* ============================== TEAM ============================== */

function TeamDetailContent({ person }) {
  return (
    <div className="grid sm:grid-cols-5 gap-8 sm:gap-10 items-start">
      <div className="sm:col-span-2">
        {person.photo ? (
          <img
            src={person.photo}
            alt={person.name}
            className="w-full aspect-square rounded-2xl object-cover shadow-2xl shadow-violet-950/50"
          />
        ) : (
          <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center font-display text-5xl font-bold text-white shadow-2xl shadow-violet-950/50">
            {person.initials}
          </div>
        )}
      </div>
      <div className="sm:col-span-3">
        <div className="flex items-center gap-2 mb-2">
          <person.icon className="w-4 h-4 text-violet-400" />
          <span className="font-jb text-xs uppercase tracking-wide text-violet-300">{person.role}</span>
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-5">{person.name}</h3>
        <div className="space-y-4">
          {person.bioLong.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function Team() {
  const [selected, setSelected] = useState(0);
  const person = TEAM[selected];

  return (
    <section id="tym" className="relative py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Tým, který to odvede"
          title="Tři lidé. Nulové výmluvy."
          sub="Žádný přeprodávaný tým na volné noze. Tři specialisté, kteří na vašem účtu skutečně pracují — každý den. Klikněte na někoho z nich a přečtěte si víc."
        />

        <div className="grid md:grid-cols-3 gap-6 mb-6 md:items-start">
          {TEAM.map((m, i) => {
            const active = i === selected;
            return (
              <div key={i}>
                <motion.button
                  onClick={() => setSelected(i)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`w-full text-left relative rounded-3xl border transition-colors duration-300 p-8 ${
                    active ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:border-violet-500/40"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-14 h-14 rounded-2xl object-cover shadow-lg shadow-violet-900/40"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center font-display text-lg font-bold text-white shadow-lg shadow-violet-900/40">
                        {m.initials}
                      </div>
                    )}
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">{m.name}</h3>
                      <span className="font-jb text-xs uppercase tracking-wide text-violet-300">{m.role}</span>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{m.bio}</p>
                  <div
                    className={`flex items-center gap-1.5 mt-5 text-xs font-semibold transition-colors ${
                      active ? "text-violet-300" : "text-zinc-600"
                    }`}
                  >
                    {active ? "Zobrazeno níže" : "Zjistit více"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </motion.button>

                {/* Mobile only: detail expands right under this card, not after the whole row */}
                <div className="md:hidden">
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-950/40 to-white/5 p-6">
                          <TeamDetailContent person={m} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop only: one shared spotlight panel below the row of cards */}
        <div className="hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-950/40 to-white/5 p-8 sm:p-10"
            >
              <TeamDetailContent person={person} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ============================== CONTACT ============================== */

function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    field: "Stavebnictví",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (FORM_ENDPOINT.includes("YOUR_FORM_ID")) {
      // Formulář zatím není napojený na žádnou službu — viz komentář u FORM_ENDPOINT výše.
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="kontakt" className="relative overflow-hidden py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <GlowOrb className="w-96 h-96 bottom-0 -left-48" color="rgba(186,58,237,0.2)" />
      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Další krok"
          title="Zjistíme, jestli si rozumíme. Nezávazně."
          sub="Vyplňte formulář a ozveme se do 24 hodin s konkrétním pohledem na váš obor a region — žádné obchodní fráze, jen upřímná odpověď."
        />

        <div className="grid lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 relative rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10"
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="w-14 h-14 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-7 h-7 text-violet-300" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">Poptávka odeslána</h3>
                  <p className="text-sm text-zinc-400 max-w-sm">
                    Děkujeme. Ozveme se vám do 24 hodin s konkrétním pohledem na váš obor a region.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-2">
                        Jméno a příjmení
                      </label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                        placeholder="Jan Novák"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-2">
                        Telefon
                      </label>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                        placeholder="+420 777 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-2">
                      E-mail
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="jan@vasefirma.cz"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-2">
                      Obor podnikání
                    </label>
                    <select
                      value={form.field}
                      onChange={(e) => setForm({ ...form, field: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                    >
                      <option>Stavebnictví</option>
                      <option>Autoservis a pneuservis</option>
                      <option>Instalatérství a topenářství</option>
                      <option>Elektroinstalace</option>
                      <option>Řemeslná výroba</option>
                      <option>Zahradní a krajinářské služby</option>
                      <option>Nemovitosti a reality</option>
                      <option>Gastronomie a restaurace</option>
                      <option>Wellness a beauty</option>
                      <option>Fitness a sport</option>
                      <option>Zdravotnictví a stomatologie</option>
                      <option>Právní a účetní služby</option>
                      <option>Jiné</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-2">
                      Zpráva (nepovinné)
                    </label>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                      placeholder="Pár slov o vaší firmě a cílech..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
                      Poptávku se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo na{" "}
                      <a href="mailto:info@progma.cz" className="underline underline-offset-2">
                        info@progma.cz
                      </a>
                      .
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed px-7 py-4 text-sm font-semibold text-white transition-all shadow-lg shadow-violet-900/50"
                  >
                    {status === "sending" ? "Odesílám…" : "Odeslat nezávaznou poptávku"}
                    <Send className="w-4 h-4" />
                  </button>

                  <p className="flex items-center gap-2 text-xs text-zinc-600 justify-center pt-1">
                    <Lock className="w-3.5 h-3.5" />
                    Vaše údaje jsou v bezpečí. Žádný spam, žádné sdílení třetím stranám.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 relative rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-950/50 to-zinc-900/50 p-8 sm:p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-display text-xl font-semibold text-white mb-6">Přímý kontakt</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-violet-300" />
                  <span className="text-sm text-zinc-300 font-jb">+420 799 012 211</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-violet-300" />
                  <span className="text-sm text-zinc-300 font-jb">info@progma.cz</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-violet-300" />
                  <span className="text-sm text-zinc-300">Brno · působíme po celé ČR</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-300" />
                <span className="text-sm font-semibold text-white">Odpověď do 24 hodin</span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Každou poptávku si projde přímo někdo z týmu.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ============================== POLICY PAGES ============================== */

function PolicyLayout({ title, subtitle, children }) {
  return (
    <div className="pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-3xl mx-auto">
        <a href="#" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          Zpět na web
        </a>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-3">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mb-14">{subtitle}</p>}
        <div className="space-y-12">{children}</div>
      </div>
    </div>
  );
}

function PolicySection({ heading, children }) {
  return (
    <section>
      {heading && <h2 className="font-display text-xl font-semibold text-white mb-4">{heading}</h2>}
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">{children}</div>
    </section>
  );
}

function PolicyTable({ head, rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-xs text-left min-w-[640px]">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {head.map((h) => (
              <th key={h} className="p-3 font-medium text-zinc-300 align-top">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-zinc-400">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="p-3 align-top">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Zásady ochrany osobních údajů"
      subtitle="Zpracování osobních údajů na webu progma.cz ve smyslu nařízení (EU) 2016/679 (GDPR) a zákona č. 110/2019 Sb. — účinné od 23. 7. 2026"
    >
      <PolicySection heading="1. Kdo je správcem vašich údajů">
        <p>Provozovatelem webu progma.cz a společnými správci vašich osobních údajů jsou:</p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-zinc-300 space-y-1.5">
          <div>Erik Eis, IČO: 29754674, se sídlem Novodvorská 1077, 674 01 Třebíč</div>
          <div>Adam Kryštof, IČO: 23391472, se sídlem Oslavice 199, 594 01</div>
        </div>
        <p>(společně podnikající pod obchodním označením „Progma", dále jen „my" nebo „správce")</p>
        <p>
          Kontaktní e-mail pro ochranu údajů:{" "}
          <a href="mailto:podpora@progma.cz" className="text-violet-300 hover:text-violet-200 transition-colors">
            podpora@progma.cz
          </a>
        </p>
        <p>Nejmenovali jsme pověřence pro ochranu osobních údajů (DPO), neboť nám tato povinnost ze zákona nevzniká.</p>
      </PolicySection>

      <PolicySection heading="2. Jaké údaje zpracováváme a proč">
        <p>Osobní údaje zpracováváme pouze v rozsahu nezbytném pro daný účel. Přehled najdete v tabulce:</p>
        <PolicyTable
          head={["Účel", "Jaké údaje", "Právní základ", "Doba uložení"]}
          rows={[
            ["Vyřízení poptávky z kontaktního formuláře", "jméno, e-mail, telefon, obsah zprávy", "plnění opatření před uzavřením smlouvy (čl. 6 odst. 1 písm. b GDPR)", "po dobu jednání, poté max. 6 měsíců"],
            ["Uzavření a plnění smlouvy o službách", "jméno, IČO, sídlo, e-mail, telefon, fakturační údaje", "plnění smlouvy (čl. 6 odst. 1 písm. b GDPR)", "po dobu smlouvy"],
            ["Vedení účetnictví a plnění daňových povinností", "fakturační a platební údaje", "právní povinnost (čl. 6 odst. 1 písm. c GDPR)", "10 let (zákon o DPH / účetnictví)"],
            ["Měření návštěvnosti (Google Analytics)", "cookies, IP adresa (zkrácená), údaje o zařízení a chování na webu", "souhlas (čl. 6 odst. 1 písm. a GDPR)", "dle nastavení cookies (viz čl. 8)"],
            ["Marketing a remarketing (Meta Pixel)", "cookies, identifikátory zařízení, údaje o chování na webu", "souhlas (čl. 6 odst. 1 písm. a GDPR)", "dle nastavení cookies (viz čl. 8)"],
            ["Ochrana našich právních nároků", "údaje z komunikace a smluv", "oprávněný zájem (čl. 6 odst. 1 písm. f GDPR)", "po dobu promlčecí lhůty"],
          ]}
        />
        <p>
          Poskytnutí údajů v kontaktním formuláři je dobrovolné, bez nich vás ale nemůžeme kontaktovat. Údaje pro
          fakturaci jsou nezbytné pro plnění smlouvy a zákonných povinností.
        </p>
      </PolicySection>

      <PolicySection heading="3. Komu údaje předáváme (zpracovatelé)">
        <p>
          Vaše údaje zpřístupňujeme pouze prověřeným poskytovatelům služeb, kteří je zpracovávají naším jménem na
          základě zpracovatelské smlouvy. Jde zejména o:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>poskytovatele webhostingu a e-mailu;</li>
          <li>Google Ireland Ltd. — nástroj Google Analytics (měření návštěvnosti);</li>
          <li>Meta Platforms Ireland Ltd. — nástroj Meta Pixel (marketing a remarketing);</li>
          <li>účetní / daňového poradce;</li>
          <li>poskytovatele CRM a nástrojů pro správu poptávek.</li>
        </ul>
        <p>
          <strong className="text-zinc-300">Předání do třetích zemí.</strong> Někteří poskytovatelé (Google, Meta)
          mohou údaje zpracovávat i mimo EU/EHP, zejména v USA. K takovému předání dochází na základě standardních
          smluvních doložek schválených Evropskou komisí, případně rámce EU–US Data Privacy Framework, které
          zajišťují odpovídající úroveň ochrany.
        </p>
        <p>Osobní údaje nikdy neprodáváme a nepředáváme třetím osobám pro jejich vlastní marketing.</p>
      </PolicySection>

      <PolicySection heading="4. Jaká máte práva">
        <p>V souvislosti se zpracováním osobních údajů máte podle GDPR tato práva:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong className="text-zinc-300">Právo na přístup</strong> — zjistit, jaké údaje o vás zpracováváme.</li>
          <li><strong className="text-zinc-300">Právo na opravu</strong> — nechat opravit nepřesné či neúplné údaje.</li>
          <li><strong className="text-zinc-300">Právo na výmaz</strong> („být zapomenut") — nechat údaje smazat, není-li důvod je dále zpracovávat.</li>
          <li><strong className="text-zinc-300">Právo na omezení zpracování</strong> — dočasně omezit zpracování.</li>
          <li><strong className="text-zinc-300">Právo na přenositelnost</strong> — získat údaje ve strojově čitelném formátu.</li>
          <li><strong className="text-zinc-300">Právo vznést námitku</strong> — proti zpracování založenému na oprávněném zájmu.</li>
          <li><strong className="text-zinc-300">Právo odvolat souhlas</strong> — kdykoli, s účinky do budoucna (týká se cookies a marketingu).</li>
        </ul>
        <p>
          Svá práva uplatníte e-mailem na{" "}
          <a href="mailto:podpora@progma.cz" className="text-violet-300 hover:text-violet-200 transition-colors">
            podpora@progma.cz
          </a>
          . Vyřídíme je bez zbytečného odkladu, nejpozději do jednoho měsíce.
        </p>
        <p>
          <strong className="text-zinc-300">Stížnost u dozorového úřadu.</strong> Máte právo podat stížnost u Úřadu
          pro ochranu osobních údajů, se sídlem Pplk. Sochora 27, 170 00 Praha 7,{" "}
          <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer" className="text-violet-300 hover:text-violet-200 transition-colors">
            www.uoou.cz
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection heading="5. Zabezpečení údajů">
        <p>
          Přijali jsme přiměřená technická a organizační opatření k ochraně osobních údajů před neoprávněným
          přístupem, ztrátou či zneužitím — zejména zabezpečený přenos dat (HTTPS), řízený přístup k údajům a
          smluvní zavázání zpracovatelů k mlčenlivosti.
        </p>
      </PolicySection>

      <PolicySection heading="6. Údaje dětí">
        <p>Web ani naše služby nejsou určeny osobám mladším 15 let a osobní údaje takových osob vědomě nezpracováváme.</p>
      </PolicySection>

      <PolicySection heading="7. Změny těchto zásad">
        <p>
          Tyto zásady můžeme aktualizovat; aktuální znění je vždy dostupné na webu progma.cz s uvedením data
          účinnosti. O podstatných změnách vás budeme informovat vhodným způsobem.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}

function CookiePolicyPage() {
  return (
    <PolicyLayout title="Zásady používání cookies" subtitle="Na webu progma.cz — účinné od 23. 7. 2026">
      <PolicySection heading="1. Co jsou cookies">
        <p>
          Cookies jsou malé textové soubory, které se ukládají do vašeho prohlížeče při návštěvě webu. Slouží k
          zajištění správného fungování webu, k měření návštěvnosti a k marketingu. Některé cookies jsou nezbytné,
          jiné používáme pouze s vaším souhlasem.
        </p>
      </PolicySection>

      <PolicySection heading="2. Jaké cookies používáme">
        <PolicyTable
          head={["Kategorie", "Účel", "Souhlas", "Příklad"]}
          rows={[
            ["Nezbytné (technické)", "Zajišťují základní funkce webu a odeslání formuláře. Bez nich web nefunguje.", "není potřeba", "session cookie, cookie souhlasu"],
            ["Analytické", "Měří návštěvnost a chování na webu, abychom jej mohli zlepšovat (Google Analytics).", "vyžaduje souhlas", "_ga, _gid"],
            ["Marketingové", "Umožňují cílení reklamy a remarketing na platformách Meta (Facebook, Instagram).", "vyžaduje souhlas", "_fbp (Meta Pixel)"],
          ]}
        />
      </PolicySection>

      <PolicySection heading="3. Souhlas a jeho odvolání">
        <p>
          Analytické a marketingové cookies aktivujeme až poté, co k tomu udělíte souhlas v cookie liště při vstupu
          na web. Souhlas je dobrovolný a můžete jej kdykoli odvolat nebo změnit —{" "}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
            className="text-violet-300 hover:text-violet-200 underline underline-offset-2 transition-colors"
          >
            kliknutím zde
          </button>{" "}
          nebo přes odkaz „Nastavení cookies" v patičce webu. Odvolání souhlasu nemá vliv na zákonnost zpracování
          před jeho odvoláním.
        </p>
        <p>
          Cookies můžete rovněž spravovat či mazat přímo v nastavení svého prohlížeče. Blokování nezbytných cookies
          však může omezit funkčnost webu.
        </p>
      </PolicySection>

      <PolicySection heading="4. Doba uložení">
        <p>
          Nezbytné cookies trvají po dobu relace nebo krátce po ní. Analytické a marketingové cookies mají dobu
          platnosti dle nastavení příslušných nástrojů (zpravidla několik měsíců až 2 roky).
        </p>
      </PolicySection>

      <PolicySection heading="5. Další informace">
        <p>
          Zpracování osobních údajů získaných prostřednictvím cookies se řídí našimi{" "}
          <a href="#zasady-ochrany-udaju" className="text-violet-300 hover:text-violet-200 transition-colors">
            Zásadami ochrany osobních údajů
          </a>
          . V případě dotazů nás kontaktujte na{" "}
          <a href="mailto:podpora@progma.cz" className="text-violet-300 hover:text-violet-200 transition-colors">
            podpora@progma.cz
          </a>
          .
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}

/* ============================== COOKIE CONSENT ============================== */

const COOKIE_CATEGORIES = [
  {
    id: "necessary",
    label: "Nezbytné",
    description: "Zajišťují základní funkce webu a odeslání formuláře. Bez nich web nefunguje.",
    locked: true,
  },
  {
    id: "analytics",
    label: "Analytické",
    description: "Měří návštěvnost a chování na webu, abychom jej mohli zlepšovat (Google Analytics).",
    locked: false,
  },
  {
    id: "marketing",
    label: "Marketingové",
    description: "Umožňují cílení reklamy a remarketing na platformách Meta (Facebook, Instagram).",
    locked: false,
  },
];

function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [choices, setChoices] = useState({ necessary: true, analytics: false, marketing: false });

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      setVisible(true);
    } else {
      setChoices({ necessary: true, analytics: Boolean(stored.analytics), marketing: Boolean(stored.marketing) });
    }

    const openHandler = () => {
      const current = getStoredConsent();
      if (current) setChoices({ necessary: true, analytics: Boolean(current.analytics), marketing: Boolean(current.marketing) });
      setSettingsOpen(true);
      setVisible(true);
    };
    window.addEventListener("open-cookie-settings", openHandler);
    return () => window.removeEventListener("open-cookie-settings", openHandler);
  }, []);

  const acceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    storeConsent(consent);
    setChoices(consent);
    setVisible(false);
    setSettingsOpen(false);
  };

  const rejectOptional = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    storeConsent(consent);
    setChoices(consent);
    setVisible(false);
    setSettingsOpen(false);
  };

  const saveChoices = () => {
    storeConsent(choices);
    setVisible(false);
    setSettingsOpen(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        {!settingsOpen ? (
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <Cookie className="w-6 h-6 text-violet-400 shrink-0 hidden sm:block" />
            <p className="text-sm text-zinc-300 leading-relaxed flex-1">
              Používáme cookies pro základní fungování webu a se souhlasem i pro měření návštěvnosti a
              marketing. Více v{" "}
              <a href="#cookies" className="text-violet-300 hover:text-violet-200 underline underline-offset-2">
                zásadách používání cookies
              </a>
              .
            </p>
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={() => setSettingsOpen(true)}
                className="rounded-full border border-white/15 hover:border-violet-500/40 hover:bg-white/5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Nastavení
              </button>
              <button
                onClick={rejectOptional}
                className="rounded-full border border-white/15 hover:border-violet-500/40 hover:bg-white/5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Odmítnout volitelné
              </button>
              <button
                onClick={acceptAll}
                className="rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-violet-900/40"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-white">Nastavení cookies</h3>
              <button onClick={() => setSettingsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-5">
              {COOKIE_CATEGORIES.map((cat) => (
                <div key={cat.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <button
                    onClick={() => !cat.locked && setChoices((c) => ({ ...c, [cat.id]: !c[cat.id] }))}
                    disabled={cat.locked}
                    className={`absolute left-0 top-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
                      choices[cat.id] ? "translate-x-[22px]" : "translate-x-0.5"
                    }`}
                  >
                    <span
                        className={`mt-0.5 w-12 h-7 rounded-full shrink-0 transition-colors relative ${
                        choices[cat.id] ? "translate-x-[18px]" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {cat.label}
                      {cat.locked && <span className="text-zinc-500 font-normal"></span>}
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={saveChoices}
                className="rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-violet-900/40"
              >
                Uložit nastavení
              </button>
              <button
                onClick={acceptAll}
                className="rounded-full border border-white/15 hover:border-violet-500/40 hover:bg-white/5 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== FOOTER ============================== */

function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <img src="/logo.png" alt="Progma" className="h-9 w-auto mb-4" />
            <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
              Marketing, který pracuje, i když vy zrovna ne.
            </p>
          </div>

          <div>
            <h4 className="font-jb text-xs uppercase tracking-wide text-zinc-500 mb-4">Navigace</h4>
            <div className="space-y-3">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="block text-sm text-zinc-400 hover:text-white transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-jb text-xs uppercase tracking-wide text-zinc-500 mb-4">Kontakt</h4>
            <div className="space-y-3 text-sm text-zinc-400">
              <div>info@progma.cz</div>
              <div>+420 722 269 263</div>
              <div>Brno, Česká republika</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <span className="text-xs text-zinc-600">© 2026 Progma. Všechna práva vyhrazena.</span>
          <div className="flex items-center gap-6 text-xs text-zinc-600">
            <a href="#zasady-ochrany-udaju" className="hover:text-zinc-400 transition-colors">
              Zásady ochrany osobních údajů
            </a>
            <a href="#cookies" className="hover:text-zinc-400 transition-colors">
              Cookies
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-cookie-settings"))}
              className="hover:text-zinc-400 transition-colors"
            >
              Nastavení cookies
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================== ROOT ============================== */

function getPolicyView() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "zasady-ochrany-udaju") return "privacy";
  if (hash === "cookies") return "cookies";
  return null;
}

export default function App() {
  const [view, setView] = useState(getPolicyView);

  useEffect(() => {
    const onHashChange = () => {
      setView(getPolicyView());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body antialiased">
      <Navbar />
      {view === "privacy" ? (
        <PrivacyPolicyPage />
      ) : view === "cookies" ? (
        <CookiePolicyPage />
      ) : (
        <>
          <Hero />
          <ProblemSolution />
          <WhyUs />
          <Pricing />
          <Team />
          <Contact />
        </>
      )}
      <Footer />
      <CookieConsent />
    </div>
  );
}
