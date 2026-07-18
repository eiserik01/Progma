import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  MonitorPlay,
  Calculator,
  Ticket,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  Wallet,
  ArrowRight,
  Sparkles,
  FileText,
  Maximize2,
  Minimize2,
  Loader2,
  Tag,
  Calendar,
  Check,
  MapPin,
  Hash,
  Plus,
  Trash2,
  Pencil,
  AlertCircle,
  X,
  Search,
  Download,
  Activity,
} from "lucide-react";
import { useSyncedTable } from "./useSyncedTable.js";
import { useAuth } from "./AuthContext.js";
import { useToast } from "./ToastContext.jsx";
import { LoadingScreen } from "./AdminAuth.jsx";

/* ============================== EMBEDDED ASSETS ============================== */
/* Base64 payloads (logo + a Czech-diacritics-safe subset of DejaVu Sans for the
   generated PDF) are appended at the bottom of this file as constants and used
   below. Keeping them at the bottom keeps the actual app logic readable. */

/* ============================== DATA ============================== */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "klienti", label: "Klienti", icon: Users },
  { id: "prezentace", label: "Prezentace", icon: MonitorPlay },
  { id: "kalkulace", label: "Kalkulace", icon: Calculator },
  { id: "kody", label: "Slevové kódy", icon: Ticket },
];

const PACKAGES = [
  {
    id: "zaklad",
    name: "Základ",
    tagline: "Pevné základy digitální přítomnosti",
    accent: "#a1a1aa",
    pricing: { none: 4099, m6: 3499, m12: 2999 },
    features: [
      "Nastavení a optimalizace Google profilu firmy",
      "Profesionální web / vizitka firmy",
      "Základní správa sociálních sítí (2 výstupy týdně)",
      "Měsíční přehled výkonu",
    ],
  },
  {
    id: "vykon",
    name: "Výkon",
    tagline: "Kompletní správa a video produkce",
    accent: "#c084fc",
    popular: true,
    pricing: { none: 6499, m6: 5499, m12: 4000 },
    features: [
      "Vše ze Základu",
      "Kompletní správa PPC a sociálních kampaní",
      "Měsíční video produkce na místě (reels, ukázky práce)",
      "Cílení na poptávky, ne na lajky",
      "Osobní account manager",
      "Detailní report + doporučení dalšího kroku",
    ],
  },
  {
    id: "dominance",
    name: "Dominance",
    tagline: "Agresivní růst a tržní dominance",
    accent: "#fbbf24",
    pricing: { none: 18999, m6: 15999, m12: 11999 },
    features: [
      "Vše z Výkonu",
      "Týdenní video produkce v prémiové kvalitě",
      "Vícekanálová strategie (Google, Meta, YouTube, LinkedIn)",
      "Prioritní přidělení kreativního i obchodního týmu",
      "Exkluzivita — jediná firma z oboru v regionu",
      "Čtvrtletní strategické review s vedením Progma",
    ],
  },
];

const COMMITMENTS = [
  { id: "none", label: "Bez závazku", months: 1, note: "Měsíční platba, kdykoli zrušíte" },
  { id: "m6", label: "6 měsíců", months: 6, note: "Střednědobý závazek" },
  { id: "m12", label: "12 měsíců", months: 12, note: "Maximální věrnostní sleva", best: true },
];

const CHANNELS = [
  { id: "google_ads", label: "Google Ads" },
  { id: "google_profile", label: "Google profil firmy / SEO" },
  { id: "meta", label: "Meta — Facebook & Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok" },
];

const STATUS_META = {
  aktivni: { label: "Aktivní", color: "#34d399" },
  novy_lead: { label: "Nový lead", color: "#c084fc" },
  pozastaveno: { label: "Pozastaveno", color: "#fb7185" },
};

const INITIAL_CLIENTS = [
  {
    id: 1,
    company: "Novák Stavby s.r.o.",
    contact: "Jan Novák",
    industry: "Stavebnictví",
    status: "aktivni",
    packageId: "vykon",
    commitmentId: "m12",
    phone: "+420 601 223 344",
    email: "novak@novakstavby.cz",
    address: "Průmyslová 245, 602 00 Brno",
    ico: "27485632",
    dic: "CZ27485632",
    since: "leden 2026",
    notes: [
      { date: "3. 7. 2026", author: "Erik", text: "Podepsáno na 12 měsíců, spokojen s prvními výsledky kampaně." },
      { date: "20. 6. 2026", author: "Adam", text: "Poslal kalkulaci, chce vidět ukázky videí od jiných stavebních firem." },
    ],
  },
  {
    id: 2,
    company: "AutoDvořák",
    contact: "Petr Dvořák",
    industry: "Autoservis",
    status: "aktivni",
    packageId: "dominance",
    commitmentId: "m6",
    phone: "+420 725 118 902",
    email: "petr@autodvorak.cz",
    address: "Hlavní 88, 616 00 Brno",
    ico: "24681357",
    dic: "CZ24681357",
    since: "březen 2026",
    notes: [
      { date: "1. 7. 2026", author: "Mako", text: "Natočili jsme den v servisu, klip půjde do kampaně příští týden." },
      { date: "15. 5. 2026", author: "Erik", text: "Upgrade z balíčku Výkon na Dominance, chce agresivnější růst." },
    ],
  },
  {
    id: 3,
    company: "Elektro Beneš",
    contact: "Tomáš Beneš",
    industry: "Elektroinstalace",
    status: "aktivni",
    packageId: "zaklad",
    commitmentId: "none",
    phone: "+420 777 004 512",
    email: "tomas@elektrobenes.cz",
    address: "Nádražní 12, 690 02 Břeclav",
    ico: "18765432",
    dic: "",
    since: "duben 2026",
    notes: [{ date: "28. 6. 2026", author: "Adam", text: "Zatím spokojen, zvažuje přechod na Výkon na podzim." }],
  },
  {
    id: 4,
    company: "Wellness Aria",
    contact: "Lucie Malá",
    industry: "Wellness a beauty",
    status: "novy_lead",
    packageId: null,
    potentialPackageId: "vykon",
    commitmentId: "none",
    phone: "+420 604 887 231",
    email: "lucie@wellnessaria.cz",
    address: "",
    ico: "",
    dic: "",
    since: "—",
    notes: [
      { date: "9. 7. 2026", author: "Erik", text: "Zájem o video produkci, chce vidět ukázky z podobných provozoven." },
    ],
  },
  {
    id: 5,
    company: "Reality Horizont",
    contact: "Martina Svobodová",
    industry: "Nemovitosti a reality",
    status: "aktivni",
    packageId: "dominance",
    commitmentId: "m12",
    phone: "+420 731 552 019",
    email: "martina@realityhorizont.cz",
    address: "Náměstí Svobody 3, 602 00 Brno",
    ico: "05123478",
    dic: "CZ05123478",
    since: "únor 2026",
    notes: [
      { date: "5. 7. 2026", author: "Mako", text: "Připravujeme prezentaci nových nemovitostí pro sociální sítě." },
      { date: "18. 4. 2026", author: "Erik", text: "Podepsáno na 12 měsíců, cílí na luxusní segment." },
    ],
  },
  {
    id: 6,
    company: "Instalatérství Král",
    contact: "Roman Král",
    industry: "Instalatérství a topenářství",
    status: "pozastaveno",
    packageId: "zaklad",
    commitmentId: "m6",
    phone: "+420 606 213 887",
    email: "roman@instalaterstvikral.cz",
    address: "Krátká 9, 664 51 Šlapanice",
    ico: "16234567",
    dic: "",
    since: "listopad 2025",
    notes: [{ date: "30. 6. 2026", author: "Adam", text: "Pozastaveno kvůli sezónnímu útlumu, obnovení domluveno na září." }],
  },
  {
    id: 7,
    company: "Gastro Fusion",
    contact: "David Kovář",
    industry: "Gastronomie a restaurace",
    status: "novy_lead",
    packageId: null,
    potentialPackageId: "vykon",
    commitmentId: "none",
    phone: "+420 608 441 776",
    email: "david@gastrofusion.cz",
    address: "",
    ico: "",
    dic: "",
    since: "—",
    notes: [{ date: "10. 7. 2026", author: "Adam", text: "První kontakt na doporučení, čeká na zpětné zavolání." }],
  },
];

const INITIAL_TASKS = [
  { id: 1, text: "Zavolat do stavebnin - Adam", assignee: "Adam", due: "Dnes", done: false },
  { id: 2, text: "Poslat kalkulaci - Wellness Aria", assignee: "Erik", due: "Dnes", done: false },
  { id: 3, text: "Připravit prezentaci - Reality Horizont", assignee: "Mako", due: "Zítra", done: false },
  { id: 4, text: "Ověřit platbu - Elektro Beneš", assignee: "Adam", due: "Tento týden", done: true },
  { id: 5, text: "Zavolat novému leadu - Gastro Fusion", assignee: "Adam", due: "Zítra", done: false },
];

const SLIDES = [
  "Úvod a agenda schůzky",
  "O agentuře Progma",
  "Váš aktuální stav na trhu",
  "Náš proces spolupráce",
  "Případové studie",
  "Balíčky a ceny",
  "Proč zvolit Progma",
  "Reference klientů",
  "Další kroky",
  "Prostor pro otázky",
];

const INITIAL_CODES = [
  { id: 1, code: "LETO2026", type: "percent", value: 10, description: "Letní akce", active: true },
  { id: 2, code: "DOPORUCENI", type: "fixed", value: 500, description: "Sleva za doporučení od stávajícího klienta", active: true },
  { id: 3, code: "VIP2026", type: "percent", value: 15, description: "VIP klient / strategické partnerství", active: true },
  { id: 4, code: "VELETRH2025", type: "fixed", value: 1000, description: "Akce z veletrhu 2025", active: false },
];

const SUPPLIER = {
  name: "Progma s.r.o.",
  address: "Cejl 62, 602 00 Brno",
  ico: "19283746",
  dic: "CZ19283746",
  email: "info@progma.cz",
  phone: "+420 722 269 263",
};

/* ============================== HELPERS ============================== */

function formatKc(n) {
  return n.toLocaleString("cs-CZ") + " Kč";
}

function packageById(id) {
  return PACKAGES.find((p) => p.id === id) || null;
}

function emptyOrderForm() {
  return { company: "", contact: "", ico: "", dic: "", address: "", email: "", phone: "", channels: [] };
}

function formatDateCz(date) {
  return date.toLocaleDateString("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
}

function displayNameFromEmail(email) {
  if (!email) return "Uživatel";
  const local = email.split("@")[0];
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

// Poznámky mají datum uložené jako čitelný český řetězec ("3. 7. 2026"), ne
// jako skutečné datum — tahle funkce ho pro řazení/výpočty zase rozebere zpátky.
function parseCzDate(str) {
  if (!str) return null;
  const match = str.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
  if (!match) return null;
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/* ============================== PDF GENERATION ============================== */

let jsPDFLoaderPromise = null;

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.dataset.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("script-load-failed"));
    document.head.appendChild(script);
  });
}

function ensureJsPDF() {
  if (window.jspdf && window.jspdf.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (!jsPDFLoaderPromise) {
    jsPDFLoaderPromise = loadScriptOnce(
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ).then(() => window.jspdf.jsPDF);
  }
  return jsPDFLoaderPromise;
}

function generateOrderNumber() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 900) + 100);
  return `OBJ-${y}${m}${day}-${rand}`;
}

async function generateOrderPdf({ orderForm, pkg, commitment, appliedCode, basePrice, afterCommitment, codeDiscountAmount, finalPrice, channelLabels }) {
  const JsPDFCtor = await ensureJsPDF();
  const doc = new JsPDFCtor({ unit: "mm", format: "a4" });

  // Register a Czech-diacritics-safe font (base14 PDF fonts don't cover č/ř/š/ž/ě/ů...)
  doc.addFileToVFS("DejaVuSans.ttf", FONT_REGULAR_B64);
  doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
  doc.addFileToVFS("DejaVuSans-Bold.ttf", FONT_BOLD_B64);
  doc.addFont("DejaVuSans-Bold.ttf", "DejaVuSans", "bold");
  doc.setFont("DejaVuSans", "normal");

  const marginX = 20;
  const rightX = 190;
  const pageBottom = 280;
  let y = 20;

  const setBold = (size) => {
    doc.setFont("DejaVuSans", "bold");
    doc.setFontSize(size);
  };
  const setNormal = (size) => {
    doc.setFont("DejaVuSans", "normal");
    doc.setFontSize(size);
  };
  const ensureSpace = (needed = 6) => {
    if (y + needed > pageBottom) {
      doc.addPage();
      y = 20;
    }
  };
  const line = (text, x, size, opts = {}) => {
    ensureSpace();
    if (opts.bold) setBold(size);
    else setNormal(size);
    if (opts.color) doc.setTextColor(...opts.color);
    else doc.setTextColor(20, 20, 20);
    doc.text(text, x, y, opts.align ? { align: opts.align } : undefined);
    y += opts.gap ?? size * 0.55 + 2.6;
  };
  const wrapped = (text, x, width, size) => {
    setNormal(size);
    doc.setTextColor(20, 20, 20);
    const parts = doc.splitTextToSize(text, width);
    parts.forEach((p) => {
      ensureSpace();
      doc.text(p, x, y);
      y += size * 0.55 + 2.2;
    });
  };
  const hr = () => {
    ensureSpace(4);
    doc.setDrawColor(220, 220, 225);
    doc.line(marginX, y, rightX, y);
    y += 6;
  };

  // Header: logo + title/order meta
  try {
    doc.addImage(LOGO_PNG_B64, "PNG", marginX, y - 4, 38, 9.4);
  } catch (e) {
    // If the logo fails to decode for any reason, fall back to a text wordmark rather than blocking the PDF.
    setBold(14);
    doc.text("PROGMA", marginX, y + 2);
  }
  setBold(16);
  doc.setTextColor(20, 20, 20);
  doc.text("OBJEDNÁVKA", rightX, y, { align: "right" });
  y += 6;
  setNormal(9);
  doc.setTextColor(110, 110, 115);
  doc.text(`Číslo: ${generateOrderNumber()}`, rightX, y, { align: "right" });
  y += 4.5;
  doc.text(`Datum: ${new Date().toLocaleDateString("cs-CZ")}`, rightX, y, { align: "right" });
  y += 10;

  setNormal(8.5);
  doc.setTextColor(140, 60, 200);
  doc.text("Toto je objednávka, nikoli daňový doklad (faktura).", marginX, y);
  y += 8;

  hr();

  // Supplier / Client two-column block
  const colStartY = y;
  setBold(10);
  doc.setTextColor(20, 20, 20);
  doc.text("Dodavatel", marginX, y);
  let ySupplier = y + 6;
  setNormal(9.5);
  [SUPPLIER.name, SUPPLIER.address, `IČO: ${SUPPLIER.ico}`, `DIČ: ${SUPPLIER.dic}`, SUPPLIER.email, SUPPLIER.phone].forEach((t) => {
    doc.text(t, marginX, ySupplier);
    ySupplier += 5;
  });

  let yClient = colStartY;
  const colX = 110;
  setBold(10);
  doc.text("Odběratel", colX, colStartY);
  yClient += 6;
  setNormal(9.5);
  const clientLines = [
    orderForm.company || "—",
    orderForm.contact || "—",
    orderForm.address || "Adresa neuvedena",
    orderForm.ico ? `IČO: ${orderForm.ico}` : null,
    orderForm.dic ? `DIČ: ${orderForm.dic}` : null,
    orderForm.email || null,
    orderForm.phone || null,
  ].filter(Boolean);
  clientLines.forEach((t) => {
    doc.text(t, colX, yClient);
    yClient += 5;
  });

  y = Math.max(ySupplier, yClient) + 6;
  hr();

  // Ordered service
  line("Objednané služby", marginX, 12, { bold: true, gap: 8 });
  line(`${pkg.name} — ${pkg.tagline}`, marginX, 11, { bold: true, gap: 6 });
  pkg.features.forEach((f) => wrapped(`-  ${f}`, marginX, 170, 9.5));
  y += 3;

  line("Marketingové kanály", marginX, 10.5, { bold: true, gap: 5.5 });
  wrapped(channelLabels.length ? channelLabels.join(", ") : "Nezvoleno", marginX, 170, 9.5);
  y += 2;

  line("Délka závazku", marginX, 10.5, { bold: true, gap: 5.5 });
  wrapped(`${commitment.label}${commitment.months > 1 ? ` (${commitment.months} měsíců)` : ""}`, marginX, 170, 9.5);
  y += 4;

  hr();

  // Price recap
  line("Cenová rekapitulace", marginX, 12, { bold: true, gap: 8 });

  const priceRow = (label, value, opts = {}) => {
    ensureSpace(6);
    setNormal(10);
    doc.setTextColor(80, 80, 85);
    doc.text(label, marginX, y);
    setNormal(10);
    if (opts.color) doc.setTextColor(...opts.color);
    else doc.setTextColor(20, 20, 20);
    doc.text(value, rightX, y, { align: "right" });
    y += 6.5;
  };

  priceRow("Základní cena / měsíc", formatKc(basePrice));
  if (afterCommitment < basePrice) {
    priceRow(`Věrnostní sleva (${commitment.label})`, `- ${formatKc(basePrice - afterCommitment)}`, { color: [190, 40, 60] });
  }
  if (appliedCode && codeDiscountAmount > 0) {
    priceRow(`Slevový kód "${appliedCode.code}"`, `- ${formatKc(codeDiscountAmount)}`, { color: [190, 40, 60] });
  }

  ensureSpace(14);
  doc.setFillColor(240, 230, 250);
  doc.roundedRect(marginX, y - 5.5, 170, 13, 2, 2, "F");
  setBold(13);
  doc.setTextColor(90, 30, 150);
  doc.text("Cena celkem / měsíc", marginX + 4, y + 2.5);
  doc.text(formatKc(finalPrice), rightX - 4, y + 2.5, { align: "right" });
  y += 15;

  priceRow(`Hodnota zakázky (${commitment.months} měs.)`, formatKc(finalPrice * commitment.months));
  y += 6;

  hr();

  // Signatures
  ensureSpace(30);
  y += 10;
  doc.setDrawColor(150, 150, 155);
  doc.line(marginX, y, marginX + 60, y);
  doc.line(120, y, 180, y);
  setNormal(8.5);
  doc.setTextColor(110, 110, 115);
  doc.text("Za dodavatele — Progma s.r.o.", marginX, y + 5);
  doc.text("Za odběratele", 120, y + 5);

  const filenameSafe = (orderForm.company || "klient").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  doc.save(`objednavka-progma-${filenameSafe}.pdf`);
}

/* ============================== SHARED UI ============================== */
/* Fonts, scrollbar, selection and focus-visible styles live in the shared
   src/index.css (same file the main site uses) — imported once in admin/main.jsx,
   so there's no need to inject them here per-component. */

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium"
      style={{ color: meta.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}

function GlassCard({ className = "", style, children }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl ${className}`} style={style}>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors";

/* ============================== SIDEBAR ============================== */

function Sidebar({ activeTab, setActiveTab, userEmail, onSignOut }) {
  const displayName = displayNameFromEmail(userEmail);
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside className="hidden md:flex flex-col w-16 lg:w-64 shrink-0 border-r border-white/10 bg-zinc-950/80 backdrop-blur-xl h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-4 lg:px-5 h-16 border-b border-white/10">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-900/50 shrink-0">
          <span className="font-display text-sm font-bold text-white">P</span>
        </span>
        <div className="hidden lg:block leading-tight">
          <div className="font-display text-sm font-semibold text-white">Progma OS</div>
          <div className="font-jb text-xs uppercase tracking-wider text-zinc-500">Sales &amp; CRM</div>
        </div>
      </div>

      <nav className="flex-1 px-2 lg:px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-500/15 text-white border border-violet-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className={`shrink-0 ${active ? "text-violet-300" : ""}`} style={{ width: 18, height: 18 }} />
              <span className="hidden lg:inline">{item.label}</span>
              {active && <span className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 rounded-xl px-2 py-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-800 flex items-center justify-center font-display text-xs font-bold text-white shrink-0">
            {initials}
          </span>
          <div className="hidden lg:block leading-tight min-w-0 flex-1">
            <div className="text-sm text-white font-medium truncate">{displayName}</div>
            <button onClick={onSignOut} className="text-xs text-zinc-500 hover:text-violet-300 transition-colors">
              Odhlásit se
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ============================== DASHBOARD ============================== */

function Dashboard({ clients, tasks, updateTask, setActiveTab, currentUserName, goToClient }) {
  const today = new Date().toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const activeClients = clients.filter((c) => c.status === "aktivni");
  const leadClients = clients.filter((c) => c.status === "novy_lead");

  const mrr = activeClients.reduce((sum, c) => {
    const pkg = packageById(c.packageId);
    return sum + (pkg ? pkg.pricing[c.commitmentId] : 0);
  }, 0);

  const pipelineValue = leadClients.reduce((sum, c) => {
    const pkg = packageById(c.potentialPackageId);
    return sum + (pkg ? pkg.pricing.none : 0);
  }, 0);

  const openTasks = tasks.filter((t) => !t.done).length;

  const packageMix = PACKAGES.map((pkg) => ({
    ...pkg,
    count: clients.filter((c) => c.packageId === pkg.id).length,
  }));

  const activity = clients
    .flatMap((c) => c.notes.map((n) => ({ ...n, clientId: c.id, clientName: c.company, parsed: parseCzDate(n.date) })))
    .sort((a, b) => (b.parsed?.getTime() || 0) - (a.parsed?.getTime() || 0))
    .slice(0, 6);

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, { done: !task.done }).catch(() => {});
  };

  const kpis = [
    { label: "MRR", value: formatKc(mrr), delta: "+12 % oproti minulému měsíci", icon: Wallet },
    { label: "Aktivní klienti", value: String(activeClients.length), delta: `${leadClients.length} nových leadů v pipeline`, icon: Users },
    { label: "Hodnota pipeline", value: formatKc(pipelineValue), delta: "potenciál z otevřených leadů", icon: TrendingUp },
    { label: "Otevřené úkoly", value: String(openTasks), delta: `z celkem ${tasks.length}`, icon: Clock },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-semibold text-white capitalize">Dobrý den, {currentUserName}</h1>
        <p className="text-zinc-500 text-sm mt-1 capitalize">{today}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <GlassCard key={i} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-jb uppercase tracking-wide text-zinc-500">{kpi.label}</span>
              <kpi.icon className="w-4 h-4 text-violet-400" />
            </div>
            <div className="font-display text-2xl lg:text-3xl font-semibold text-white mb-1.5">{kpi.value}</div>
            <div className="text-xs text-zinc-500">{kpi.delta}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <GlassCard className="lg:col-span-3 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-semibold text-white">Úkoly</h2>
            <span className="font-jb text-xs text-zinc-500">{openTasks} otevřených</span>
          </div>
          <div className="space-y-1">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-white/5 transition-colors"
              >
                {task.done ? (
                  <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-zinc-600 shrink-0" />
                )}
                <span className={`text-sm flex-1 ${task.done ? "text-zinc-600 line-through" : "text-zinc-200"}`}>
                  {task.text}
                </span>
                <span className="text-xs text-zinc-600 font-jb hidden sm:inline">{task.assignee}</span>
                <span className="text-xs text-zinc-600 shrink-0 w-16 text-right hidden sm:inline">{task.due}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-5">Klienti podle balíčku</h2>
          <div className="space-y-4">
            {packageMix.map((pkg) => (
              <div key={pkg.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-zinc-300">{pkg.name}</span>
                  <span className="font-jb text-sm text-zinc-500">{pkg.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(pkg.count / clients.length) * 100}%`, background: pkg.accent }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab("kalkulace")}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 hover:border-violet-500/40 hover:bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Otevřít kalkulaci
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <Activity className="w-4 h-4 text-violet-400" />
          <h2 className="font-display text-lg font-semibold text-white">Poslední aktivita</h2>
        </div>
        {activity.length === 0 ? (
          <p className="text-sm text-zinc-500">Zatím žádná aktivita.</p>
        ) : (
          <div className="space-y-1">
            {activity.map((a, i) => (
              <button
                key={i}
                onClick={() => goToClient(a.clientId)}
                className="w-full flex items-start gap-3 rounded-xl px-3 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center font-jb text-xs font-semibold text-violet-300 shrink-0 mt-0.5">
                  {a.author.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-200 truncate">{a.text}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    {a.clientName} · {a.author} · {a.date}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ============================== KLIENTI (CRM) ============================== */

function ClientEditForm({ initial, onSave, onCancel, saveLabel = "Uložit", saving = false, serverError = "" }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = () => {
    if (!form.company.trim()) { setError("Vyplňte název firmy."); return; }
    if (!form.contact.trim()) { setError("Vyplňte kontaktní osobu."); return; }
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Firma"><input value={form.company} onChange={set("company")} className={inputClass} placeholder="Novák Stavby s.r.o." /></Field>
        <Field label="Kontaktní osoba"><input value={form.contact} onChange={set("contact")} className={inputClass} placeholder="Jan Novák" /></Field>
        <Field label="Obor"><input value={form.industry} onChange={set("industry")} className={inputClass} placeholder="Stavebnictví" /></Field>
        <Field label="Stav">
          <select value={form.status} onChange={set("status")} className={inputClass}>
            <option value="novy_lead">Nový lead</option>
            <option value="aktivni">Aktivní</option>
            <option value="pozastaveno">Pozastaveno</option>
          </select>
        </Field>
        <Field label="Telefon"><input value={form.phone} onChange={set("phone")} className={`${inputClass} font-jb`} placeholder="+420 777 123 456" /></Field>
        <Field label="E-mail"><input value={form.email} onChange={set("email")} className={inputClass} placeholder="jan@firma.cz" /></Field>
        <div className="sm:col-span-2">
          <Field label="Adresa"><input value={form.address} onChange={set("address")} className={inputClass} placeholder="Ulice 123, 602 00 Brno" /></Field>
        </div>
        <Field label="IČO"><input value={form.ico} onChange={set("ico")} className={`${inputClass} font-jb`} placeholder="12345678" /></Field>
        <Field label="DIČ (pokud je plátce DPH)"><input value={form.dic} onChange={set("dic")} className={`${inputClass} font-jb`} placeholder="CZ12345678" /></Field>
        <Field label="Balíček">
          <select value={form.packageId} onChange={set("packageId")} className={inputClass}>
            <option value="">— Bez balíčku —</option>
            {PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Délka závazku">
          <select value={form.commitmentId} onChange={set("commitmentId")} className={inputClass}>
            {COMMITMENTS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </Field>
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
      {serverError && <p className="text-xs text-rose-400">{serverError}</p>}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          <Check className="w-4 h-4" />
          {saving ? "Ukládám…" : saveLabel}
        </button>
        <button onClick={onCancel} className="text-sm text-zinc-500 hover:text-white transition-colors">Zrušit</button>
      </div>
    </div>
  );
}

function ClientsView({ clients, insertClient, updateClient, removeClient, selectedClientId, setSelectedClientId, openCalculatorFor, currentUserName }) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const client = clients.find((c) => c.id === selectedClientId) || clients[0] || null;

  const filteredClients = clients.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      c.company.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      (c.industry || "").toLowerCase().includes(q)
    );
  });

  const exportCsv = () => {
    const header = ["Firma", "Kontakt", "Obor", "Stav", "Balíček", "Telefon", "E-mail", "Adresa", "IČO", "DIČ", "Klientem od"];
    const rows = clients.map((c) => {
      const pkg = packageById(c.packageId) || packageById(c.potentialPackageId);
      return [
        c.company,
        c.contact,
        c.industry,
        STATUS_META[c.status]?.label || c.status,
        pkg?.name || "",
        c.phone,
        c.email,
        c.address,
        c.ico,
        c.dic,
        c.since,
      ];
    });
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progma-klienti-${formatDateCz(new Date()).replace(/\. /g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Export klientů stažen.");
  };

  const selectClient = (id) => {
    setSelectedClientId(id);
    setEditing(false);
    setCreating(false);
    setSaveError("");
  };

  const patchFromForm = (form) => ({
    company: form.company,
    contact: form.contact,
    industry: form.industry || "Neuvedeno",
    status: form.status,
    phone: form.phone,
    email: form.email,
    address: form.address,
    ico: form.ico,
    dic: form.dic,
    commitmentId: form.commitmentId,
    packageId: form.status === "novy_lead" ? null : form.packageId || null,
    potentialPackageId: form.status === "novy_lead" ? form.packageId || null : null,
  });

  const handleSaveEdit = async (form) => {
    setSaving(true);
    setSaveError("");
    try {
      await updateClient(client.id, patchFromForm(form));
      setEditing(false);
      showToast(`${form.company} uložen.`);
    } catch {
      setSaveError("Uložení se nepovedlo. Zkuste to prosím znovu.");
      showToast("Uložení se nepovedlo.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (form) => {
    setSaving(true);
    setSaveError("");
    const today = formatDateCz(new Date());
    try {
      const newClient = await insertClient({
        ...patchFromForm(form),
        since: today,
        notes: [{ date: today, author: currentUserName, text: "Klient ručně přidán do CRM." }],
      });
      setSelectedClientId(newClient.id);
      setCreating(false);
      showToast(`${form.company} přidán do CRM.`);
    } catch {
      setSaveError("Přidání se nepovedlo. Zkuste to prosím znovu.");
      showToast("Přidání klienta se nepovedlo.", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = () => {
    if (!client) return;
    const nextStatus = client.status === "aktivni" ? "pozastaveno" : "aktivni";
    updateClient(client.id, { status: nextStatus })
      .then(() => showToast(`${client.company}: stav změněn na „${STATUS_META[nextStatus].label}“.`))
      .catch(() => {
        setSaveError("Změna stavu se nepovedla. Zkuste to prosím znovu.");
        showToast("Změna stavu se nepovedla.", "error");
      });
  };

  const handleDelete = async () => {
    if (!client) return;
    if (!window.confirm(`Opravdu smazat klienta ${client.company}? Tuto akci nelze vrátit zpět.`)) return;
    try {
      await removeClient(client.id);
      const remaining = clients.filter((c) => c.id !== client.id);
      setSelectedClientId(remaining.length ? remaining[0].id : null);
      setEditing(false);
      showToast(`${client.company} smazán.`);
    } catch {
      setSaveError("Smazání se nepovedlo. Zkuste to prosím znovu.");
      showToast("Smazání se nepovedlo.", "error");
    }
  };

  const createInitial = { company: "", contact: "", industry: "", status: "novy_lead", phone: "", email: "", address: "", ico: "", dic: "", commitmentId: "none", packageId: "" };
  const editInitial = client
    ? {
        company: client.company,
        contact: client.contact,
        industry: client.industry,
        status: client.status,
        phone: client.phone,
        email: client.email,
        address: client.address,
        ico: client.ico,
        dic: client.dic,
        commitmentId: client.commitmentId,
        packageId: client.packageId || client.potentialPackageId || "",
      }
    : null;

  const pkg = client ? packageById(client.packageId) : null;
  const potentialPkg = client ? packageById(client.potentialPackageId) : null;
  const commitment = client ? COMMITMENTS.find((c) => c.id === client.commitmentId) || COMMITMENTS[0] : null;

  return (
    <div className="h-screen flex flex-col">
      <div className="px-6 lg:px-10 pt-6 lg:pt-10 pb-4 shrink-0 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-white">Klienti</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {filteredClients.length === clients.length
              ? `${clients.length} firem v systému`
              : `${filteredClients.length} z ${clients.length} firem`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-violet-500/40 hover:bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => { setCreating(true); setEditing(false); }}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-violet-900/40"
          >
            <Plus className="w-4 h-4" />
            Nový klient
          </button>
        </div>
      </div>

      <div className="px-6 lg:px-10 pb-4 shrink-0 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hledat podle firmy, kontaktu, oboru…"
            className="w-full rounded-xl border border-white/10 bg-zinc-900/60 pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {[
            { id: "all", label: "Vše" },
            { id: "aktivni", label: "Aktivní" },
            { id: "novy_lead", label: "Leady" },
            { id: "pozastaveno", label: "Pozastaveno" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors border ${
                statusFilter === f.id
                  ? "bg-violet-500/15 border-violet-500/40 text-violet-300"
                  : "border-white/10 text-zinc-500 hover:text-white hover:border-white/25"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid lg:grid-cols-5 gap-0 lg:gap-6 px-6 lg:px-10 pb-6 lg:pb-10 min-h-0">
        <div className="lg:col-span-2 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/5">
          {filteredClients.map((c) => {
            const active = client && c.id === client.id;
            const cPkg = packageById(c.packageId) || packageById(c.potentialPackageId);
            return (
              <button
                key={c.id}
                onClick={() => selectClient(c.id)}
                className={`w-full text-left px-5 py-4 transition-colors ${
                  active ? "bg-violet-500/10 border-l-2 border-violet-400" : "border-l-2 border-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-white">{c.company}</span>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-xs text-zinc-500">{c.contact} · {c.industry}</div>
                {cPkg && <div className="text-xs text-violet-300/80 font-jb mt-1">{cPkg.name}</div>}
              </button>
            );
          })}
          {filteredClients.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-zinc-500">
              {clients.length === 0 ? "Žádní klienti. Přidejte prvního." : "Žádný klient neodpovídá hledání."}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 overflow-y-auto mt-4 lg:mt-0">
          <GlassCard className="p-6 lg:p-8">
            {creating ? (
              <>
                <h2 className="font-display text-xl font-semibold text-white mb-6">Nový klient</h2>
                <ClientEditForm
                  initial={createInitial}
                  onSave={handleCreate}
                  onCancel={() => { setCreating(false); setSaveError(""); }}
                  saveLabel="Přidat klienta"
                  saving={saving}
                  serverError={saveError}
                />
              </>
            ) : !client ? (
              <p className="text-sm text-zinc-500">Zatím žádný klient k zobrazení.</p>
            ) : editing ? (
              <>
                <h2 className="font-display text-xl font-semibold text-white mb-6">Upravit klienta</h2>
                <ClientEditForm
                  initial={editInitial}
                  onSave={handleSaveEdit}
                  onCancel={() => { setEditing(false); setSaveError(""); }}
                  saving={saving}
                  serverError={saveError}
                />
              </>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6 gap-3">
                  <div>
                    <h2 className="font-display text-xl lg:text-2xl font-semibold text-white">{client.company}</h2>
                    <p className="text-sm text-zinc-500 mt-1">{client.contact} · {client.industry}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={client.status} />
                    <button onClick={() => setEditing(true)} className="w-8 h-8 rounded-lg border border-white/10 hover:border-violet-500/40 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" aria-label="Upravit klienta">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={handleDelete} className="w-8 h-8 rounded-lg border border-white/10 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center text-zinc-400 hover:text-rose-400 transition-colors" aria-label="Smazat klienta">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <a href={`tel:${client.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-xl border border-white/10 hover:border-violet-500/40 px-4 py-3 transition-colors">
                    <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300 font-jb">{client.phone || "Neuvedeno"}</span>
                  </a>
                  <a href={`mailto:${client.email}`} className="flex items-center gap-3 rounded-xl border border-white/10 hover:border-violet-500/40 px-4 py-3 transition-colors">
                    <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300 truncate">{client.email || "Neuvedeno"}</span>
                  </a>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                    <Tag className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300">
                      {pkg ? (
                        <>{pkg.name} <span className="text-zinc-500">· {formatKc(pkg.pricing[client.commitmentId])}/měsíc</span></>
                      ) : potentialPkg ? (
                        <>Zvažuje {potentialPkg.name} <span className="text-zinc-500">(nezávazně)</span></>
                      ) : (
                        "Zatím bez balíčku"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                    <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300">
                      {commitment.label} <span className="text-zinc-500">· klientem od {client.since}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                    <MapPin className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300">{client.address || "Adresa zatím neuvedena"}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                    <Hash className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300 font-jb">
                      {client.ico ? `IČO ${client.ico}` : "IČO neuvedeno"}
                      {client.dic ? ` · DIČ ${client.dic}` : ""}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-jb uppercase tracking-wide text-zinc-500 mb-3">Poznámky ze schůzek</h3>
                  <div className="space-y-3">
                    {client.notes.map((note, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                        <span className="w-7 h-7 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center font-jb text-xs font-semibold text-violet-300 shrink-0">
                          {note.author.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <div className="text-xs text-zinc-500 mb-1">{note.date} · {note.author}</div>
                          <div className="text-sm text-zinc-300">{note.text}</div>
                        </div>
                      </div>
                    ))}
                    {client.notes.length === 0 && <p className="text-sm text-zinc-600">Zatím žádné poznámky.</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => openCalculatorFor(client.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-violet-900/40"
                  >
                    <Calculator className="w-4 h-4" />
                    Otevřít kalkulaci pro tohoto klienta
                  </button>
                  {client.status !== "novy_lead" && (
                    <button
                      onClick={toggleStatus}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 hover:border-violet-500/40 hover:bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      {client.status === "aktivni" ? "Pozastavit" : "Obnovit spolupráci"}
                    </button>
                  )}
                </div>
                {saveError && <p className="text-xs text-rose-400 mt-3">{saveError}</p>}
              </>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ============================== PREZENTACE ============================== */

function PresentationView({ presentMode, setPresentMode }) {
  const [slide, setSlide] = useState(0);
  const next = () => setSlide((s) => Math.min(s + 1, SLIDES.length - 1));
  const prev = () => setSlide((s) => Math.max(s - 1, 0));

  return (
    <div className={`flex flex-col ${presentMode ? "h-screen bg-zinc-950 p-6" : "p-6 lg:p-10"}`}>
      {!presentMode && (
        <div className="mb-6">
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-white">Prezentace</h1>
          <p className="text-zinc-500 text-sm mt-1">Slide {slide + 1} z {SLIDES.length} · {SLIDES[slide]}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <GlassCard className="flex-1 flex flex-col items-center justify-center relative overflow-hidden" style={{ minHeight: "50vh" }}>
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(168,85,247,0.15), transparent 70%)" }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="relative text-center px-6"
            >
              <MonitorPlay className="w-10 h-10 text-violet-400 mx-auto mb-5" />
              <p className="font-display text-xl lg:text-2xl text-white mb-2">Zde se načte interaktivní slajd</p>
              <p className="text-sm text-zinc-400 mt-1">{SLIDES[slide]}</p>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={() => setPresentMode(!presentMode)}
            className="absolute top-4 right-4 inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/15 bg-zinc-950/60 backdrop-blur-md text-zinc-300 hover:text-white hover:border-violet-400/50 transition-colors"
            aria-label={presentMode ? "Ukončit prezentační režim" : "Spustit prezentační režim"}
          >
            {presentMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </GlassCard>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={prev}
            disabled={slide === 0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:border-violet-500/40 hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Předchozí
          </button>

          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ background: i === slide ? "#c084fc" : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>

          <button
            onClick={next}
            disabled={slide === SLIDES.length - 1}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:hover:bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-violet-900/40"
          >
            Další
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================== KALKULACE ============================== */

function CalculatorView({ prefillClientId, codes, clients, insertClient, updateClient, currentUserName }) {
  const prefillClient = clients.find((c) => c.id === prefillClientId) || null;

  const [clientId, setClientId] = useState(prefillClient ? String(prefillClient.id) : "");
  const [packageId, setPackageId] = useState(prefillClient?.packageId || prefillClient?.potentialPackageId || "vykon");
  const [commitmentId, setCommitmentId] = useState(prefillClient?.commitmentId || "none");
  const [orderForm, setOrderForm] = useState(() =>
    prefillClient
      ? {
          company: prefillClient.company,
          contact: prefillClient.contact,
          ico: prefillClient.ico,
          dic: prefillClient.dic,
          address: prefillClient.address,
          email: prefillClient.email,
          phone: prefillClient.phone,
          channels: [],
        }
      : emptyOrderForm()
  );
  const [codeInput, setCodeInput] = useState("");
  const [appliedCode, setAppliedCode] = useState(null);
  const [codeError, setCodeError] = useState("");
  const [errors, setErrors] = useState({});
  const [generating, setGenerating] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [crmSyncError, setCrmSyncError] = useState(false);

  useEffect(() => {
    if (!clientId) {
      setOrderForm(emptyOrderForm());
      return;
    }
    const c = clients.find((cl) => String(cl.id) === clientId);
    if (c) {
      setOrderForm({
        company: c.company,
        contact: c.contact,
        ico: c.ico,
        dic: c.dic,
        address: c.address,
        email: c.email,
        phone: c.phone,
        channels: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const pkg = packageById(packageId);
  const basePrice = pkg.pricing.none;
  const afterCommitment = pkg.pricing[commitmentId];
  const commitment = COMMITMENTS.find((c) => c.id === commitmentId);

  const codeDiscountAmount = appliedCode
    ? appliedCode.type === "percent"
      ? Math.round((afterCommitment * appliedCode.value) / 100)
      : appliedCode.value
    : 0;
  const finalPrice = Math.max(afterCommitment - codeDiscountAmount, 0);
  const monthlySavings = basePrice - finalPrice;
  const totalSavings = monthlySavings * commitment.months;
  const hasDiscount = finalPrice < basePrice;

  const toggleChannel = (id) => {
    setOrderForm((f) => ({
      ...f,
      channels: f.channels.includes(id) ? f.channels.filter((c) => c !== id) : [...f.channels, id],
    }));
  };

  const applyCode = () => {
    const trimmed = codeInput.trim().toUpperCase();
    if (!trimmed) return;
    const match = codes.find((c) => c.code.toUpperCase() === trimmed);
    if (!match || !match.active) {
      setAppliedCode(null);
      setCodeError("Neplatný nebo neaktivní slevový kód.");
      return;
    }
    setAppliedCode(match);
    setCodeError("");
  };

  const clearCode = () => {
    setAppliedCode(null);
    setCodeInput("");
    setCodeError("");
  };

  const validate = () => {
    const e = {};
    if (!orderForm.company.trim()) e.company = "Vyplňte název firmy.";
    if (!orderForm.contact.trim()) e.contact = "Vyplňte kontaktní osobu.";
    if (!orderForm.email.trim() && !orderForm.phone.trim()) e.contactInfo = "Vyplňte alespoň e-mail nebo telefon.";
    if (orderForm.channels.length === 0) e.channels = "Vyberte alespoň jeden marketingový kanál.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // This is what makes "Generovat objednávku" more than a PDF export: it writes the
  // result straight into the CRM — updates the matched client, or creates a new one
  // if this order was for someone not yet in the system.
  const syncClientAfterOrder = async () => {
    const today = formatDateCz(new Date());
    const noteText = `Objednávka vygenerována: ${pkg.name} · ${commitment.label} · ${formatKc(finalPrice)}/měsíc.`;

    if (clientId) {
      const existing = clients.find((c) => String(c.id) === clientId);
      await updateClient(Number(clientId), {
        company: orderForm.company,
        contact: orderForm.contact,
        phone: orderForm.phone,
        email: orderForm.email,
        address: orderForm.address,
        ico: orderForm.ico,
        dic: orderForm.dic,
        status: "aktivni",
        packageId: packageId,
        potentialPackageId: null,
        commitmentId: commitmentId,
        notes: [{ date: today, author: currentUserName, text: noteText }, ...(existing?.notes || [])],
      });
    } else {
      const newClient = await insertClient({
        company: orderForm.company,
        contact: orderForm.contact,
        industry: "Neuvedeno",
        status: "aktivni",
        packageId,
        potentialPackageId: null,
        commitmentId,
        phone: orderForm.phone,
        email: orderForm.email,
        address: orderForm.address,
        ico: orderForm.ico,
        dic: orderForm.dic,
        since: today,
        notes: [{ date: today, author: currentUserName, text: noteText }],
      });
      setClientId(String(newClient.id));
    }
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setGenerating(true);
    setPdfError(false);
    setCrmSyncError(false);
    try {
      await generateOrderPdf({
        orderForm,
        pkg,
        commitment,
        appliedCode,
        basePrice,
        afterCommitment,
        codeDiscountAmount,
        finalPrice,
        channelLabels: CHANNELS.filter((ch) => orderForm.channels.includes(ch.id)).map((ch) => ch.label),
      });
    } catch {
      setGenerating(false);
      setPdfError(true);
      return;
    }
    try {
      await syncClientAfterOrder();
    } catch {
      setCrmSyncError(true);
    }
    setGenerating(false);
    setOrderDone(true);
  };

  const resetOrder = () => {
    setOrderDone(false);
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-semibold text-white">Kalkulace a uzavření obchodu</h1>
        <p className="text-zinc-500 text-sm mt-1">Sestavte nabídku, uplatněte slevu a rovnou vygenerujte objednávku ke stažení.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <GlassCard className="p-6">
            <Field label="Klient (nepovinné — vyplní se automaticky z CRM)">
              <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputClass}>
                <option value="">— Nový klient / bez přiřazení —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.company}</option>
                ))}
              </select>
            </Field>
          </GlassCard>

          <GlassCard className="p-6">
            <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-4">Krok 1 — Balíček</label>
            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              {PACKAGES.map((p) => {
                const selected = p.id === packageId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPackageId(p.id)}
                    className={`relative text-left rounded-2xl border p-4 transition-colors ${
                      selected ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-white/25 bg-white/5"
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 left-4 font-jb text-xs font-semibold uppercase tracking-wide bg-violet-500 text-white px-2 py-0.5 rounded-full">
                        Nejoblíbenější
                      </span>
                    )}
                    {selected && <Check className="w-4 h-4 text-violet-300 absolute top-4 right-4" />}
                    <div className="font-display text-base font-semibold text-white mb-1">{p.name}</div>
                    <div className="text-xs text-zinc-500 mb-3 leading-snug">{p.tagline}</div>
                    <div className="font-jb text-sm text-zinc-300">{formatKc(p.pricing.none)}<span className="text-zinc-600">/měs.</span></div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-jb uppercase tracking-wide text-zinc-500">Co balíček {pkg.name} obsahuje</span>
                <span className="font-jb text-xs" style={{ color: pkg.accent }}>{formatKc(pkg.pricing.none)}/měs.</span>
              </div>
              <ul className="space-y-2">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-4">Krok 2 — Délka závazku</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {COMMITMENTS.map((c) => {
                const selected = c.id === commitmentId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setCommitmentId(c.id)}
                    className={`relative text-left rounded-2xl border p-4 transition-colors ${
                      selected ? "border-violet-500 bg-violet-500/10" : "border-white/10 hover:border-white/25 bg-white/5"
                    }`}
                  >
                    {c.best && (
                      <span className="absolute -top-2.5 left-4 font-jb text-xs font-semibold uppercase tracking-wide bg-violet-500 text-white px-2 py-0.5 rounded-full">
                        Věrnostní sleva
                      </span>
                    )}
                    <div className="font-display text-base font-semibold text-white mb-1">{c.label}</div>
                    <div className="text-xs text-zinc-500 leading-snug">{c.note}</div>
                  </button>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-4">Krok 3 — Slevový kód</label>
            {appliedCode ? (
              <div className="flex items-center justify-between rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Ticket className="w-4 h-4 text-violet-300" />
                  <div>
                    <div className="text-sm font-semibold text-white font-jb">{appliedCode.code}</div>
                    <div className="text-xs text-zinc-400">{appliedCode.description}</div>
                  </div>
                </div>
                <button onClick={clearCode} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <input
                  value={codeInput}
                  onChange={(e) => { setCodeInput(e.target.value); setCodeError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && applyCode()}
                  placeholder="např. LETO2026"
                  className={`${inputClass} font-jb uppercase`}
                />
                <button
                  onClick={applyCode}
                  className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/10 hover:border-violet-500/40 hover:bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Uplatnit
                </button>
              </div>
            )}
            {codeError && (
              <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                {codeError}
              </p>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-4">Krok 4 — Detaily objednávky</label>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <Field label="Firma">
                  <input value={orderForm.company} onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })} className={inputClass} placeholder="Novák Stavby s.r.o." />
                </Field>
                {errors.company && <p className="text-xs text-rose-400 mt-1.5">{errors.company}</p>}
              </div>
              <div>
                <Field label="Kontaktní osoba">
                  <input value={orderForm.contact} onChange={(e) => setOrderForm({ ...orderForm, contact: e.target.value })} className={inputClass} placeholder="Jan Novák" />
                </Field>
                {errors.contact && <p className="text-xs text-rose-400 mt-1.5">{errors.contact}</p>}
              </div>
              <Field label="IČO">
                <input value={orderForm.ico} onChange={(e) => setOrderForm({ ...orderForm, ico: e.target.value })} className={`${inputClass} font-jb`} placeholder="12345678" />
              </Field>
              <Field label="DIČ (pokud je plátce DPH)">
                <input value={orderForm.dic} onChange={(e) => setOrderForm({ ...orderForm, dic: e.target.value })} className={`${inputClass} font-jb`} placeholder="CZ12345678" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Adresa sídla">
                  <input value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} className={inputClass} placeholder="Ulice 123, 602 00 Brno" />
                </Field>
              </div>
              <Field label="E-mail">
                <input value={orderForm.email} onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })} className={inputClass} placeholder="jan@firma.cz" />
              </Field>
              <Field label="Telefon">
                <input value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} className={`${inputClass} font-jb`} placeholder="+420 777 123 456" />
              </Field>
            </div>
            {errors.contactInfo && <p className="text-xs text-rose-400 mb-4">{errors.contactInfo}</p>}

            <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-3">Jaké sítě chce klient mít</label>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {CHANNELS.map((ch) => {
                const checked = orderForm.channels.includes(ch.id);
                return (
                  <button
                    key={ch.id}
                    onClick={() => toggleChannel(ch.id)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                      checked ? "border-violet-500 bg-violet-500/10 text-white" : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/25"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${checked ? "bg-violet-500 border-violet-500" : "border-white/20"}`}>
                      {checked && <Check className="w-3 h-3 text-white" />}
                    </span>
                    <span className="text-sm">{ch.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.channels && <p className="text-xs text-rose-400 mt-2">{errors.channels}</p>}
          </GlassCard>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 lg:p-8 sticky top-6">
            <AnimatePresence mode="wait">
              {orderDone ? (
                <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-7 h-7 text-violet-300" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white mb-2">Objednávka vygenerována</h3>
                  <p className="text-sm text-zinc-400 mb-1">{pkg.name} · {commitment.label} · {formatKc(finalPrice)}/měsíc</p>
                  {orderForm.company && <p className="text-sm text-violet-300 mb-2">{orderForm.company}</p>}
                  <p className="text-xs text-zinc-500 mb-1">PDF objednávky bylo staženo do vašeho počítače.</p>
                  {crmSyncError ? (
                    <p className="flex items-center justify-center gap-1.5 text-xs text-rose-400 mb-6">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Zápis do CRM se nepovedl — PDF máte, ale klienta si prosím upravte ručně v Klientech.
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-500 mb-6">
                      Klient byl {clientId ? "aktualizován" : "založen"} v CRM se stavem „Aktivní“ a poznámkou o objednávce.
                    </p>
                  )}
                  <button
                    onClick={resetOrder}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 hover:border-violet-500/40 hover:bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    Vytvořit další nabídku
                  </button>
                </motion.div>
              ) : (
                <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="font-jb text-xs uppercase tracking-wide text-zinc-500">Souhrn nabídky</span>
                  <h3 className="font-display text-lg font-semibold text-white mt-1 mb-5">{pkg.name}</h3>

                  {hasDiscount ? (
                    <div className="mb-5">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-lg text-rose-400 line-through font-jb">{formatKc(basePrice)}</span>
                        <span className="font-jb text-xs uppercase tracking-wide text-violet-300 border border-violet-500/30 rounded-full px-2 py-0.5">
                          Sleva
                        </span>
                      </div>

                      {afterCommitment < basePrice && (
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                          <span>Věrnostní sleva ({commitment.label})</span>
                          <span className="font-jb text-rose-400">- {formatKc(basePrice - afterCommitment)}</span>
                        </div>
                      )}
                      {codeDiscountAmount > 0 && (
                        <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                          <span>Kód „{appliedCode.code}“</span>
                          <span className="font-jb text-rose-400">- {formatKc(codeDiscountAmount)}</span>
                        </div>
                      )}

                      <motion.div
                        key={finalPrice}
                        initial={{ scale: 0.92, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="font-display text-4xl lg:text-5xl font-bold text-white mb-2"
                        style={{ textShadow: "0 0 40px rgba(168,85,247,0.55)" }}
                      >
                        {formatKc(finalPrice)}
                        <span className="text-base text-zinc-400 font-normal font-body"> /měsíc</span>
                      </motion.div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-300 mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Ušetříte {formatKc(monthlySavings)}/měsíc
                      </div>
                      <p className="text-sm text-zinc-400">
                        Za {commitment.months} měsíců ušetříte celkem <span className="text-white font-semibold">{formatKc(totalSavings)}</span>.
                      </p>
                    </div>
                  ) : (
                    <div className="mb-5">
                      <div className="font-display text-4xl lg:text-5xl font-bold text-white mb-2">
                        {formatKc(basePrice)}
                        <span className="text-base text-zinc-400 font-normal font-body"> /měsíc</span>
                      </div>
                      <p className="text-sm text-zinc-500">Bez dlouhodobého závazku, kdykoliv zrušíte.</p>
                    </div>
                  )}

                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Hodnota zakázky ({commitment.months} měs.)</span>
                      <span className="font-jb text-white">{formatKc(finalPrice * commitment.months)}</span>
                    </div>
                  </div>

                  {pdfError && (
                    <p className="flex items-center gap-1.5 text-xs text-rose-400 mb-3">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      PDF se nepodařilo vygenerovat — zkontrolujte připojení k internetu (knihovna se načítá online) a zkuste to znovu.
                    </p>
                  )}

                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-70 px-6 py-3.5 text-sm font-semibold text-white transition-all shadow-lg shadow-violet-900/50"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generuji PDF…
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Generovat objednávku
                      </>
                    )}
                  </button>
                  <p className="text-xs text-zinc-600 text-center mt-3">Vygeneruje se PDF objednávky ke stažení — nejde o daňový doklad.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

/* ============================== SLEVOVÉ KÓDY ============================== */

function CodesView({ codes, insertCode, updateCode, removeCode }) {
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", description: "" });
  const [formError, setFormError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const resetForm = () => {
    setForm({ code: "", type: "percent", value: "", description: "" });
    setFormError("");
    setShowForm(false);
  };

  const handleAddCode = async () => {
    const codeTrimmed = form.code.trim().toUpperCase();
    if (!codeTrimmed) { setFormError("Vyplňte kód."); return; }
    if (codes.some((c) => c.code.toUpperCase() === codeTrimmed)) { setFormError("Tento kód už existuje."); return; }
    const value = Number(form.value);
    if (!value || value <= 0) { setFormError("Zadejte platnou hodnotu slevy."); return; }
    try {
      await insertCode({
        code: codeTrimmed,
        type: form.type,
        value,
        description: form.description.trim() || "Bez popisu",
        active: true,
      });
      resetForm();
      showToast(`Kód ${codeTrimmed} vytvořen.`);
    } catch {
      setFormError("Vytvoření kódu se nepovedlo. Zkuste to prosím znovu.");
      showToast("Vytvoření kódu se nepovedlo.", "error");
    }
  };

  const handleToggleActive = async (c) => {
    setBusyId(c.id);
    try {
      await updateCode(c.id, { active: !c.active });
      showToast(`${c.code}: ${c.active ? "deaktivován" : "aktivován"}.`);
    } catch {
      showToast("Změna se nepovedla.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleRemoveCode = async (id) => {
    const code = codes.find((c) => c.id === id);
    setBusyId(id);
    try {
      await removeCode(id);
      showToast(`${code?.code || "Kód"} smazán.`);
    } catch {
      showToast("Smazání se nepovedlo.", "error");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-white">Slevové kódy</h1>
          <p className="text-zinc-500 text-sm mt-1">Kódy, které Adam může uplatnit přímo v kalkulaci na schůzce.</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors shadow-lg shadow-violet-900/40"
        >
          <Plus className="w-4 h-4" />
          Nový kód
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
            <GlassCard className="p-6">
              <div className="grid sm:grid-cols-4 gap-4 mb-4">
                <Field label="Kód">
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={`${inputClass} font-jb uppercase`} placeholder="PODZIM2026" />
                </Field>
                <Field label="Typ slevy">
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                    <option value="percent">Procentuální</option>
                    <option value="fixed">Pevná částka (Kč)</option>
                  </select>
                </Field>
                <Field label={form.type === "percent" ? "Hodnota (%)" : "Hodnota (Kč)"}>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={`${inputClass} font-jb`} placeholder={form.type === "percent" ? "10" : "500"} />
                </Field>
                <Field label="Popis">
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} placeholder="Podzimní akce" />
                </Field>
              </div>
              {formError && <p className="text-xs text-rose-400 mb-3">{formError}</p>}
              <div className="flex items-center gap-3">
                <button onClick={handleAddCode} className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors">
                  Vytvořit kód
                </button>
                <button onClick={resetForm} className="text-sm text-zinc-500 hover:text-white transition-colors">Zrušit</button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="overflow-hidden">
        <div className="divide-y divide-white/5">
          {codes.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4 flex-wrap">
              <Ticket className={`w-4 h-4 shrink-0 ${c.active ? "text-violet-400" : "text-zinc-600"}`} />
              <div className="w-32 shrink-0">
                <div className={`font-jb text-sm font-semibold ${c.active ? "text-white" : "text-zinc-600"}`}>{c.code}</div>
              </div>
              <div className="font-jb text-sm text-violet-300 w-20 shrink-0">
                {c.type === "percent" ? `${c.value} %` : formatKc(c.value)}
              </div>
              <div className="text-sm text-zinc-500 flex-1">{c.description}</div>
              <button
                onClick={() => handleToggleActive(c)}
                disabled={busyId === c.id}
                className={`text-xs font-medium rounded-full px-3 py-1 border transition-colors shrink-0 disabled:opacity-50 ${
                  c.active ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-zinc-500 bg-white/5"
                }`}
              >
                {c.active ? "Aktivní" : "Neaktivní"}
              </button>
              <button onClick={() => handleRemoveCode(c.id)} disabled={busyId === c.id} className="text-zinc-600 hover:text-rose-400 disabled:opacity-50 transition-colors shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {codes.length === 0 && <div className="px-5 py-8 text-center text-sm text-zinc-500">Zatím žádné slevové kódy.</div>}
        </div>
      </GlassCard>
    </div>
  );
}

/* ============================== ROOT ============================== */

export default function AdminApp() {
  const { session, signOut } = useAuth();
  const currentUserName = displayNameFromEmail(session?.user?.email);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [calcPrefillId, setCalcPrefillId] = useState(null);
  const [presentMode, setPresentMode] = useState(false);

  const tasksTable = useSyncedTable("tasks", INITIAL_TASKS.map(({ id, ...rest }) => rest));
  const clientsTable = useSyncedTable("clients", INITIAL_CLIENTS.map(({ id, ...rest }) => rest));
  const codesTable = useSyncedTable("discount_codes", INITIAL_CODES.map(({ id, ...rest }) => rest));

  const openCalculatorFor = (clientId) => {
    setCalcPrefillId(clientId);
    setActiveTab("kalkulace");
  };

  const goToClient = (clientId) => {
    setSelectedClientId(clientId);
    setActiveTab("klienti");
  };

  if (tasksTable.loading || clientsTable.loading || codesTable.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body antialiased flex">
      {!presentMode && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userEmail={session?.user?.email} onSignOut={signOut} />
      )}

      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            {activeTab === "dashboard" && (
              <Dashboard
                clients={clientsTable.rows}
                tasks={tasksTable.rows}
                updateTask={tasksTable.update}
                setActiveTab={setActiveTab}
                currentUserName={currentUserName}
                goToClient={goToClient}
              />
            )}
            {activeTab === "klienti" && (
              <ClientsView
                clients={clientsTable.rows}
                insertClient={clientsTable.insert}
                updateClient={clientsTable.update}
                removeClient={clientsTable.remove}
                selectedClientId={selectedClientId}
                setSelectedClientId={setSelectedClientId}
                openCalculatorFor={openCalculatorFor}
                currentUserName={currentUserName}
              />
            )}
            {activeTab === "prezentace" && <PresentationView presentMode={presentMode} setPresentMode={setPresentMode} />}
            {activeTab === "kalkulace" && (
              <CalculatorView
                prefillClientId={calcPrefillId}
                codes={codesTable.rows}
                clients={clientsTable.rows}
                insertClient={clientsTable.insert}
                updateClient={clientsTable.update}
                currentUserName={currentUserName}
              />
            )}
            {activeTab === "kody" && (
              <CodesView
                codes={codesTable.rows}
                insertCode={codesTable.insert}
                updateCode={codesTable.update}
                removeCode={codesTable.remove}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {!presentMode && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around py-2">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg ${active ? "text-violet-300" : "text-zinc-500"}`}>
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

/* ============================== EMBEDDED ASSET CONSTANTS ============================== */
/* eslint-disable */
const LOGO_PNG_B64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAADGCAYAAAAqheRqAAAKMWlDQ1BJQ0MgUHJvZmlsZQAAeJydlndUU9kWh8+9N71QkhCKlNBraFICSA29SJEuKjEJEErAkAAiNkRUcERRkaYIMijggKNDkbEiioUBUbHrBBlE1HFwFBuWSWStGd+8ee/Nm98f935rn73P3Wfvfda6AJD8gwXCTFgJgAyhWBTh58WIjYtnYAcBDPAAA2wA4HCzs0IW+EYCmQJ82IxsmRP4F726DiD5+yrTP4zBAP+flLlZIjEAUJiM5/L42VwZF8k4PVecJbdPyZi2NE3OMErOIlmCMlaTc/IsW3z2mWUPOfMyhDwZy3PO4mXw5Nwn4405Er6MkWAZF+cI+LkyviZjg3RJhkDGb+SxGXxONgAoktwu5nNTZGwtY5IoMoIt43kA4EjJX/DSL1jMzxPLD8XOzFouEiSniBkmXFOGjZMTi+HPz03ni8XMMA43jSPiMdiZGVkc4XIAZs/8WRR5bRmyIjvYODk4MG0tbb4o1H9d/JuS93aWXoR/7hlEH/jD9ld+mQ0AsKZltdn6h21pFQBd6wFQu/2HzWAvAIqyvnUOfXEeunxeUsTiLGcrq9zcXEsBn2spL+jv+p8Of0NffM9Svt3v5WF485M4knQxQ143bmZ6pkTEyM7icPkM5p+H+B8H/nUeFhH8JL6IL5RFRMumTCBMlrVbyBOIBZlChkD4n5r4D8P+pNm5lona+BHQllgCpSEaQH4eACgqESAJe2Qr0O99C8ZHA/nNi9GZmJ37z4L+fVe4TP7IFiR/jmNHRDK4ElHO7Jr8WgI0IABFQAPqQBvoAxPABLbAEbgAD+ADAkEoiARxYDHgghSQAUQgFxSAtaAYlIKtYCeoBnWgETSDNnAYdIFj4DQ4By6By2AE3AFSMA6egCnwCsxAEISFyBAVUod0IEPIHLKFWJAb5AMFQxFQHJQIJUNCSAIVQOugUqgcqobqoWboW+godBq6AA1Dt6BRaBL6FXoHIzAJpsFasBFsBbNgTzgIjoQXwcnwMjgfLoK3wJVwA3wQ7oRPw5fgEVgKP4GnEYAQETqiizARFsJGQpF4JAkRIauQEqQCaUDakB6kH7mKSJGnyFsUBkVFMVBMlAvKHxWF4qKWoVahNqOqUQdQnag+1FXUKGoK9RFNRmuizdHO6AB0LDoZnYsuRlegm9Ad6LPoEfQ4+hUGg6FjjDGOGH9MHCYVswKzGbMb0445hRnGjGGmsVisOtYc64oNxXKwYmwxtgp7EHsSewU7jn2DI+J0cLY4X1w8TogrxFXgWnAncFdwE7gZvBLeEO+MD8Xz8MvxZfhGfA9+CD+OnyEoE4wJroRIQiphLaGS0EY4S7hLeEEkEvWITsRwooC4hlhJPEQ8TxwlviVRSGYkNimBJCFtIe0nnSLdIr0gk8lGZA9yPFlM3kJuJp8h3ye/UaAqWCoEKPAUVivUKHQqXFF4pohXNFT0VFysmK9YoXhEcUjxqRJeyUiJrcRRWqVUo3RU6YbStDJV2UY5VDlDebNyi/IF5UcULMWI4kPhUYoo+yhnKGNUhKpPZVO51HXURupZ6jgNQzOmBdBSaaW0b2iDtCkVioqdSrRKnkqNynEVKR2hG9ED6On0Mvph+nX6O1UtVU9Vvuom1TbVK6qv1eaoeajx1UrU2tVG1N6pM9R91NPUt6l3qd/TQGmYaYRr5Grs0Tir8XQObY7LHO6ckjmH59zWhDXNNCM0V2ju0xzQnNbS1vLTytKq0jqj9VSbru2hnaq9Q/uE9qQOVcdNR6CzQ+ekzmOGCsOTkc6oZPQxpnQ1df11Jbr1uoO6M3rGelF6hXrtevf0Cfos/ST9Hfq9+lMGOgYhBgUGrQa3DfGGLMMUw12G/YavjYyNYow2GHUZPTJWMw4wzjduNb5rQjZxN1lm0mByzRRjyjJNM91tetkMNrM3SzGrMRsyh80dzAXmu82HLdAWThZCiwaLG0wS05OZw2xljlrSLYMtCy27LJ9ZGVjFW22z6rf6aG1vnW7daH3HhmITaFNo02Pzq62ZLde2xvbaXPJc37mr53bPfW5nbse322N3055qH2K/wb7X/oODo4PIoc1h0tHAMdGx1vEGi8YKY21mnXdCO3k5rXY65vTW2cFZ7HzY+RcXpkuaS4vLo3nG8/jzGueNueq5clzrXaVuDLdEt71uUnddd457g/sDD30PnkeTx4SnqWeq50HPZ17WXiKvDq/XbGf2SvYpb8Tbz7vEe9CH4hPlU+1z31fPN9m31XfKz95vhd8pf7R/kP82/xsBWgHcgOaAqUDHwJWBfUGkoAVB1UEPgs2CRcE9IXBIYMj2kLvzDecL53eFgtCA0O2h98KMw5aFfR+OCQ8Lrwl/GGETURDRv4C6YMmClgWvIr0iyyLvRJlESaJ6oxWjE6Kbo1/HeMeUx0hjrWJXxl6K04gTxHXHY+Oj45vipxf6LNy5cDzBPqE44foi40V5iy4s1licvvj4EsUlnCVHEtGJMYktie85oZwGzvTSgKW1S6e4bO4u7hOeB28Hb5Lvyi/nTyS5JpUnPUp2Td6ePJninlKR8lTAFlQLnqf6p9alvk4LTduf9ik9Jr09A5eRmHFUSBGmCfsytTPzMoezzLOKs6TLnJftXDYlChI1ZUPZi7K7xTTZz9SAxESyXjKa45ZTk/MmNzr3SJ5ynjBvYLnZ8k3LJ/J9879egVrBXdFboFuwtmB0pefK+lXQqqWrelfrry5aPb7Gb82BtYS1aWt/KLQuLC98uS5mXU+RVtGaorH1futbixWKRcU3NrhsqNuI2ijYOLhp7qaqTR9LeCUXS61LK0rfb+ZuvviVzVeVX33akrRlsMyhbM9WzFbh1uvb3LcdKFcuzy8f2x6yvXMHY0fJjpc7l+y8UGFXUbeLsEuyS1oZXNldZVC1tep9dUr1SI1XTXutZu2m2te7ebuv7PHY01anVVda926vYO/Ner/6zgajhop9mH05+x42Rjf2f836urlJo6m06cN+4X7pgYgDfc2Ozc0tmi1lrXCrpHXyYMLBy994f9Pdxmyrb6e3lx4ChySHHn+b+O31w0GHe4+wjrR9Z/hdbQe1o6QT6lzeOdWV0iXtjusePhp4tLfHpafje8vv9x/TPVZzXOV42QnCiaITn07mn5w+lXXq6enk02O9S3rvnIk9c60vvG/wbNDZ8+d8z53p9+w/ed71/LELzheOXmRd7LrkcKlzwH6g4wf7HzoGHQY7hxyHui87Xe4Znjd84or7ldNXva+euxZw7dLI/JHh61HXb95IuCG9ybv56Fb6ree3c27P3FlzF3235J7SvYr7mvcbfjT9sV3qID0+6j068GDBgztj3LEnP2X/9H686CH5YcWEzkTzI9tHxyZ9Jy8/Xvh4/EnWk5mnxT8r/1z7zOTZd794/DIwFTs1/lz0/NOvm1+ov9j/0u5l73TY9P1XGa9mXpe8UX9z4C3rbf+7mHcTM7nvse8rP5h+6PkY9PHup4xPn34D94Tz+6TMXDkAAOO/SURBVHja7H13eFzF9fY7M7duVZe7sXGhl0DoxQZ+9A42JQVI6J0AoQZJhF6SwBcgQAKEmsiEGsCEgE0ILZSEYgOmuqtZ0q623TIz3x97r7yWZbDN7qr4vnruI9uPrN2dc2bmvKcCAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECDCIQIIlCBAgwAZ6zslgaQIEehIgQIAAAQEJECBAgO97hpE+//5t55zs588yMEKHtY6QNXzHWuhJoCMBAgQIEBCQAAECbICgfYzHb3vkOhAQUfBvfR/08/cAg/teo2uhI+tKQESBXgV6EiBAgACDmID0520ajsSnryd1OHrIAlkOH1kORX3zicd3fV+ToYlwOIx0Ot1XhrKPgSnX8nvf3xFg4AlHocxpn3+j36Ijvb8nHA6TdDq9pshY34f3+XugJwECBAgwSAgI7XP40/4MgyFsoPZ3uazJI+Z7z8QQNWQDWa5ZloFhUdxzia5B55j/50gkwkKhENN1nXHOmZSSdHV1ESklsSwLBb+j8KyTff7cK1Nd10EIkZWVlZIQIhlj3LIsnslkeCqV4p6shWd0romYBLpQXsLRV0eY9xAAzNMRWqgj2WyWZLNZX0fWJhKyilx1XZemaUrTNCWlVFBKhWVZPJvNuj09PaJAT0QBQemrJ4GOBAgQIDjIS/i7Cw0HBYASi8UUIQSVUtIhbLTiOzxkvlG6tt5UOcgJCenngg9kuboMxRCQ5WA+h0g/BJcVPqFQSKmoqFAURVEXLVqEPuuvFjyKoijMNE2mKApTFAWGYdBtttlG++yzz+yuri7huq50XVdks1nhuq4LwAXgFDy972fcuHHSdV23u7vbzWQyrmdYFj6FRqcMyEhZdIT1oydKKBRiFRUVSjgcVj///HPSZ6/26of3nUajUUVRFKooCjFNk2y++eb6N99843Z0dLiu64IQIrLZrMhms9zTkUI94f770XWdjBs3Dul02gn0JECAAAEGnoD4B73W5/BnGNrpO6TP5UEACF3XJSGk10NGCJGWZXHGGE+n0yKVSrl9LqH+LqTB5iErlKXSjyyVDUmWlFJR4BXvz6gIvJ3rrlus4HuvMVlbW6uqqqquWLGCWZbFCmTEAcR/9KMfjdh8883rx44dWzVp0qS62traMeFwuE7TtArGWFzX9RghxCSEqIQQSiklQggppRRSSkdKmbUsK8k5T1qW1Z3JZFpXrFixdMGCBa2LFy/u/OSTT9oeeuihFgCJAsMXuq7z6upqbtu229HRYXvvx/0WfQjw/e4oVvDdd2jRSCSimqap9KMj/trHjzvuuBFbbLFF7ejRo6snT55cV1tbOyocDtfrul6hKEpMVdUYYyzk6QijlBLpQQjhSCldznnSdd2kZVkp27Y7e3p6Wtra2pYtWLBgxZIlSzo/+OCDtqeffroVQKpAj6WvJ47jOO3t7W4BafH1hPfj7AgwMGd/gAABhhEBYZ6RqgMw9txzz4qRI0dGstms5jiOwjmnUsohZbgqioKenh7+7rvv2o7jSADSdV1ZYHC4fR4/VYfE43ESj8cl59zp6uryPWRuwUXU13gBBoeHzJelAsAAoO+2227x+vr6mOu6Q1aWAJDJZMR7771nebKE67p90ycKPZ6+TKiu62T8+PEynU4XypKvwbjgg0iWg4l09PVk+2RWGTVqlO44jtbe3u4bkiaA0JVXXjl2r7322mrMmDGb19TUjDUMY6Su6yMopUYJ3mfOsqzWTCazfMWKFYuXLFky/5VXXvno17/+9TcAsgAyAFBXV0cZY24ikbAzmUyhZ9xF4O3+vjrSNxqmIB8J02KxmJ7JZJRkMulHIUxFUUK/+tWvxu+xxx5bjRo1arO6uroxpmmOUFW1nlJqluKNcs5TlmW1ZrPZ5e3t7UuWLFky/5///Of/brzxxmWFehKLxVg4HHb60ZPCMyPQkwHQtQY0lO3uakKjBMgGL9sGNNCBfg9NaPpO0i+lZAV3f396IgEQQkjgQBhkBEQFoIXD4VA6nVZbWlqurqmpOVpKKbFqfvaQgpQSngcVUkqHc54TQqRd101bltVlWdaKdDrdvmTJkqULFixoX7JkSdd7773X8c9//rMdQNq/UL1cYh6JRNyuri4nnU73vZD6XkpyAPVEBaCNGDHCbGlpURYvXnz5yJEjfzrcZCmlzHHO07ZtZ1zX7crlcivS6XTHsmXLlsyfP7992bJl3f/973/bX3zxRV+WpFCW4XCYd3d32+l02icug02WAw1aQGh7SUckElE1TdM451oikWDeeqk///nPJ+69996Td9pppx3q6up2MgxjNGOsP0OSCyEAgFBK1+d8kwDg/Q7p/Q7Wj7GZy2azy1esWPHmu++++5+XXnrp87vvvvtLADYAFo/HOWPMsW3bSqVSTh9HBA/kv07klBWQDiUcDqu6rmvpdFr1Ih0uAPP888+ftNtuu03efvvtd6itrd1R1/URjDFjbXRECFGoL98KIQQopb3kwPs76e/8E0Jk0ul0a2dn55vvvPPO27Nnz/7iT3/601cALABM13UeDocdy7LsdDptB3pSXszADDYLs8SJuG57CjwuIEzp2ZElVGzBoFIO+88P4FcXzUAzm4WZfENb+z3RoEwAe41CnSTAhRwA+4EArgZTsZBp/jOuPHsGZtJZmMX7Eg9CCJdSng/gCm9v9vdeuXdOPQXgdACCkIBgDjQBoZ7RapimGc5ms8by5ctvGjFixFEb2iK7rtudy+VaMpnMspaWlq+/+eabTx5//PGPH3rooeXehWTByzNPpVJ2Z2enXeAd8z3vhZ7UcnvHfEPRrK6uDq9YsUJZtGjR1WPHjj1hQ5Ol4zhJ27aXZzKZZcuXL/9m0aJFnz733HMf/eEPf1gGIOfJkowbN46kUimrjyz7S9HZEFIA+ot4+KmZ6siRI43Ozk7VsiwBQN96662rr7vuul233nrrPWpra7fWNG1MP6SRF/5uQopvOHjkutcIJISwvi9j2/by9vb2/33yySf/amhoeP2NN95o9/fziBEj3JaWlqwn/8IoWmBgrllHCqMdfoqnNn78eGPhwoXUWy/j4IMPHnXxxRfvPnny5F1qamq2VlW1biB0ZB30ZNmKFSs+mj9//mtXXXXVv75FT5w+50SgJ6XTN3kCrv2LgdAxFrKgJc4ilpBQYcBC+o9/xq9O2dAISAMkbQIRJ+Ka/SjY7IG++igoHDidDuQPHsWvFjaggRZGRKSUhBAipZSTAcz3zqJvQxrAVoSQr6SUNIiIfDeUMmxy6oWwFMdxfM/RmpjkkEX+DgI8hUUBSaCKolREIpGKSCSySV1dHbbaait5wAEH9Pzud7/7ctmyZW/MnTv3vb/85S+fv/7660sB6LquG6FQyFEUxW5vb7cKvGOFxmu5SQgBQIQQDIDmOA7Z0GRJCCGqqsZUVY2Fw+GptbW12GqrreT++++fuvbaa79ubW1947XXXnvvscce+3zu3LmLAWi6rhumabqqqlrt7e2Fnk53AGU5EIZloTdbDYfDmqZpejqd1pcvX+4CCF177bVbzpw5c58xY8YcYBjGiF73EufCk0dvITIhhJX8jedfbxWrRAghC4xOaJo2cvTo0SNHjx59wO677962ZMmSl2bNmjX7sssu+7ilpSUBIF5RUWHbtm1lMplcgVOhbyetDd0JRvvqSCgU0lVV1ROJhLpw4UJ3zJgx1VddddVW+++//4F1dXXTdF2vWpOOkDxYWT5AHz3xyE9fPRk1cuTIUSNHjtxvt912a1u+fPmcp59++oXzzz//fy0tLUkAsYqKCsdxnJwXEekbPRvOZ0SZDeG8ofkTXLczAWbkkBEEIKL0yysEOCWg7oa47ptjFskrMTmOQZMOcm4ZbNA1CwNc6DCrCLIHAbirn33tOxQ+l1L+HcChQghJ+w+ZCgBhzvlhAH4b7LJ1O/xLQzDzxcohwzCiuVwutHDhwmvHjRt3hBBCEELohrLIfkGjd4HkK2H7eMjS6fTHixcvfv/ll1/+59lnn/0B8nnDfNy4cejo6MhlMhmrj3eMl/Fi8mVpVlRUxLq7u43PP//8V5MmTfrRhixLQki/3s5MJvPJsmXL3n/11VdfOfnkk9/zPCN83LhxpL29PZfNZi3kU3b6i4gMp3NltVQrAFp9fX24tbXVNw6jzz777LQddtjh0Orq6l0ZY5pvxAkhuGdI0kGsD0JKKSmlhXrgrlix4o133nnn70cdddTLmUwmCUB6nm4/StbX040NjIj01ZHCqJg+bty40KJFiwgAOnXq1Nq77757/6222mr/ysrKHxaSQSmlAEC9VCgMJT0RQojOzs7X//e//z1/9NFHv5RIJBIAZH19PW9tbc14Z4SDVVOzNjQ9KbYkSAMaSROa5An49dM6jEMcWBwoPVmVgFChURfW3ffjytM3pAiIT/p+hl+Pl6BvULBRAq4ABu5sz8tDIS7cx+/HFTPRT0imoP7jSACPe3cS629/e2fQfwH80LMPAofBWhiW5Th8h3Sb1mJ4yGgejFJKPeNKcs4l51wIIWQ4HN5ik002+enpp59+z4oVKx745z//ecxBBx00ftGiRchkMuF4PB4PhUJh5IvA/S5Ufuegcq0t8QrNA1nmDQnWnyxDodCmkyZN+tFJJ510Z3d390OvvvrqT2bMmDFh0aJFyGazoXg8HusjS6XAUCfD6GzxDUoDgFlZWRmLRqMVra2tZOzYsZXPPPPMkYlE4r6DDz74N3V1ddMZY5q/hlJKeGtMB7k+UEppoR4IKaVSXV29x/7773/T8uXL//zKK6/M3HTTTWtaWlqopmmxysrKKICQty5+mtFQn6ezruSjsEmJ36gkHI/H4wBiixYtwoEHHjjuP//5z8nvv//+w3vuueevKisrfyiEkCIP6e1FNtjJR6Ge+MTJd9zU1NTsvs8++1y/aNGiB55//vmjN91005rW1laqaVq8QE90rNptcIM9f78vZmAWbUKTOBHXT2dQD3TgSIDSNc8vLcVDN7h1n4/5JM+clf/TYY7i4Lz8677a7FEiIYkEpvwcDVV9HCMrGWueSPwLwALvrBdrso2EEFsC2MPLnlCCHTcICAhWHf61wcPznBNKqR8NIZ7hxRljRlVV1bZ77733Nc3Nzfe+++675++3335jEokEy2Qy4fr6+niB8aJjeLQ0Hnay5JxzSqkej8e33GOPPa568MEH7/vvf/970THHHDPek2Wkjyy1YSDLwvoOv12zYZpmuLa2Nt7V1aX39PQYTz311CEffPDBnYcccshNsVhsWwCE5zeA9NeQEDJU9YBKKSXnnEspEYvFtpg+ffq1b7755l3PPffckbZtm11dXXptbW3MNM0w8t299AIiQtdwEQ4n8lFY46EDMKuqqqLRaDSWSCSU+vr6ytdee+1nzc3N9/7whz/8ZSgUmuAZ7b0RsSGnIH2cGISQXj0RQiAWi21xwAEHXP/WW2/d+dRTTx1u27bW1dWlx2Ix31lhFjielA3Sii0CmjFDAJIA4hIFKgOkCO7O0sMv8CaQJ7pwJcHA718CQlwIoULbWkL7BQA5A820z14VXjF6uxBidoE9u9qellK6lFLVdd0Za/q5AANDQPLS8PLpvRzZ4Cl4PE8v45xLf0BaKBSatN1225375JNPPvLee++duvPOO9e3trbSWCwWq6qqCvchIf6lVJaN7XWTCWS3BlkSQlaRpWEY47fZZpsz7r///kc/+uijc6ZPnz7K93RWVVVFCmSplluWRTIqC917frvmUDwej2Wz2XB7ezu9+uqrt29pafndIYcc8tvKysofcs6F67qScy69sDYZDvL37iMmpYQv/3g8vu2BBx54c3t7+5233nrrTu3t7cyPhvUhIWyYOhT61gJpAIxQKBSqra2t6OzsNHp6erS//e1vBy9YsOD+3Xbb7YpwOLyx67qCc+47sNhwOidQUMvk7QMRi8V+cNhhh93c2tp625VXXrl9MpmkmUwmUlFRES0gIcMxYlpyNKCBEhD5c1y/nwJ1XweWJKCMoNxfYBvaugPAz3Dj9gR0RwFBCAgt/7qvQRqAlCA/+jmurZ+Fmbyf9sASACiljwkhHC8K0h+5oF7k/gApZb3XQStwFAwWAhJg7bxjvjfdM9CEaZqjfvCDH1z84osv/uHpp58+IplMap2dnaH6+vrYGjyowaU0eGVZt8UWW5z77LPP3vPiiy8eY9u20dnZadTV1cUBhIeoLAuJR2/Uo6amJp5IJNh2221X/9FHH1146aWX3ltfX78XAMo55/5gwKHszf7OA9aTv+u6QghBampqdj3vvPPu+fTTTy8/+OCDRycSCeZFQ3wSOhz3cSH5UDwdNysrKyOu68ba29vJlVdeucXy5ctvOvLII38bi8U29aKIwleQYX8R5z+mrye0rq5u74aGhj9+8MEHF4wZM6ayu7tbGTNmjB8xDc77dXV+Ij+jqgHNmgAuo2AgKH+XonyRgTQ3pLWfj809/RQ/UaEpgOCD6GCiHI7QYGzkAtMBkJXvt/ce9xtcvAXgfY+QyP4cj1JKTimdwDmfvqGnqwcEZOgbsNQzXqXruiIajW556KGH3rR48eLrf/zjH2/c2tpKa2pq4l4qR6HxEqRkDXJZhsPhqfvuu+91y5cvv+W8887brK2tjUSj0WiBLIdCSlZh21TVe89mZWVlNJvNhjs6Osh99903/ZVXXrlniy22OE1V1YhXI4FydSgaRAYm9SIiglJqTp069YTHHnvsvr/+9a/7+9EQz8sdKpD9cDAwC1OuNE+3Q7FYLN7V1WVIKY233nrrxCuvvPK+ESNGHOhHDb0o4gZ3PxXqiaIo4a222uqMDz744A+33377zkuWLCGapkX7IassuMu/HbO82o9F+PIgBfpuDhyvALr8tQcEbINJzWlAA52FmeJ0NNQBOCA/a4ViYGs/Vn0kKJGQkoGeCED21xjAj2RIKR9APlIv+/kZeKRDAjjJqx0JGkYEBGTIG6+9XlTOORkzZsyh9957771PPfXUoR0dHSybzUYqKysLL6XhmsYxbGTpeXjliBEj9r3pppvuffHFF2f29PSo2Ww2XCBLbRDLsm8hsQ7ArKuri3V1delTpkyp+PDDDy/86U9/eofn0eZeqhXdABzaa5I9KKVUCCFd1+WRSGTi0UcfffuCBQuu2GWXXWq6u7vVsWPHxrBq4fFQTbUh/ZAP3TTNUE1NTTyZTJKLL7546uLFi3+74447XqHreqUXFSNDoai8HHriNbbgVVVV255xxhl/ePPNN0+xbdvMZrN9o99KgSMgQD+YiZniVNytEuASCkI95SQDUvq8AcGPJjgw9lShT3ZhCwKwwUM/AApQAZcAmP5z3LAp+u8UkP8cjvOiEGIFY4yuqRjdu+Z3y+VymxaSlwCDhIAEdQLfq06EOI4jDMMYc8ghh9w8f/78i0KhUKSrq8soyCcvm/c8kMt653/3ylLTtLr/+7//u+7LL7+8or6+vrKrq0v3ZDlYGw34Z3dvl6tQKBSqqamJt7W1kQsvvHCTN9988/Ytt9zyVACa67rCf/+B7Ffm/ruuK6SUZPLkyT95/vnn77jsssu2Wbx4MWpqamJ9ImFDjYT479NPudIAGIZhRDjnkY6ODvrUU08ddPXVV/+xvr5+L8dxpOu6EsOsxqMYegKAeVGz8E477XTx4sWLr91ll13qW1tb1bq6usIzQg0iIWv2wgOQEl1HqdB3dGBLMkDRjw2NhszCTG/WETmegEgCKgdT9GNlFERyDYYG0B8DkM1o7puGxaWU7IYbbljoFaOT/qIbXhMaTikNqap6LCFEzp07N9iTQQRkGAmNUuo4jpRSsk033fTnX3zxxS3HHnvsmEQioXge1OHSVWmDkaXrunLixInHf/TRR7edeeaZGycSCeblfA82WRbWe6jw6j1c1411dHTg0UcfPeiaa675Q1VV1U6O43CZHycbnDP9e7qplJI4jsPj8fi2DQ0Ndz333HNHdXR0UM55xCMhQzXfv7DTlVFRURHJ5XKmaZrh999//4JDDjnkVsMw6h3H4cO9DqgYeuJFzcSYMWMOfuGFF+64/PLLt2hra6M1NTVx9F+cHqCADJ+JhoiAvASAHIjajw157c/AbyZK4AAXDhn8BfjyoHPQEJuZT8Na7UxqamoSiqL0zgPprxbd/zchxMFSysj06dNdLzUrQEBAho3hSqSU0nEcMXLkyOl/+MMfbj/33HMnL168mMVisZhnuAzmFJ4ABbIkhMBxHFFbW7vjDTfccMc111yz1ZIlS6gnS2OQGBirtVA1DCPMOQ/Zts3efvvtU2bOnHmLYRijHMcR3hyPQO++3bgEpZQ5jiN0Xa/Zf//9r3///ffPtm1bz2azIcMwIhh6NUGFkQ8zHo9Hu7u7tZ122ql23rx512277banSil9zz4LtGCt9MQvUuexWGzLK6+88q77779/ekdHhxw1atSa0vY2eDSjmTahSbgwZ2gIbcXhCALCBrLr0oYimD3RwABIG85PNei6BARABukXZQ5soUDfMg1zdwCkn5a8fm3I80KIb3wbrJ9MFf9s28Z13R098hHsx4CADL9LyfOg83g8vvl11133+yuvvHKLZDLJvEhIIQkprPwKMIhlGY1GJ1544YW333TTTdsnk0lSW1vrk5CBGD65JvJhVFZWRnK5nFldXR357LPPLt9hhx0uJoSo3uEbnC3rRkKp67pSSkm33Xbbs7/66qvGTTfdtDKXyxlevv9QcCisVnA+bty4aCKRUM4+++wps2fP/v3o0aP3dxxHFKSUBli3c4LZti1M06w//vjjb3388ccPXbZsmayuru5bExKQEIDMxAxxKhpCHOQiAUElCBnYrbPBXL9kLhr5j3FzGMChBBRkUM/FICAgkuaHIx4PQOZnxqyKfECf2JTSR71/WlM0TXoDi38UFKOvGWWd1Fg4OyJAcS8lx3F4OByecOmll/7Gsqxzb7755k90XY9YliXhtY3znqJuhECWpZGlYRijzjnnnN+pqnreBRdc8G4sFosmk8lCOfqHXzkE0New1CorK8NdXV36iBEj4m+//favxo4de4jjOMLnUoFerN86e1PgxYQJE4586aWXKg866KBfffDBB+3xeDyaSCRIgbxlGeW/tlbVKql5dXV10UWLFpFrr71263PPPffmSCSykW3bveQ00JH1J6u2bQtVVaNHHHHEdbNnzzb333//WaNGjYotW7ZsleO54PsGt9gNaCBNIILjphN0GJtZyAkKn/SSAd0oG8DaMwLinoxbdlOgbenAFgSDvfMhoRw2GOghp+HW0QRkaX5o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";
const FONT_REGULAR_B64 = "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BOcAewTnAHsE5wB7BOcAewfbAHsEZgBxBOwAcQTsAHEE7ABxBOwAcQI5/8cCOQCQAjn/3gI5//QE5QBxBRIAugTlAHEE5QBxBOUAcQTlAHEE5QBxBrQA2QTlAEgFEgCuBRIArgUSAK4FEgCuBLwAPQUUALoEvAA9BXkAEATnAHsFeQAQBOcAewV5ABAE5wB7BZYAcwRmAHEFlgBzBGYAcQWWAHMEZgBxBZYAcwRmAHEGKQDJBRQAcQYzAAoFFABxBQ4AyQTsAHEFDgDJBOwAcQUOAMkE7ABxBQ4AyQTsAHEFDgDJBOwAcQYzAHMFFABxBjMAcwUUAHEGMwBzBRQAcQYzAHMFFABxBgQAyQUS/+UHVADJBY8AeAJc/+QCOf/TAlwAAwI5//ICXP/1Ajn/5AJcALACOQCWAlwAyQI5AMEEuADJBHIAwQJc/5YCOf/bBT8AyQSiALoEogC6BHUAyQI5AMEEdQDJAjkAiAR1AMkDAADBBHUAyQK8AMEEf//yAkYAAgX8AMkFEgC6BfwAyQUSALoF/ADJBRIAugaCAM0F/ADJBRIAugZMAHME5QBxBkwAcwTlAHEGTABzBOUAcQiPAHMILwBxBY8AyQNKALoFjwDJA0oAggWPAMkDSgC6BRQAhwQrAG8FFACHBCsAbwUUAIcEKwBvBRQAhwQrAG8E4//6AyMANwTj//oDIwA3BOP/+gMjADcF2wCyBRIArgXbALIFEgCuBdsAsgUSAK4F2wCyBRIArgXbALIFEgCuBdsAsgUSAK4H6QBEBosAVgTj//wEvAA9BOP//AV7AFwEMwBYBXsAXAQzAFgFewBcBDMAWALRAC8FFAAgBeH/lwV9AMkFFAC6BX0AAAUUAAAFoABzBZYAcwRmAHEGMwAKBo3/lwV9AMkFFABxBOUAcQUOAIMGTAB1BOoApASa/5YC0f9/BjMAcwV+AAgH3wC6AtQAyQJcAAoF9wDJBKIAuQI5AAoEvAA9B8sAsgX8/5YFEgC6BkwAcwdOAGcE5QB2B5cAcwYTAHEFN/+XBRQAuQWPAMkFFAByBCsAZAUOAMkCsP7yAyMANwTjABgDIwA3BOP/+gbdAK0FEgCwBh0ATgXEAMkF8//8BdgAPQV7AFwEMwBYBVQAoAVUAFwEnwBoBDMAcQUXAJYFVABdBJ8AaAQVAFgFFAC6AlwAyQPwAMkDrAAU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";
const FONT_BOLD_B64 = "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BjEACgYxAAoGMQAKBjEACgiuAAAF3wBmBXcAvAV3ALwFdwC8BXcAvAL6ABYC+gC8AvoAAwL6AEEGtAAhBrIAvAbNAGYGzQBmBs0AZgbNAGYGzQBmBrQBAAbNAC0GfwC8Bn8AvAZ/ALwGfwC8Bcv/7AXnALwFwQCsBWYAWAVmAFgFZgBYBWYAWAVmAFgFZgBYCGIAWAS+AFgFbQBYBW0AWAVtAFgFbQBYAr7/1QK+AKwCvv/lAr4AIwV/AFgFsgCsBX8AWAV/AFgFfwBYBX8AWAV/AFgGtADZBX8ATgWyAKAFsgCgBbIAoAWyAKAFNwAZBboArAU3ABkGMQAKBWYAWAYxAAoFZgBYBjEACgVmAFgF3wBmBL4AWAXfAGYEvgBYBd8AZgS+AFgF3wBmBL4AWAakALwFugBcBrQAIQW6AFwFdwC8BW0AWAV3ALwFbQBYBXcAvAVtAFgFdwC8BW0AWAV3ALwFbQBYBpEAZgW6AFwGkQBmBboAXAaRAGYFugBcBpEAZgW6AFwGsgC8BbL/7QfKALwGUgCmAvoAIAK+AAMC+gBBAr4AJAL6ACwCvgAPAvoAvAK+AKwC+gC8Ar4ArAX0ALwFfACsAvr/jQK+/7wGMwC8BVIArAVSAKwFGQC8Ar4ArAUZALwCvgCRBRkAvAPWAKwFGQC8BHQArAUj/6QC+P/bBrIAvAWyAKwGsgC8BbIArAayALwFsgCsB90AaQayAKwFsgCsBs0AZgV/AFgGzQBmBX8AWAbNAGYFfwBYCVYAZgjBAFgGKQC8A/IArAYpALwD8gCRBikAvAPyAKwFwwCTBMMAagXDAJMEwwBqBcMAkwTDAGoFwwCTBMMAagV1AAoD0wAbBXUACgPTABsFdQAKA9MAGwZ/ALwFsgCgBn8AvAWyAKAGfwC8BbIAoAZ/ALwFsgCgBn8AvAWyAKAGfwC8BbIAoAjTAD0HZABIBcv/7AU3ABkFy//sBc0AXASoAFwFzQBcBKgAXAXNAFwEqABcA3sAJwW6ABIGff90BhkAvAW6AKwGGQBRBboANAXfAGYF3wBmBL4AWAa0ACEHCP90Bg4AkAW6AFwFgABYBXcAvAbLAGgFkQCJBXf/jQN7/4sGkQBmBlgABQhcAKwDfAC8Ax0ACgYzALwFUgCsAuIACgS8/+oIVgCqBrL/jQWyAKwGzQBmBv0AbAV/AF8IqQBmB0wAWAZB/3QFugCsBikAvAXDADUEwwAfBXcAvARq/8AD0wAbBacAHgPTABsFdQAKBq8AuwWyAJoGzQA3BoIAvAZh/+wGOgAZBc0AXASoAFwGLgCUBi4AVAUgAEwEqAB1BZEAogYuAFQFIABMBJUASgW6AKwC+gC8BUUAvARaAAoC+gDKDHEAvAtMALwKYgBcCBMAvAfXALwFfACsCawAvAlwALwIcACsBjEACgVmAFgC+gAGAr4ABAbNAGYFfwBYBn8AvAWyAKAGfwC8BbIAoAZ/ALwFsgCgBn8AvAWyAKAGfwC8BbIAoAVtAFgGMQAKBWYAWAYxAAoFZgBYCK4AAAhiAFgGkQBmBboAXAaRAGYFugBcBjMAvAVS//UGzQBmBX8AWAbNAGYFfwBYBi4AlASoAFkCvv+8DHEAvAtMALwKYgBcBpEAZgW6AFwKTwC8BkwAvAayALwFsgCsBjEACgVmAFgIrgAACGIAWAbNAC0FfwBOBjEACgVmAFgGMQAKBWYAWAV3ALwFbQBYBXcAvAVtAFgC+v+tAr7/+QL6AC8CvgAPBs0AZgV/AFgGzQBmBX8AWAYpALwD8gB3BikAvAPyAKwGfwC8BbIAoAZ/ALwFsgCgBcMAkwTDAGoFdQAKA9MAGwWGAIkE3ABlBrIAvAWy/+gGsgCsBusAXAZ5AH0FRQBYBc0AXASoAFwGMQAKBWYAWAV3ALwFbQBYBs0AZgV/AFgGzQBmBX8AWAbNAGYFfwBYBs0AZgV/AFgFy//sBTcAGQPvAKwG7wCsBBgAGwK+/7wItABcCLQAXAYx/+QF3/+7BL7/8gUZ//0Fdf+GBMMAagSoAFwGQQBRBOoAVgYZAAwGfwAwBjEACgV3ALwFbQBYAvr/jQK+/7wG4gBjBlQAXAYpAAwD8v/WBcv/7AU3//cFbQBYBSAAWQMKAIEEAACHBAAAhwQAALAEAADjBAABVgQAAKQEAADBAAD9SwAA/IUAAPwgAAD8ugAA/dQAAP6aAAD9YgYxAAoFdwC8BbIArAYZALwEAABuCAAAbgMKANMDCgCBBUIA0wVCALwIAACiAVb+aAOBADgAAP1tAAD8xQAA/W0AAPykAAD8sgAA/IcAAPyHAAD8sAAA/XcAAPygAAD8CAAA/LAFeAGBAYEBgQE0AWEBQgAAAAEAAAdt/h0AABAh93L5Mg/NAAEAAAAAAAAAAAAAAAAAAAI7AAEElQK8AAUAAAUzBZkAAAEeBTMFmQAAA9cAZgISAAACCwgDAwYEAgIEgAAADwAAAAAAAAAAAAAAAFBmRWQAIAAgICYGFP4UAZoHbQHjAAAAkwAAAAAAAAAAAAIAAAADAAAAFAADAAEAAAAUAAQASAAAAA4ACAACAAYAfgJPIBQgGSAdICb//wAAACAAoCATIBggHCAm////4f/A4hLiD+IN4gUAAQAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAwAAAAAAAP/YAFoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIACAAC//8AAwABAAAADAAAAAAAAAACAAIAAQIPAAECJQIrAAEAAQAAAAoAHAAeAAFERkxUAAgABAAAAAD//wAAAAAAAAABAAAACgCSAJQAFERGTFQAemFyYWIAhGFybW4AhGJyYWkAhGNhbnMAhGNoZXIAhGN5cmwAhGdlb3IAhGdyZWsAhGhhbmkAhGhlYnIAhGthbmEAhGxhbyAAhGxhdG4AhG1hdGgAhG5rbyAAhG9nYW0AhHJ1bnIAhHRmbmcAhHRoYWkAhAAEAAAAAP//AAAAAAAAAAAAAAAA";
