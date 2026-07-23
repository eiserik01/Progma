import React, { useState, useEffect, useRef } from "react";
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
  Globe,
  User,
  Radar,
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
  { id: "google_ads", label: "Google Ads — vyhledávání" },
  { id: "google_display", label: "Google Ads — Display síť" },
  { id: "google_profile", label: "Google profil firmy / SEO" },
  { id: "sklik", label: "Sklik (Seznam.cz)" },
  { id: "meta", label: "Meta — Facebook & Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "tiktok", label: "TikTok" },
];

const TEAM_OWNERS = ["Erik", "Adam", "Mako"];

const LEAD_SOURCES = [
  "Doporučení",
  "Web / poptávkový formulář",
  "Google vyhledávání",
  "Sociální sítě",
  "Veletrh / akce",
  "Studený kontakt",
  "Jiné",
];

const STATUS_META = {
  aktivni: { label: "Aktivní", color: "#34d399" },
  novy_lead: { label: "Nový lead", color: "#c084fc" },
  pozastaveno: { label: "Pozastaveno", color: "#fb7185" },
  ztraceny: { label: "Ztracený lead", color: "#71717a" },
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
  { title: "Marketing, který pracuje, i když vy zrovna ne", image: "/slides/slide-01.jpg" },
  { title: "Kdo jsme?", image: "/slides/slide-02.jpg" },
  { title: "Tým Progma", image: "/slides/slide-03.jpg" },
  { title: "Když si marketing řešíme sami", image: "/slides/slide-04.jpg" },
  { title: "Jak vám s tím pomůžeme", image: "/slides/slide-05.jpg" },
  { title: "Hlavní přínosy", image: "/slides/slide-06.jpg" },
  { title: "Jak vypadá spolupráce?", image: "/slides/slide-07.jpg" },
  { title: "Jaké máme možnosti?", image: "/slides/slide-08.jpg" },
  { title: "Balíčky", image: "/slides/slide-09.jpg" },
  { title: "Kdo nás využije?", image: "/slides/slide-10.jpg" },
  { title: "Pojďte to vyzkoušet!", image: "/slides/slide-11.jpg" },
];

const INITIAL_CODES = [
  { id: 1, code: "LETO2026", type: "percent", value: 10, description: "Letní akce", active: true },
  { id: 2, code: "DOPORUCENI", type: "fixed", value: 500, description: "Sleva za doporučení od stávajícího klienta", active: true },
  { id: 3, code: "VIP2026", type: "percent", value: 15, description: "VIP klient / strategické partnerství", active: true },
  { id: 4, code: "VELETRH2025", type: "fixed", value: 1000, description: "Akce z veletrhu 2025", active: false },
];

// Progma zatím NENÍ s.r.o. — jde o sdružení dvou OSVČ podle § 2716 OZ:
// Erik (Hlavní poskytovatel — jedná navenek, vystavuje faktury) a Adam
// (Spolupracující poskytovatel). Tohle vychází přímo z návrhu smlouvy.
//
// DŮLEŽITÉ: doplňte prosím Erikovy skutečné údaje níže — bez nich nejsou
// generované objednávky, potvrzení ani smlouvy právně přesné. Adamovy údaje
// už jsou vyplněné podle smlouvy.
const SUPPLIER = {
  name: "Erik Eis",
  address: "[DOPLŇTE — sídlo Erika]",
  ico: "[DOPLŇTE IČO Erika]",
  dic: "[DOPLŇTE DIČ, pokud je Erik plátcem DPH]",
  email: "info@progma.cz",
  phone: "+420 722 269 263",
  registry: "[DOPLŇTE — živnostenský úřad, kde je registrace vedena]",
  bank: "[DOPLŇTE bankovní spojení]",
  vatPayer: false,
  invoiceDay: "[DEN]",
  noticePeriodMonths: 2,
  coProvider: {
    name: "Adam Kryštof",
    ico: "23391472",
    address: "Oslavice 199, 594 01",
  },
};

/* ============================== HELPERS ============================== */

function formatKc(n) {
  return n.toLocaleString("cs-CZ") + " Kč";
}

function packageById(id) {
  return PACKAGES.find((p) => p.id === id) || null;
}

function emptyOrderForm() {
  return { company: "", contact: "", ico: "", dic: "", address: "", email: "", phone: "", channels: [], customChannel: "" };
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

const CZ_MONTHS_SHORT = ["led", "úno", "bře", "dub", "kvě", "čvn", "čvc", "srp", "zář", "říj", "lis", "pro"];
function formatMonthLabel(monthStr) {
  if (!monthStr) return "";
  const [y, m] = monthStr.split("-");
  return `${CZ_MONTHS_SHORT[Number(m) - 1] || m} ${y.slice(2)}`;
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
  [SUPPLIER.name, SUPPLIER.address, `IČO: ${SUPPLIER.ico}`, ...(SUPPLIER.vatPayer ? [`DIČ: ${SUPPLIER.dic}`] : []), SUPPLIER.email, SUPPLIER.phone].forEach((t) => {
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

async function generateCooperationConfirmationPdf(client) {
  const JsPDFCtor = await ensureJsPDF();
  const doc = new JsPDFCtor({ unit: "mm", format: "a4" });

  doc.addFileToVFS("DejaVuSans.ttf", FONT_REGULAR_B64);
  doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
  doc.addFileToVFS("DejaVuSans-Bold.ttf", FONT_BOLD_B64);
  doc.addFont("DejaVuSans-Bold.ttf", "DejaVuSans", "bold");
  doc.setFont("DejaVuSans", "normal");

  const marginX = 20;
  const rightX = 190;
  let y = 20;

  const setBold = (size) => { doc.setFont("DejaVuSans", "bold"); doc.setFontSize(size); };
  const setNormal = (size) => { doc.setFont("DejaVuSans", "normal"); doc.setFontSize(size); };
  const wrapped = (text, x, width, size, gap = size * 0.6 + 3) => {
    setNormal(size);
    doc.setTextColor(40, 40, 45);
    const parts = doc.splitTextToSize(text, width);
    parts.forEach((p) => { doc.text(p, x, y); y += gap; });
  };

  try {
    doc.addImage(LOGO_PNG_B64, "PNG", marginX, y - 4, 38, 9.4);
  } catch {
    setBold(14);
    doc.text("PROGMA", marginX, y + 2);
  }
  setBold(15);
  doc.setTextColor(20, 20, 20);
  doc.text("POTVRZENÍ O SPOLUPRÁCI", rightX, y, { align: "right" });
  y += 6;
  setNormal(9);
  doc.setTextColor(110, 110, 115);
  doc.text(`Vystaveno: ${new Date().toLocaleDateString("cs-CZ")}`, rightX, y, { align: "right" });
  y += 18;

  doc.setDrawColor(220, 220, 225);
  doc.line(marginX, y, rightX, y);
  y += 12;

  const pkg = packageById(client.packageId) || packageById(client.potentialPackageId);
  const sinceText = client.since || "zahájení spolupráce";

  setBold(11);
  doc.setTextColor(20, 20, 20);
  doc.text(client.company, marginX, y);
  y += 10;

  const bodyText =
    `${SUPPLIER.name} (IČO ${SUPPLIER.ico}) a ${SUPPLIER.coProvider.name} (IČO ${SUPPLIER.coProvider.ico}), společně podnikající ` +
    `pod obchodní značkou „Progma“, tímto potvrzují, že výše uvedený subjekt${client.ico ? ` (IČO ${client.ico})` : ""} je od ${sinceText} ` +
    `klientem naší agentury${pkg ? ` v rámci balíčku „${pkg.name}“` : ""}, v rámci kterého zajišťujeme marketingové služby ` +
    `a správu online prezentace dle aktuální domluvy mezi oběma stranami.`;
  wrapped(bodyText, marginX, 170, 10.5, 6.2);
  y += 8;

  wrapped(
    "Toto potvrzení slouží jako doklad o probíhající spolupráci a lze jej předložit třetím stranám " +
    "(např. bance, dotačnímu programu, obchodnímu partnerovi) jako důkaz aktivního marketingového zastoupení.",
    marginX, 170, 9.5, 5.6
  );
  y += 16;

  doc.setDrawColor(150, 150, 155);
  doc.line(marginX, y, marginX + 60, y);
  doc.line(120, y, 180, y);
  setNormal(8.5);
  doc.setTextColor(110, 110, 115);
  doc.text("Za poskytovatele — Progma", marginX, y + 5);
  doc.text("Místo, datum", 120, y + 5);

  y += 22;
  setNormal(8);
  doc.setTextColor(140, 140, 145);
  doc.text(`${SUPPLIER.name} · IČO ${SUPPLIER.ico} · ${SUPPLIER.coProvider.name} · IČO ${SUPPLIER.coProvider.ico}`, marginX, y);
  y += 4.5;
  doc.text(`${SUPPLIER.email} · ${SUPPLIER.phone}`, marginX, y);

  const filenameSafe = (client.company || "klient").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  doc.save(`potvrzeni-o-spolupraci-${filenameSafe}.pdf`);
}

// Text smlouvy vychází z vašeho vlastního návrhu (Progma_proces_smlouvaKlient).
// Dynamická pole (klient, balíček, cena, závazek) se doplní z CRM automaticky;
// pole, která ještě nejsou rozhodnutá (Erikovo IČO, DPH, atd.), zůstávají jako
// [DOPLŇTE] — appka je bere z konstanty SUPPLIER výše v souboru.
async function generateContractPdf(client) {
  const JsPDFCtor = await ensureJsPDF();
  const doc = new JsPDFCtor({ unit: "mm", format: "a4" });

  doc.addFileToVFS("DejaVuSans.ttf", FONT_REGULAR_B64);
  doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
  doc.addFileToVFS("DejaVuSans-Bold.ttf", FONT_BOLD_B64);
  doc.addFont("DejaVuSans-Bold.ttf", "DejaVuSans", "bold");
  doc.setFont("DejaVuSans", "normal");

  const marginX = 20;
  const rightX = 190;
  const pageBottom = 280;
  let y = 20;

  const setBold = (size) => { doc.setFont("DejaVuSans", "bold"); doc.setFontSize(size); };
  const setNormal = (size) => { doc.setFont("DejaVuSans", "normal"); doc.setFontSize(size); };
  const ensureSpace = (needed = 6) => {
    if (y + needed > pageBottom) { doc.addPage(); y = 20; }
  };
  const heading = (text, size = 11.5) => {
    ensureSpace(14);
    y += 3;
    setBold(size);
    doc.setTextColor(90, 30, 150);
    doc.splitTextToSize(text, 170).forEach((p) => { ensureSpace(); doc.text(p, marginX, y); y += size * 0.6 + 2; });
    y += 2;
  };
  const para = (text, size = 9.3) => {
    setNormal(size);
    doc.setTextColor(40, 40, 45);
    doc.splitTextToSize(text, 170).forEach((p) => { ensureSpace(); doc.text(p, marginX, y); y += size * 0.58 + 2.1; });
    y += 2.2;
  };
  const listItem = (text, size = 9.3) => {
    setNormal(size);
    doc.setTextColor(40, 40, 45);
    doc.splitTextToSize(text, 160).forEach((p) => { ensureSpace(); doc.text(p, marginX + 5, y); y += size * 0.58 + 2; });
    y += 0.6;
  };
  const tableRow = (label, value, bold = false) => {
    ensureSpace();
    setNormal(9.3);
    doc.setTextColor(40, 40, 45);
    if (bold) setBold(9.3);
    doc.text(label, marginX + 4, y);
    doc.text(value, rightX - 4, y, { align: "right" });
    y += 6;
  };

  const pkg = packageById(client.packageId) || packageById(client.potentialPackageId);
  const commitment = COMMITMENTS.find((c) => c.id === client.commitmentId) || COMMITMENTS[0];
  const basePrice = pkg ? pkg.pricing.none : 0;
  const discountPrice = pkg ? pkg.pricing[commitment.id] ?? basePrice : 0;
  const today = new Date().toLocaleDateString("cs-CZ");
  const vatLine = SUPPLIER.vatPayer ? "je plátcem DPH" : "není plátcem DPH";

  // Header
  try {
    doc.addImage(LOGO_PNG_B64, "PNG", marginX, y - 4, 34, 8.4);
  } catch {
    setBold(13);
    doc.text("PROGMA", marginX, y + 2);
  }
  setBold(13);
  doc.setTextColor(20, 20, 20);
  doc.text("SMLOUVA O POSKYTOVÁNÍ", rightX, y - 2, { align: "right" });
  doc.text("MARKETINGOVÝCH SLUŽEB", rightX, y + 4, { align: "right" });
  y += 14;
  para("uzavřená podle § 1746 odst. 2 zákona č. 89/2012 Sb., občanský zákoník, v platném znění (dále jen „OZ“)", 8);
  y += 2;

  heading("SMLUVNÍ STRANY");
  setBold(9.5); doc.setTextColor(20, 20, 20); doc.text("Poskytovatel:", marginX, y); y += 5.5;
  para(`${SUPPLIER.name}, IČO ${SUPPLIER.ico}, se sídlem ${SUPPLIER.address}, zapsán v živnostenském rejstříku vedeném ${SUPPLIER.registry}, bankovní spojení: ${SUPPLIER.bank} (dále jen „Hlavní poskytovatel“)`);
  para(`a ${SUPPLIER.coProvider.name}, IČO ${SUPPLIER.coProvider.ico}, se sídlem ${SUPPLIER.coProvider.address} (dále jen „Spolupracující poskytovatel“), společně dále jen „Poskytovatel“ nebo „Progma“.`);
  y += 1;
  setBold(9.5); doc.setTextColor(20, 20, 20); doc.text("Klient:", marginX, y); y += 5.5;
  para(`${client.company}, IČO ${client.ico || "[DOPLŇTE]"}, DIČ [DOPLŇTE], se sídlem ${client.address || "[DOPLŇTE]"}, zastoupen: ${client.contact || "[DOPLŇTE]"} (dále jen „Klient“)`);

  heading("PREAMBULE A PRÁVNÍ POSTAVENÍ POSKYTOVATELE");
  para("A. Hlavní poskytovatel a Spolupracující poskytovatel jsou samostatnými podnikateli, kteří se za účelem společného poskytování marketingových služeb sdružili do společnosti podle § 2716 a násl. OZ vystupující pod nezapsanou obchodní značkou „Progma“ (dále jen „Společnost“). Společnost nemá právní osobnost; práva a povinnosti z této Smlouvy vznikají přímo oběma Poskytovatelům.");
  para("B. Poskytovatelé se dohodli, že jednat navenek vůči Klientovi, přijímat plnění, vystavovat faktury a činit veškeré právní úkony podle této Smlouvy je oprávněn Hlavní poskytovatel, a to i s účinky pro Spolupracujícího poskytovatele (§ 2721 OZ). Klient je oprávněn jednat výlučně s Hlavním poskytovatelem a plnit k jeho rukám; takové plnění se považuje za plnění oběma Poskytovatelům.");
  para("C. Poskytovatelé odpovídají Klientovi za splnění závazků z této Smlouvy společně a nerozdílně (§ 2736 OZ). Vnitřní poměry mezi Poskytovateli (dělba práce, podíl na zisku) se řídí jejich samostatnou dohodou a nemají vliv na práva Klienta.");
  para(`D. Klient bere na vědomí, že Poskytovatel ${vatLine}.`);

  heading("ČLÁNEK 1 — PŘEDMĚT SMLOUVY");
  para("1.1 Poskytovatel se zavazuje poskytovat Klientovi marketingové služby v rozsahu zvoleného balíčku dle Přílohy č. 1 (Specifikace plnění) a Klient se zavazuje za tyto služby platit sjednanou odměnu.");
  para("1.2 Předmětem plnění mohou být zejména:");
  listItem("a) Správa sociálních sítí — tvorba obsahového plánu, příprava a publikace příspěvků, komunitní management v rozsahu dle Přílohy č. 1;");
  listItem("b) Tvorba video obsahu — natáčení, střih a postprodukce video materiálů v rozsahu dle Přílohy č. 1;");
  listItem("c) Správa reklamních kampaní — nastavení, správa a optimalizace placených kampaní na platformách Meta (Facebook, Instagram) a Google Ads.");
  y += 1;
  para("1.3 Reklamní rozpočet (media budget) není součástí odměny Poskytovatele. Klient hradí náklady na reklamní systémy přímo provozovatelům platforem z vlastního účtu, nebo je hradí Poskytovateli na základě samostatného vyúčtování, bylo-li tak výslovně sjednáno v Příloze č. 1.");
  para("1.4 Charakter závazku. Poskytovatel poskytuje služby s odbornou péčí, avšak negarantuje konkrétní obchodní výsledek (počet poptávek, obrat, dosah, konverze), neboť ten je závislý na faktorech mimo kontrolu Poskytovatele. Závazek Poskytovatele je závazkem činnostním, nikoli výsledkovým ve smyslu § 2430 OZ. Nedosažení očekávaných výsledků není vadou plnění a nezakládá právo Klienta na slevu z odměny ani na odstoupení od Smlouvy.");
  para("1.5 Práce nad rámec Přílohy č. 1 (dále jen „Vícepráce“) realizuje Poskytovatel pouze na základě předchozího písemného odsouhlasení rozsahu a ceny Klientem; za písemnou formu se pro tento účel považuje i e-mail.");

  heading("ČLÁNEK 2 — DOBA TRVÁNÍ A ZÁVAZKOVÉ OBDOBÍ");
  para(`2.1 Smlouva se uzavírá na dobu neurčitou s účinností od ${today}.`);
  para(`2.2 Klient se zavazuje odebírat služby po dobu minimálního závazkového období v délce ${commitment.months} měsíců (dále jen „Závazkové období“), počítáno od prvního dne měsíce následujícího po nabytí účinnosti Smlouvy. Za toto období mu náleží Zvýhodněná cena dle čl. 3.`);
  para(`2.3 Po uplynutí Závazkového období Smlouva automaticky přechází v závazek na dobu neurčitou s výpovědní dobou ${SUPPLIER.noticePeriodMonths} měsíce (počítanou od prvního dne měsíce následujícího po doručení výpovědi), přičemž Zvýhodněná cena zůstává zachována, nedohodnou-li se strany jinak.`);
  para("2.4 Smluvní strany se mohou písemně dohodnout na sjednání navazujícího Závazkového období s odpovídající úrovní Zvýhodněné ceny.");

  heading("ČLÁNEK 3 — CENA A SLEVOVÝ MODEL");
  para(`3.1 Základní ceníková cena. Základní ceníková cena za plnění dle Přílohy č. 1 činí ${formatKc(basePrice)} měsíčně (dále jen „Základní cena“). Základní cena se uplatní vždy, není-li sjednáno Závazkové období, nebo dojde-li k situaci předvídané v čl. 4.`);
  para("3.2 Zvýhodněná cena. Sjedná-li Klient Závazkové období, náleží mu sleva ze Základní ceny podle následující tabulky:");
  y += 1;
  ensureSpace(8 * (COMMITMENTS.length + 1));
  doc.setFillColor(245, 240, 250);
  doc.rect(marginX, y - 4.5, 170, 6.5 * COMMITMENTS.length + 6, "F");
  tableRow("Závazkové období", "Zvýhodněná cena / měsíc", true);
  if (pkg) {
    COMMITMENTS.forEach((c) => {
      const price = pkg.pricing[c.id];
      const pct = basePrice > 0 ? Math.round((1 - price / basePrice) * 100) : 0;
      tableRow(`${c.label}${c.id === "none" ? "" : ` (sleva ${pct} %)`}`, formatKc(price));
    });
  }
  y += 3;
  para(`Klient tímto sjednává Závazkové období v délce ${commitment.months} měsíců a Zvýhodněnou cenu ve výši ${formatKc(discountPrice)} měsíčně (dále jen „Zvýhodněná cena“).`);
  para("3.3 Povaha slevy. Smluvní strany výslovně prohlašují a shodně konstatují, že Zvýhodněná cena je poskytnuta výhradně jako protiplnění za závazek Klienta setrvat ve smluvním vztahu po celé Závazkové období. Sleva má povahu zálohového zvýhodnění poskytnutého předem, jehož ekonomickým důvodem je delší doba spolupráce umožňující Poskytovateli efektivnější alokaci kapacit a nákladů. Klient tento důvod slevy bere na vědomí a souhlasí s ním.");
  para(`3.4 Splatnost a fakturace. Odměna se hradí měsíčně na základě faktury vystavené Hlavním poskytovatelem vždy k ${SUPPLIER.invoiceDay}. dni kalendářního měsíce, se splatností 14 dnů ode dne vystavení. Odměna je splatná i tehdy, nebyly-li služby čerpány v plném rozsahu z důvodů na straně Klienta (viz čl. 5).`);
  para("3.5 Prodlení. V případě prodlení Klienta s úhradou o více než 10 dnů je Poskytovatel oprávněn:");
  listItem("a) účtovat úrok z prodlení ve výši 0,05 % z dlužné částky za každý den prodlení;");
  listItem("b) po předchozím upozornění (postačí e-mail) přerušit poskytování služeb včetně pozastavení reklamních kampaní, a to až do úplné úhrady. Po dobu přerušení trvá povinnost Klienta hradit odměnu v plné výši a Poskytovatel není v prodlení s plněním.");
  y += 1;
  para("3.6 Indexace. Poskytovatel je oprávněn jednou ročně, vždy k 1. lednu, upravit Základní i Zvýhodněnou cenu o míru inflace vyhlášenou ČSÚ za předchozí kalendářní rok, přesáhla-li 3 %. Zvýšení oznámí Klientovi nejméně 30 dnů předem.");

  heading("ČLÁNEK 4 — SMLUVNÍ POKUTA PŘI PŘEDČASNÉM UKONČENÍ (DOPLATEK SLEVY)");
  para("4.1 Ukončí-li Klient tuto Smlouvu před uplynutím Závazkového období — ať už výpovědí, odstoupením bez zákonného či smluvního důvodu, jednostranným ukončením odběru služeb, nebo dojde-li k ukončení Smlouvy odstoupením Poskytovatele z důvodu porušení povinností Klientem — zaniká zpětně nárok Klienta na Zvýhodněnou cenu.");
  para("4.2 V takovém případě je Klient povinen zaplatit Poskytovateli doplatek slevy, jehož výše se stanoví jako: Doplatek = (Základní cena − Zvýhodněná cena) × počet měsíců, za které již bylo plnění poskytnuto.");
  para("4.3 Smluvní strany výslovně sjednávají, že doplatek slevy dle čl. 4.2 má povahu smluvní pokuty podle § 2048 OZ za porušení povinnosti Klienta setrvat ve smluvním vztahu po Závazkové období. Smluvní strany prohlašují, že výši smluvní pokuty považují s ohledem na hodnotu a význam zajišťované povinnosti za přiměřenou (§ 2051 OZ).");
  para("4.4 Doplatek slevy je splatný do 14 dnů ode dne zániku Smlouvy, na základě faktury Poskytovatele.");
  para("4.5 Ujednáním o smluvní pokutě není dotčeno právo Poskytovatele na náhradu škody vzniklé porušením povinnosti, a to v rozsahu přesahujícím smluvní pokutu (§ 2050 OZ se tímto vylučuje).");
  para("4.6 Výjimky. Doplatek slevy Klient neplatí, pokud Smlouvu ukončí:");
  listItem("a) z důvodu podstatného porušení Smlouvy Poskytovatelem, které Poskytovatel neodstranil ani do 15 dnů od písemné výzvy Klienta;");
  listItem("b) dohodou obou stran, je-li tak výslovně v dohodě uvedeno.");

  heading("ČLÁNEK 5 — SOUČINNOST KLIENTA");
  para("5.1 Klient se zavazuje poskytovat Poskytovateli veškerou součinnost nezbytnou pro řádné plnění, zejména:");
  listItem("a) předávat podklady (fotografie, produktová data, reference, informace o firmě, přístupy) nejpozději do 5 pracovních dnů od vyžádání;");
  listItem("b) zpřístupnit Poskytovateli správcovské přístupy k reklamním účtům, profilům na sociálních sítích a webu (Meta Business Suite, Google Ads, Google Analytics, GBP);");
  listItem("c) schvalovat předložený obsah do 3 pracovních dnů od jeho odeslání;");
  listItem("d) zajistit součinnost při natáčení (dostupnost osob, prostor, techniky) v termínech dohodnutých nejméně 7 dnů předem;");
  listItem("e) určit jednu kontaktní osobu oprávněnou obsah schvalovat.");
  y += 1;
  para("5.2 Fikce schválení. Nevyjádří-li se Klient k předloženému obsahu ve lhůtě dle čl. 5.1 písm. c), považuje se obsah za schválený a Poskytovatel je oprávněn jej publikovat. Klient nemůže následně uplatňovat výhrady k takto schválenému obsahu.");
  para("5.3 Prodlení Klienta se součinností. Neposkytne-li Klient součinnost řádně a včas, platí, že povinnost Klienta hradit měsíční odměnu v plné výši trvá nedotčena, Poskytovatel není v prodlení s plněním, a služby, které nemohly být z tohoto důvodu poskytnuty, se považují za poskytnuté a vyčerpané bez nároku na náhradu či slevu.");
  para("5.4 Trvá-li prodlení Klienta se součinností déle než 30 dnů, je Poskytovatel oprávněn od Smlouvy odstoupit s účinky dle čl. 4.1 (Klient hradí doplatek slevy).");
  para("5.5 Klient odpovídá za správnost, pravdivost a právní bezvadnost podkladů, které Poskytovateli předá. Uplatní-li vůči Poskytovateli třetí osoba nárok z důvodu vady podkladů dodaných Klientem, Klient odškodní Poskytovatele v plném rozsahu včetně nákladů právního zastoupení.");

  heading("ČLÁNEK 6 — AUTORSKÁ PRÁVA A LICENCE");
  para("6.1 Obsah vytvořený Poskytovatelem (videa, grafika, fotografie, texty, kreativy — dále jen „Dílo“) je autorským dílem podle zák. č. 121/2000 Sb., autorský zákon.");
  para("6.2 Odkládací podmínka. Klient nabývá licenci k Dílu až okamžikem úplné úhrady odměny za měsíc, v němž bylo Dílo vytvořeno (§ 548 OZ). Do úplného zaplacení Klient není oprávněn Dílo užívat nad rámec prosté konzumace v rámci kanálů spravovaných Poskytovatelem.");
  para("6.3 Rozsah licence. Po splnění podmínky dle čl. 6.2 poskytuje Poskytovatel Klientovi licenci nevýhradní, územně a časově neomezenou (po dobu trvání majetkových práv), ke všem způsobům užití obvyklým pro marketingovou propagaci Klienta, bez práva poskytnout podlicenci třetí osobě a bez práva Dílo upravovat či zpracovávat bez souhlasu Poskytovatele.");
  para("6.4 Odměna za licenci je zahrnuta v měsíční odměně dle čl. 3.");
  para("6.5 Užije-li Klient Dílo před splněním odkládací podmínky, jde o neoprávněný zásah do autorského práva a Klient je povinen uhradit Poskytovateli smluvní pokutu ve výši dvojnásobku měsíční Základní ceny za každé takové Dílo.");
  para("6.6 Zdrojová data (projektové soubory střihu, vrstvené grafiky, RAW záznamy, surové video materiály) nejsou součástí licence a zůstávají výhradním majetkem Poskytovatele.");
  para("6.7 Reference. Poskytovatel je oprávněn uvádět Klienta (obchodní firmu, logo) a vytvořené Dílo ve svém portfoliu a referencích po celou dobu trvání i po skončení Smlouvy. Klient tento souhlas může písemně odvolat pouze z vážných důvodů.");

  heading("ČLÁNEK 7 — ODPOVĚDNOST A OMEZENÍ NÁHRADY ŠKODY");
  para("7.1 Poskytovatel neodpovídá za jednání, rozhodnutí, sankce ani technické výpadky provozovatelů platforem (Meta, Google), za výsledky kampaní a obchodní výsledky Klienta, za obsah dodaný Klientem, ani za škodu vzniklou v důsledku nesprávných či neúplných informací Klienta.");
  para("7.2 Limitace. Celková výše náhrady škody, kterou je Poskytovatel povinen Klientovi uhradit, je omezena částkou odpovídající součtu odměn skutečně uhrazených Klientem za posledních 3 měsíce předcházejících vzniku škodné události. Toto omezení se neuplatní v případě škody způsobené úmyslně nebo z hrubé nedbalosti.");
  para("7.3 Poskytovatel neodpovídá za nepřímou škodu, ušlý zisk, ztrátu dat ani ztrátu obchodní příležitosti.");

  heading("ČLÁNEK 8 — MLČENLIVOST A OCHRANA ÚDAJŮ");
  para("8.1 Smluvní strany se zavazují zachovávat mlčenlivost o všech důvěrných informacích druhé strany, a to po dobu trvání Smlouvy a 3 roky po jejím skončení.");
  para("8.2 Poskytovatel zpracovává osobní údaje v postavení zpracovatele Klienta v rozsahu nezbytném pro plnění Smlouvy; podrobnosti upravuje Příloha č. 2 — Zpracovatelská smlouva (DPA) dle čl. 28 GDPR.");
  para("8.3 Zákaz obcházení. Klient se zavazuje po dobu trvání Smlouvy a 6 měsíců po jejím skončení přímo neoslovovat ani nezaměstnávat členy realizačního týmu Poskytovatele s nabídkou spolupráce mimo Poskytovatele. Při porušení je Klient povinen uhradit smluvní pokutu ve výši trojnásobku měsíční Základní ceny.");

  heading("ČLÁNEK 9 — UKONČENÍ SMLOUVY A PŘEDÁNÍ");
  para("9.1 Poskytovatel je oprávněn od Smlouvy odstoupit s okamžitou účinností, pokud Klient je v prodlení s úhradou déle než 30 dnů, neposkytuje součinnost déle než 30 dnů, požaduje plnění v rozporu s právními předpisy nebo jedná způsobem poškozujícím dobré jméno Poskytovatele. V těchto případech vzniká nárok na doplatek slevy dle čl. 4.");
  para("9.2 Po skončení Smlouvy a úplném vypořádání všech pohledávek Poskytovatel předá Klientovi správcovské přístupy k účtům vedeným na Klienta, předá Dílo v běžných exportních formátech (MP4, JPG, PNG) a odstraní své administrátorské přístupy.");
  para("9.3 Do úplného vypořádání pohledávek není Poskytovatel povinen předat přístupy, Dílo ani jakékoli podklady; zadržovací právo dle § 1395 OZ se tímto sjednává výslovně.");

  heading("ČLÁNEK 10 — ZÁVĚREČNÁ USTANOVENÍ");
  para("10.1 Smluvní strany prohlašují, že Smlouvu uzavírají v rámci své podnikatelské činnosti. Klient není spotřebitelem ani slabší smluvní stranou dle § 433 OZ.");
  para("10.2 Klient prohlašuje, že měl dostatečnou příležitost se s obsahem Smlouvy seznámit, byl na všechna ustanovení, která by pro něj mohla být neobvyklá — zejména čl. 4, 5.3, 6.2 a 7.2 — výslovně upozorněn a jejich význam mu byl vysvětlen; s těmito ustanoveními souhlasí. Ustanovení § 1799 a § 1800 OZ o adhezních smlouvách se neuplatní.");
  para("10.3 Klient přebírá nebezpečí změny okolností dle § 1765 odst. 2 OZ; nemůže se domáhat obnovení jednání o Smlouvě.");
  para(`10.4 Právní jednání dle této Smlouvy lze činit e-mailem na adresy: Poskytovatel ${SUPPLIER.email}, Klient ${client.email || "[DOPLŇTE]"}. Zpráva se považuje za doručenou následující pracovní den po odeslání. Výpověď a odstoupení musí být doručeny doporučeně poštou nebo datovou schránkou.`);
  para("10.5 Je-li některé ustanovení neplatné či neúčinné, nedotýká se to ostatních; strany nahradí neplatné ustanovení novým, které nejlépe odpovídá jeho hospodářskému účelu.");
  para("10.6 Smlouvu lze měnit pouze písemnými číslovanými dodatky podepsanými oběma stranami. Změny Přílohy č. 1 (rozsah služeb) lze provést i potvrzenou e-mailovou dohodou.");
  para("10.7 Smlouva se řídí právem České republiky. K řešení sporů je místně příslušný soud podle sídla Hlavního poskytovatele (§ 89a o.s.ř.).");
  para("10.8 Smlouva nabývá platnosti a účinnosti dnem podpisu poslední ze smluvních stran.");
  para("10.9 Přílohy: Příloha č. 1 — Specifikace plnění a ceník. Příloha č. 2 — Zpracovatelská smlouva (DPA) — je vedena samostatně mimo tento dokument.");

  y += 8;
  ensureSpace(34);
  doc.setDrawColor(150, 150, 155);
  doc.line(marginX, y, marginX + 60, y);
  doc.line(120, y, 180, y);
  setNormal(8.5);
  doc.setTextColor(110, 110, 115);
  doc.text(`${SUPPLIER.name}, Hlavní poskytovatel`, marginX, y + 5);
  doc.text(`${client.contact || "Klient"}`, 120, y + 5);
  y += 14;
  doc.line(marginX, y, marginX + 60, y);
  doc.text(`${SUPPLIER.coProvider.name}, Spolupracující poskytovatel`, marginX, y + 5);
  y += 16;
  para(`V Brně dne ${today}`, 8.5);

  // Příloha č. 1
  doc.addPage();
  y = 20;
  heading("PŘÍLOHA Č. 1 — SPECIFIKACE PLNĚNÍ A CENÍK", 13);
  para(`Zvolený balíček: ${pkg ? pkg.name : "[DOPLŇTE]"}`, 10.5);
  y += 2;
  if (pkg) {
    setBold(9.5);
    doc.setTextColor(20, 20, 20);
    doc.text("Rozsah služeb:", marginX, y);
    y += 6;
    pkg.features.forEach((f) => listItem(`• ${f}`));
    y += 3;
  }
  heading("Ceny", 10.5);
  tableRow("Základní ceníková cena", `${formatKc(basePrice)} / měsíc`);
  tableRow("Sjednané Závazkové období", `${commitment.months} měsíců`);
  tableRow("Zvýhodněná cena", `${formatKc(discountPrice)} / měsíc`, true);
  tableRow("Rozdíl (základ pro doplatek dle čl. 4)", `${formatKc(basePrice - discountPrice)} / měsíc`);
  y += 4;
  para("Doporučený media budget (nezávazně): [DOPLŇTE] Kč / měsíc — hrazen Klientem přímo platformám.", 9);
  para("Sazby za vícepráce: [DOPLŇTE] Kč / hodina, natáčecí den navíc [DOPLŇTE] Kč.", 9);

  const filenameSafe = (client.company || "klient").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
  doc.save(`smlouva-progma-${filenameSafe}.pdf`);
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
          <div className="font-display text-sm font-semibold text-white">Progma Admin</div>
          <div className="font-jb text-xs uppercase tracking-wider text-zinc-500">Sales &amp; CRM</div>
        </div>
      </div>

      <div className="px-2 lg:px-3 pt-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-500 hover:text-white border border-white/10 hover:border-violet-500/40 hover:bg-white/5 transition-colors"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="hidden lg:inline">Hledat</span>
          <kbd className="hidden lg:inline ml-auto text-[10px] font-jb border border-white/10 rounded px-1.5 py-0.5 text-zinc-600">⌘K</kbd>
        </button>
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

function Dashboard({ clients, tasks, insertTask, updateTask, removeTask, setActiveTab, currentUserName, goToClient }) {
  const { showToast } = useToast();
  const today = new Date().toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const [addingTask, setAddingTask] = useState(false);
  const [taskForm, setTaskForm] = useState({ text: "", assignee: "", due: "", clientId: "" });
  const [taskSaving, setTaskSaving] = useState(false);

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

  const upcomingFollowUps = clients
    .filter((c) => c.nextFollowUp)
    .map((c) => ({ ...c, followUpDate: new Date(c.nextFollowUp) }))
    .sort((a, b) => a.followUpDate.getTime() - b.followUpDate.getTime())
    .slice(0, 6);

  const todayStart = new Date(new Date().toDateString());

  const toggleTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, { done: !task.done }).catch(() => {});
  };

  const handleAddTask = async () => {
    if (!taskForm.text.trim()) return;
    setTaskSaving(true);
    try {
      await insertTask({
        text: taskForm.text.trim(),
        assignee: taskForm.assignee || currentUserName,
        due: taskForm.due.trim() || "Bez termínu",
        done: false,
        clientId: taskForm.clientId ? Number(taskForm.clientId) : null,
      });
      setTaskForm({ text: "", assignee: "", due: "", clientId: "" });
      setAddingTask(false);
      showToast("Úkol přidán.");
    } catch {
      showToast("Přidání úkolu se nepovedlo.", "error");
    } finally {
      setTaskSaving(false);
    }
  };

  const handleRemoveTask = async (id) => {
    try {
      await removeTask(id);
      showToast("Úkol smazán.");
    } catch {
      showToast("Smazání se nepovedlo.", "error");
    }
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
            <div className="flex items-center gap-3">
              <span className="font-jb text-xs text-zinc-500">{openTasks} otevřených</span>
              {!addingTask && (
                <button
                  onClick={() => setAddingTask(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nový úkol
                </button>
              )}
            </div>
          </div>

          {addingTask && (
            <div className="mb-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4 space-y-3">
              <input
                autoFocus
                value={taskForm.text}
                onChange={(e) => setTaskForm({ ...taskForm, text: e.target.value })}
                placeholder="Co je potřeba udělat…"
                className={inputClass}
              />
              <div className="grid sm:grid-cols-3 gap-3">
                <select value={taskForm.assignee} onChange={(e) => setTaskForm({ ...taskForm, assignee: e.target.value })} className={inputClass}>
                  <option value="">Přiřadit komu…</option>
                  {TEAM_OWNERS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <input
                  value={taskForm.due}
                  onChange={(e) => setTaskForm({ ...taskForm, due: e.target.value })}
                  placeholder="Termín (např. Zítra)"
                  className={inputClass}
                />
                <select value={taskForm.clientId} onChange={(e) => setTaskForm({ ...taskForm, clientId: e.target.value })} className={inputClass}>
                  <option value="">Bez klienta</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.company}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddTask}
                  disabled={taskSaving || !taskForm.text.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 text-xs font-semibold text-white transition-colors"
                >
                  {taskSaving ? "Ukládám…" : "Přidat úkol"}
                </button>
                <button
                  onClick={() => { setAddingTask(false); setTaskForm({ text: "", assignee: "", due: "", clientId: "" }); }}
                  className="text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  Zrušit
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {tasks.map((task) => {
              const linkedClient = task.clientId ? clients.find((c) => c.id === task.clientId) : null;
              return (
                <div key={task.id} className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/5 transition-colors group">
                  <button onClick={() => toggleTask(task.id)} className="shrink-0">
                    {task.done ? (
                      <CheckCircle2 className="w-5 h-5 text-violet-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-600" />
                    )}
                  </button>
                  <button onClick={() => toggleTask(task.id)} className="flex-1 min-w-0 text-left">
                    <span className={`text-sm ${task.done ? "text-zinc-600 line-through" : "text-zinc-200"}`}>{task.text}</span>
                  </button>
                  {linkedClient && (
                    <button
                      onClick={() => goToClient(linkedClient.id)}
                      className="text-xs text-violet-300 hover:text-violet-200 font-jb hidden sm:inline shrink-0 max-w-[120px] truncate"
                    >
                      {linkedClient.company}
                    </button>
                  )}
                  <span className="text-xs text-zinc-600 font-jb hidden sm:inline shrink-0">{task.assignee}</span>
                  <span className="text-xs text-zinc-600 shrink-0 w-16 text-right hidden sm:inline">{task.due}</span>
                  <button
                    onClick={() => handleRemoveTask(task.id)}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
            {tasks.length === 0 && <p className="text-sm text-zinc-600 px-3 py-3">Zatím žádné úkoly.</p>}
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

      {upcomingFollowUps.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="w-4 h-4 text-violet-400" />
            <h2 className="font-display text-lg font-semibold text-white">Blíží se kontakt</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingFollowUps.map((c) => {
              const overdue = c.followUpDate < todayStart;
              return (
                <button
                  key={c.id}
                  onClick={() => goToClient(c.id)}
                  className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                    overdue ? "border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50" : "border-white/10 hover:border-violet-500/40"
                  }`}
                >
                  <div className="text-sm font-medium text-white truncate">{c.company}</div>
                  <div className={`text-xs mt-1 font-jb ${overdue ? "text-rose-300" : "text-zinc-500"}`}>
                    {c.followUpDate.toLocaleDateString("cs-CZ")}
                    {overdue ? " — po termínu" : ""}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

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

  const toggleChannel = (id) => {
    setForm((f) => ({
      ...f,
      channels: f.channels.includes(id) ? f.channels.filter((c) => c !== id) : [...f.channels, id],
    }));
  };

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
            <option value="ztraceny">Ztracený lead</option>
          </select>
        </Field>
        <Field label="Telefon"><input value={form.phone} onChange={set("phone")} className={`${inputClass} font-jb`} placeholder="+420 777 123 456" /></Field>
        <Field label="E-mail"><input value={form.email} onChange={set("email")} className={inputClass} placeholder="jan@firma.cz" /></Field>
        <Field label="Web"><input value={form.website} onChange={set("website")} className={inputClass} placeholder="www.firma.cz" /></Field>
        <Field label="Zodpovědná osoba">
          <select value={form.owner} onChange={set("owner")} className={inputClass}>
            <option value="">— Nepřiřazeno —</option>
            {TEAM_OWNERS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Adresa"><input value={form.address} onChange={set("address")} className={inputClass} placeholder="Ulice 123, 602 00 Brno" /></Field>
        </div>
        <Field label="IČO"><input value={form.ico} onChange={set("ico")} className={`${inputClass} font-jb`} placeholder="12345678" /></Field>
        <Field label="DIČ (pokud je plátce DPH)"><input value={form.dic} onChange={set("dic")} className={`${inputClass} font-jb`} placeholder="CZ12345678" /></Field>
        <Field label="Zdroj leadu">
          <select value={form.leadSource} onChange={set("leadSource")} className={inputClass}>
            <option value="">— Neuvedeno —</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Štítky (oddělte čárkou)">
          <input value={form.tags} onChange={set("tags")} className={inputClass} placeholder="VIP, sezónní, follow-up" />
        </Field>
        <Field label="Připomenout další kontakt">
          <input type="date" value={form.nextFollowUp} onChange={set("nextFollowUp")} className={`${inputClass} font-jb`} />
        </Field>
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

      <div>
        <label className="block text-xs font-jb uppercase tracking-wide text-zinc-500 mb-3">Aktivní kanály</label>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {CHANNELS.map((ch) => {
            const checked = form.channels.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
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

function ClientReportView({ client, sortedPerformance, totalLeads, totalSpend, totalRevenue, roiText, maxLeads, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const pkg = packageById(client.packageId) || packageById(client.potentialPackageId);
  const notedEntries = [...sortedPerformance].reverse().filter((r) => r.note);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto">
      <button
        onClick={onClose}
        className="fixed top-6 right-6 inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-zinc-900/80 backdrop-blur-md text-zinc-300 hover:text-white hover:border-violet-400/50 transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
        <div className="text-center mb-14">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-700 mb-6 shadow-lg shadow-violet-900/50">
            <span className="font-display text-lg font-bold text-white">P</span>
          </span>
          <p className="font-jb text-xs uppercase tracking-widest text-violet-400 mb-3">Report spolupráce</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white mb-2">{client.company}</h1>
          {pkg && <p className="text-zinc-500 text-sm">Balíček {pkg.name} · klientem od {client.since}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="font-display text-3xl sm:text-4xl font-semibold text-white mb-1">{totalLeads}</div>
            <div className="text-xs text-zinc-500">poptávek celkem</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="font-display text-2xl sm:text-3xl font-semibold text-white mb-1">{formatKc(totalSpend)}</div>
            <div className="text-xs text-zinc-500">investice celkem</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <div className="font-display text-2xl sm:text-3xl font-semibold text-white mb-1">{formatKc(totalRevenue)}</div>
            <div className="text-xs text-zinc-500">obrat klienta</div>
          </div>
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-6 text-center">
            <div className="font-display text-3xl sm:text-4xl font-semibold text-violet-300 mb-1">{roiText}</div>
            <div className="text-xs text-violet-300/70">návratnost investice</div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-8">
          <p className="text-sm text-zinc-500 mb-6">Počet nových poptávek podle měsíce spolupráce</p>
          <div className="flex items-end gap-3 sm:gap-4 h-40 mb-3">
            {sortedPerformance.map((r, i) => (
              <div key={r.id} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="font-jb text-sm font-semibold text-violet-200 mb-2">{r.leads}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(r.leads / maxLeads) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                  className="w-full rounded-t-lg bg-gradient-to-t from-violet-700 to-violet-400"
                  style={{ minHeight: r.leads > 0 ? "4px" : "0" }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 sm:gap-4">
            {sortedPerformance.map((r) => (
              <span key={r.id} className="flex-1 text-center text-xs text-zinc-600 font-jb">{formatMonthLabel(r.month)}</span>
            ))}
          </div>
        </div>

        {notedEntries.length > 0 && (
          <div className="space-y-3">
            {notedEntries.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 px-5 py-4">
                <div className="text-xs font-jb text-zinc-600 mb-1">{formatMonthLabel(r.month)}</div>
                <div className="text-sm text-zinc-300">{r.note}</div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-zinc-700 mt-14">Esc pro ukončení prezentace</p>
      </div>
    </div>
  );
}

function ClientsView({ clients, insertClient, updateClient, removeClient, selectedClientId, setSelectedClientId, openCalculatorFor, currentUserName, tasks, insertTask, updateTask, removeTask }) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [search, setSearch] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
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
    setAddingNote(false);
    setNoteText("");
    setAddingTask(false);
    setTaskText("");
    setAddingResult(false);
    setResultForm({ month: "", leads: "", spend: "", revenue: "", note: "" });
    setPresentingReport(false);
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
    website: form.website,
    owner: form.owner,
    leadSource: form.leadSource,
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    channels: form.channels,
    nextFollowUp: form.nextFollowUp || null,
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

  const [confirmationGenerating, setConfirmationGenerating] = useState(false);
  const handleGenerateConfirmation = async () => {
    if (!client) return;
    setConfirmationGenerating(true);
    try {
      await generateCooperationConfirmationPdf(client);
      showToast("Potvrzení o spolupráci staženo.");
    } catch (err) {
      console.error("Generování potvrzení selhalo:", err);
      showToast("Vygenerování potvrzení se nepovedlo.", "error");
    } finally {
      setConfirmationGenerating(false);
    }
  };

  const [contractGenerating, setContractGenerating] = useState(false);
  const handleGenerateContract = async () => {
    if (!client) return;
    setContractGenerating(true);
    try {
      await generateContractPdf(client);
      showToast("Smlouva vygenerována — zkontrolujte pole [DOPLŇTE] před odesláním.");
    } catch (err) {
      console.error("Generování smlouvy selhalo:", err);
      showToast("Vygenerování smlouvy se nepovedlo.", "error");
    } finally {
      setContractGenerating(false);
    }
  };

  const [addingResult, setAddingResult] = useState(false);
  const [resultForm, setResultForm] = useState({ month: "", leads: "", spend: "", revenue: "", note: "" });
  const [resultSaving, setResultSaving] = useState(false);
  const [presentingReport, setPresentingReport] = useState(false);

  const handleAddResult = async () => {
    if (!client || !resultForm.month) return;
    setResultSaving(true);
    try {
      const entry = {
        id: Date.now(),
        month: resultForm.month,
        leads: Number(resultForm.leads) || 0,
        spend: Number(resultForm.spend) || 0,
        revenue: Number(resultForm.revenue) || 0,
        note: resultForm.note.trim(),
      };
      await updateClient(client.id, { performance: [...(client.performance || []), entry] });
      setResultForm({ month: "", leads: "", spend: "", revenue: "", note: "" });
      setAddingResult(false);
      showToast("Výsledek přidán.");
    } catch {
      showToast("Uložení výsledku se nepovedlo.", "error");
    } finally {
      setResultSaving(false);
    }
  };

  const handleRemoveResult = async (id) => {
    if (!client) return;
    try {
      await updateClient(client.id, { performance: (client.performance || []).filter((r) => r.id !== id) });
      showToast("Výsledek smazán.");
    } catch {
      showToast("Smazání se nepovedlo.", "error");
    }
  };

  const handleAddNote = async () => {
    if (!client || !noteText.trim()) return;
    setNoteSaving(true);
    try {
      const today = formatDateCz(new Date());
      await updateClient(client.id, {
        notes: [{ date: today, author: currentUserName, text: noteText.trim() }, ...client.notes],
      });
      setNoteText("");
      setAddingNote(false);
      showToast("Poznámka přidána.");
    } catch {
      showToast("Poznámku se nepovedlo uložit.", "error");
    } finally {
      setNoteSaving(false);
    }
  };

  const [addingTask, setAddingTask] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [taskSaving, setTaskSaving] = useState(false);
  const clientTasks = client ? tasks.filter((t) => t.clientId === client.id) : [];

  const sortedPerformance = client ? [...(client.performance || [])].sort((a, b) => a.month.localeCompare(b.month)) : [];
  const totalLeads = sortedPerformance.reduce((s, r) => s + r.leads, 0);
  const totalSpend = sortedPerformance.reduce((s, r) => s + r.spend, 0);
  const totalRevenue = sortedPerformance.reduce((s, r) => s + r.revenue, 0);
  const maxLeads = Math.max(1, ...sortedPerformance.map((r) => r.leads));
  const roiText = totalSpend > 0 ? `${(totalRevenue / totalSpend).toFixed(1)}×` : "—";

  const handleAddClientTask = async () => {
    if (!client || !taskText.trim()) return;
    setTaskSaving(true);
    try {
      await insertTask({
        text: taskText.trim(),
        assignee: currentUserName,
        due: "Bez termínu",
        done: false,
        clientId: client.id,
      });
      setTaskText("");
      setAddingTask(false);
      showToast("Úkol přidán.");
    } catch {
      showToast("Přidání úkolu se nepovedlo.", "error");
    } finally {
      setTaskSaving(false);
    }
  };

  const toggleClientTask = (task) => {
    updateTask(task.id, { done: !task.done }).catch(() => showToast("Změna se nepovedla.", "error"));
  };

  const removeClientTask = (id) => {
    removeTask(id)
      .then(() => showToast("Úkol smazán."))
      .catch(() => showToast("Smazání se nepovedlo.", "error"));
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

  const createInitial = { company: "", contact: "", industry: "", status: "novy_lead", phone: "", email: "", address: "", ico: "", dic: "", website: "", owner: "", leadSource: "", tags: "", channels: [], nextFollowUp: "", commitmentId: "none", packageId: "" };
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
        website: client.website || "",
        owner: client.owner || "",
        leadSource: client.leadSource || "",
        tags: (client.tags || []).join(", "),
        channels: client.channels || [],
        nextFollowUp: client.nextFollowUp || "",
        commitmentId: client.commitmentId,
        packageId: client.packageId || client.potentialPackageId || "",
      }
    : null;

  const pkg = client ? packageById(client.packageId) : null;
  const potentialPkg = client ? packageById(client.potentialPackageId) : null;
  const commitment = client ? COMMITMENTS.find((c) => c.id === client.commitmentId) || COMMITMENTS[0] : null;

  return (
    <>
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
            { id: "ztraceny", label: "Ztracené" },
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
                  {client.website ? (
                    <a
                      href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border border-white/10 hover:border-violet-500/40 px-4 py-3 transition-colors"
                    >
                      <Globe className="w-4 h-4 text-violet-400 shrink-0" />
                      <span className="text-sm text-zinc-300 truncate">{client.website}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                      <Globe className="w-4 h-4 text-violet-400 shrink-0" />
                      <span className="text-sm text-zinc-300">Web neuveden</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                    <User className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300">{client.owner ? `Má na starosti ${client.owner}` : "Nepřiřazeno"}</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                    <Radar className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="text-sm text-zinc-300">{client.leadSource || "Zdroj leadu neuveden"}</span>
                  </div>
                  {client.nextFollowUp && (() => {
                    const overdue = new Date(client.nextFollowUp) < new Date(new Date().toDateString());
                    return (
                      <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${overdue ? "border-rose-500/30 bg-rose-500/5" : "border-white/10"}`}>
                        <Calendar className={`w-4 h-4 shrink-0 ${overdue ? "text-rose-400" : "text-violet-400"}`} />
                        <span className={`text-sm ${overdue ? "text-rose-300" : "text-zinc-300"}`}>
                          Další kontakt {new Date(client.nextFollowUp).toLocaleDateString("cs-CZ")}
                          {overdue ? " — po termínu" : ""}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {((client.tags && client.tags.length > 0) || (client.channels && client.channels.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {(client.tags || []).map((tag, i) => (
                      <span key={`tag-${i}`} className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                        {tag}
                      </span>
                    ))}
                    {(client.channels || []).map((chId, i) => {
                      const ch = CHANNELS.find((c) => c.id === chId);
                      return ch ? (
                        <span key={`ch-${i}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
                          {ch.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-jb uppercase tracking-wide text-zinc-500">Poznámky ze schůzek</h3>
                    {!addingNote && (
                      <button
                        onClick={() => setAddingNote(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Přidat poznámku
                      </button>
                    )}
                  </div>

                  {addingNote && (
                    <div className="mb-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
                      <textarea
                        autoFocus
                        rows={3}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Co se řešilo, na čem jste se domluvili…"
                        className={`${inputClass} resize-none mb-3`}
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleAddNote}
                          disabled={noteSaving || !noteText.trim()}
                          className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 text-xs font-semibold text-white transition-colors"
                        >
                          {noteSaving ? "Ukládám…" : "Uložit poznámku"}
                        </button>
                        <button
                          onClick={() => { setAddingNote(false); setNoteText(""); }}
                          className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                          Zrušit
                        </button>
                      </div>
                    </div>
                  )}

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

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-jb uppercase tracking-wide text-zinc-500">Úkoly k tomuto klientovi</h3>
                    {!addingTask && (
                      <button
                        onClick={() => setAddingTask(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Přidat úkol
                      </button>
                    )}
                  </div>

                  {addingTask && (
                    <div className="mb-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
                      <input
                        autoFocus
                        value={taskText}
                        onChange={(e) => setTaskText(e.target.value)}
                        placeholder="Co je potřeba udělat…"
                        className={`${inputClass} mb-3`}
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleAddClientTask}
                          disabled={taskSaving || !taskText.trim()}
                          className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 text-xs font-semibold text-white transition-colors"
                        >
                          {taskSaving ? "Ukládám…" : "Uložit úkol"}
                        </button>
                        <button
                          onClick={() => { setAddingTask(false); setTaskText(""); }}
                          className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                          Zrušit
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    {clientTasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 group">
                        <button onClick={() => toggleClientTask(task)} className="shrink-0">
                          {task.done ? (
                            <CheckCircle2 className="w-4 h-4 text-violet-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-600" />
                          )}
                        </button>
                        <span className={`text-sm flex-1 ${task.done ? "text-zinc-600 line-through" : "text-zinc-300"}`}>{task.text}</span>
                        <span className="text-xs text-zinc-600 font-jb shrink-0">{task.assignee}</span>
                        <button
                          onClick={() => removeClientTask(task.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {clientTasks.length === 0 && !addingTask && <p className="text-sm text-zinc-600">Zatím žádné úkoly k tomuto klientovi.</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-jb uppercase tracking-wide text-zinc-500">Výsledky spolupráce</h3>
                    <div className="flex items-center gap-3">
                      {sortedPerformance.length > 0 && (
                        <button
                          onClick={() => setPresentingReport(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors"
                        >
                          <MonitorPlay className="w-3.5 h-3.5" />
                          Prezentovat klientovi
                        </button>
                      )}
                      {!addingResult && (
                        <button
                          onClick={() => setAddingResult(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300 hover:text-violet-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Přidat výsledek
                        </button>
                      )}
                    </div>
                  </div>

                  {addingResult && (
                    <div className="mb-3 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
                      <div className="grid sm:grid-cols-4 gap-3 mb-3">
                        <input
                          type="month"
                          value={resultForm.month}
                          onChange={(e) => setResultForm({ ...resultForm, month: e.target.value })}
                          className={`${inputClass} font-jb`}
                        />
                        <input
                          type="number"
                          value={resultForm.leads}
                          onChange={(e) => setResultForm({ ...resultForm, leads: e.target.value })}
                          placeholder="Počet poptávek"
                          className={inputClass}
                        />
                        <input
                          type="number"
                          value={resultForm.spend}
                          onChange={(e) => setResultForm({ ...resultForm, spend: e.target.value })}
                          placeholder="Investice (Kč)"
                          className={inputClass}
                        />
                        <input
                          type="number"
                          value={resultForm.revenue}
                          onChange={(e) => setResultForm({ ...resultForm, revenue: e.target.value })}
                          placeholder="Obrat klienta (Kč)"
                          className={inputClass}
                        />
                      </div>
                      <input
                        value={resultForm.note}
                        onChange={(e) => setResultForm({ ...resultForm, note: e.target.value })}
                        placeholder="Poznámka (nepovinné)"
                        className={`${inputClass} mb-3`}
                      />
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleAddResult}
                          disabled={resultSaving || !resultForm.month}
                          className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 px-4 py-2 text-xs font-semibold text-white transition-colors"
                        >
                          {resultSaving ? "Ukládám…" : "Uložit výsledek"}
                        </button>
                        <button
                          onClick={() => { setAddingResult(false); setResultForm({ month: "", leads: "", spend: "", revenue: "", note: "" }); }}
                          className="text-xs text-zinc-500 hover:text-white transition-colors"
                        >
                          Zrušit
                        </button>
                      </div>
                    </div>
                  )}

                  {sortedPerformance.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="rounded-xl border border-white/10 px-3 py-2.5">
                          <div className="text-xs text-zinc-500 mb-1">Poptávky celkem</div>
                          <div className="font-jb text-lg font-semibold text-white">{totalLeads}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 px-3 py-2.5">
                          <div className="text-xs text-zinc-500 mb-1">Investice celkem</div>
                          <div className="font-jb text-lg font-semibold text-white">{formatKc(totalSpend)}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 px-3 py-2.5">
                          <div className="text-xs text-zinc-500 mb-1">Obrat klienta</div>
                          <div className="font-jb text-lg font-semibold text-white">{formatKc(totalRevenue)}</div>
                        </div>
                        <div className="rounded-xl border border-white/10 px-3 py-2.5">
                          <div className="text-xs text-zinc-500 mb-1">Návratnost</div>
                          <div className="font-jb text-lg font-semibold text-violet-300">{roiText}</div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 px-4 py-4 mb-3">
                        <div className="flex items-end gap-2 h-20 mb-2">
                          {sortedPerformance.map((r) => (
                            <div key={r.id} className="flex-1 flex flex-col items-center justify-end h-full">
                              <span className="text-xs font-jb text-violet-200 mb-1">{r.leads}</span>
                              <div
                                className="w-full rounded-t-md bg-gradient-to-t from-violet-700 to-violet-400"
                                style={{ height: `${(r.leads / maxLeads) * 100}%`, minHeight: r.leads > 0 ? "4px" : "0" }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {sortedPerformance.map((r) => (
                            <span key={r.id} className="flex-1 text-center text-xs text-zinc-600 font-jb">{formatMonthLabel(r.month)}</span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        {[...sortedPerformance].reverse().map((r) => (
                          <div key={r.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 group">
                            <span className="text-xs font-jb text-zinc-500 w-14 shrink-0">{formatMonthLabel(r.month)}</span>
                            <span className="text-sm text-zinc-300 flex-1 truncate">{r.note || `${r.leads} poptávek, obrat ${formatKc(r.revenue)}`}</span>
                            <button
                              onClick={() => handleRemoveResult(r.id)}
                              className="shrink-0 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    !addingResult && <p className="text-sm text-zinc-600">Zatím žádné zaznamenané výsledky.</p>
                  )}
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
                      onClick={handleGenerateContract}
                      disabled={contractGenerating}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 hover:border-violet-500/40 hover:bg-white/5 disabled:opacity-50 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      {contractGenerating ? "Generuji…" : "Generovat smlouvu"}
                    </button>
                  )}
                  {client.status !== "novy_lead" && (
                    <button
                      onClick={handleGenerateConfirmation}
                      disabled={confirmationGenerating}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 hover:border-violet-500/40 hover:bg-white/5 disabled:opacity-50 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      {confirmationGenerating ? "Generuji…" : "Potvrzení o spolupráci"}
                    </button>
                  )}
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
    {presentingReport && client && (
      <ClientReportView
        client={client}
        sortedPerformance={sortedPerformance}
        totalLeads={totalLeads}
        totalSpend={totalSpend}
        totalRevenue={totalRevenue}
        roiText={roiText}
        maxLeads={maxLeads}
        onClose={() => setPresentingReport(false)}
      />
    )}
    </>
  );
}

/* ============================== PREZENTACE ============================== */

function PresentationView({ presentMode, setPresentMode }) {
  const [slide, setSlide] = useState(0);
  const next = () => setSlide((s) => Math.min(s + 1, SLIDES.length - 1));
  const prev = () => setSlide((s) => Math.max(s - 1, 0));

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && presentMode) setPresentMode(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presentMode]);

  return (
    <div className={`flex flex-col ${presentMode ? "h-screen bg-zinc-950 p-6" : "p-6 lg:p-10"}`}>
      {!presentMode && (
        <div className="mb-6">
          <h1 className="font-display text-2xl lg:text-3xl font-semibold text-white">Prezentace</h1>
          <p className="text-zinc-500 text-sm mt-1">Slide {slide + 1} z {SLIDES.length} · {SLIDES[slide].title}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <GlassCard className="flex-1 flex flex-col items-center justify-center relative overflow-hidden p-2 sm:p-4" style={{ minHeight: "50vh" }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={slide}
              src={SLIDES[slide].image}
              alt={SLIDES[slide].title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-contain rounded-lg"
            />
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
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className="w-1.5 h-1.5 rounded-full transition-colors"
                style={{ background: i === slide ? "#c084fc" : "rgba(255,255,255,0.15)" }}
              />
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
        {!presentMode && <p className="text-center text-xs text-zinc-600 mt-3">Šipky ←/→ nebo mezerník pro listování, Esc pro ukončení celoobrazovkového režimu.</p>}
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
          channels: prefillClient.channels || [],
          customChannel: "",
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
        channels: c.channels || [],
        customChannel: "",
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

  const channelLabels = [
    ...CHANNELS.filter((ch) => orderForm.channels.includes(ch.id)).map((ch) => ch.label),
    ...(orderForm.customChannel.trim() ? [orderForm.customChannel.trim()] : []),
  ];

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
    if (orderForm.channels.length === 0 && !orderForm.customChannel.trim()) e.channels = "Vyberte nebo napište alespoň jeden marketingový kanál.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // This is what makes "Generovat objednávku" more than a PDF export: it writes the
  // result straight into the CRM — updates the matched client, or creates a new one
  // if this order was for someone not yet in the system.
  const syncClientAfterOrder = async () => {
    const today = formatDateCz(new Date());
    const noteText = `Objednávka vygenerována: ${pkg.name} · ${commitment.label} · ${formatKc(finalPrice)}/měsíc. Kanály: ${channelLabels.join(", ")}.`;

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
        channels: orderForm.channels,
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
        channels: orderForm.channels,
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
        channelLabels,
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
            <div className="mt-3">
              <input
                value={orderForm.customChannel}
                onChange={(e) => setOrderForm({ ...orderForm, customChannel: e.target.value })}
                placeholder="Jiný kanál, který tu není (nepovinné)"
                className={inputClass}
              />
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

/* ============================== COMMAND PALETTE ============================== */

function CommandPalette({ clients, setActiveTab, goToClient }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const openHandler = () => setOpen(true);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("open-command-palette", openHandler);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("open-command-palette", openHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const q = query.trim().toLowerCase();

  const sectionResults = NAV_ITEMS.filter((s) => !q || s.label.toLowerCase().includes(q));

  const clientResults = clients
    .filter(
      (c) =>
        !q ||
        c.company.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q) ||
        (c.industry || "").toLowerCase().includes(q)
    )
    .slice(0, 6);

  const goto = (fn) => {
    fn();
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-zinc-950/70 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat klienta nebo sekci…"
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none"
          />
          <kbd className="text-[10px] font-jb text-zinc-600 border border-white/10 rounded px-1.5 py-0.5">Esc</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {clientResults.length > 0 && (
            <div className="px-2 mb-2">
              <div className="px-2.5 py-1.5 text-[10px] font-jb uppercase tracking-wider text-zinc-600">Klienti</div>
              {clientResults.map((c) => (
                <button
                  key={c.id}
                  onClick={() => goto(() => goToClient(c.id))}
                  className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-white/5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="text-sm text-zinc-200 flex-1 truncate">{c.company}</span>
                  <span className="text-xs text-zinc-600 shrink-0">{c.contact}</span>
                </button>
              ))}
            </div>
          )}

          {sectionResults.length > 0 && (
            <div className="px-2">
              <div className="px-2.5 py-1.5 text-[10px] font-jb uppercase tracking-wider text-zinc-600">Sekce</div>
              {sectionResults.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goto(() => setActiveTab(s.id))}
                  className="w-full flex items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-white/5 transition-colors"
                >
                  <s.icon className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span className="text-sm text-zinc-200">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {clientResults.length === 0 && sectionResults.length === 0 && (
            <p className="text-sm text-zinc-600 text-center py-6">Nic nenalezeno.</p>
          )}
        </div>
      </motion.div>
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
      <CommandPalette clients={clientsTable.rows} setActiveTab={setActiveTab} goToClient={goToClient} />

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
                insertTask={tasksTable.insert}
                updateTask={tasksTable.update}
                removeTask={tasksTable.remove}
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
                tasks={tasksTable.rows}
                insertTask={tasksTable.insert}
                updateTask={tasksTable.update}
                removeTask={tasksTable.remove}
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
const LOGO_PNG_B64 = "data:image/png;base64,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jw157c/AbyZK4AAXDhn8BfjyoHPQEJuZT8Na7UxqamoSiqL0zgPprxbd/zchxMFSysj06dNdLzUrQEBAho3hSqSU0nEcMXLkyOl/+MMfbj/33HMnL168mMVisZhnuAzmFJ4ABbIkhMBxHFFbW7vjDTfccMc111yz1ZIlS6gnS2OQGBirtVA1DCPMOQ/Zts3efvvtU2bOnHmLYRijHMcR3hyPQO++3bgEpZQ5jiN0Xa/Zf//9r3///ffPtm1bz2azIcMwIhh6NUGFkQ8zHo9Hu7u7tZ122ql23rx512277banSil9zz4LtGCt9MQvUuexWGzLK6+88q77779/ekdHhxw1atSa0vY2eDSjmTahSbgwZ2gIbcXhCALCBrLr0oYimD3RwABIG85PNei6BARABukXZQ5soUDfMg1zdwCkn5a8fm3I80KIb3wbrJ9MFf9s28Z13R098hHsx4CADL9LyfOg83g8vvl11133+yuvvHKLZDLJvEhIIQkprPwKMIhlGY1GJ1544YW333TTTdsnk0lSW1vrk5CBGD65JvJhVFZWRnK5nFldXR357LPPLt9hhx0uJoSo3uEbnC3rRkKp67pSSkm33Xbbs7/66qvGTTfdtDKXyxlevv9QcCisVnA+bty4aCKRUM4+++wps2fP/v3o0aP3dxxHFKSUBli3c4LZti1M06w//vjjb3388ccPXbZsmayuru5bExKQEIDMxAxxKhpCHOQiAUElCBnYrbPBXL9kLhr5j3FzGMChBBRkUM/FICAgkuaHIx4PQOZnxqyKfECf2JTSR71/WlM0TXoDi38UFKOvGWWd1Fg4OyJAcS8lx3F4OByecOmll/7Gsqxzb7755k90XY9YliXhtY3znqJuhECWpZGlYRijzjnnnN+pqnreBRdc8G4sFosmk8lCOfqHXzkE0New1CorK8NdXV36iBEj4m+//favxo4de4jjOMLnUoFerN86e1PgxYQJE4586aWXKg866KBfffDBB+3xeDyaSCRIgbxlGeW/tlbVKql5dXV10UWLFpFrr71263PPPffmSCSykW3bveQ00JH1J6u2bQtVVaNHHHHEdbNnzzb333//WaNGjYotW7ZsleO54PsGt9gNaCBNIILjphN0GJtZyAkKn/SSAd0oG8DaMwLinoxbdlOgbenAFgSDvfMhoRw2GOghp+HW0QRkaX5o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";
const FONT_REGULAR_B64 = "AAEAAAALAIAAAwAwT1MvMmqcD7cAAIuYAAAAVmNtYXAnFERuAACL8AAAAFRnYXNwAAcABwAAjjgAAAAMZ2x5ZsiteyIAAAC8AAB8LGhlYWQwdeQ4AACByAAAADZoaGVhETAM4wAAi3QAAAAkaG10eEGu3d4AAIIAAAAJcmxvY2HsaQvPAAB9CAAABMBtYXhwAnEAowAAfOgAAAAgbmFtZSftPb4AAIxEAAAB1HBvc3T/2wBaAACOGAAAACAAAgBm/pYEZgWkAAMABwAAExEhESUhESFmBAD8cwMb/OX+lgcO+PJyBikAAgE1AAACAAXVAAMACQAAJTMVIxEzEQMjAwE1y8vLFKIV/v4F1f1x/psBZQACAMUDqgLpBdUAAwAHAAABESMRIREjEQFvqgIkqgXV/dUCK/3VAisAAgCeAAAGFwW+AAMAHwAAASEDIQMDIRMzAyEVIQMhFSEDIxMhAyMTITUhEyE1IRMEF/7dVAElRGgBJGmgZwE4/qFSAT7+m2igZ/7bZ6Fo/sUBYFT+vgFpZgOF/rIDh/5hAZ/+YZr+spn+YgGe/mIBnpkBTpoBnwAAAwCq/tMEbQYUACEAKAAvAAABIwMmJic1FhYXESYmNTQ2NzUzFRYWFxUmJicRFhYVFAYHAxEGBhUUFhcRNjY1NCYCtGQBadJqZtFv3cnazGRdrlNTr1zj1uPWZHR6ceF/gXv+0wEtAi0ttEBBAQHIJKyWo7wO6+gEHxuvKi4E/lUjtJypww8DAAGaDWpYVmDV/k8RblpYaAAFAHH/4wcpBfAACwAXACMAJwAzAAABIgYVFBYzMjY1NCYnMhYVFAYjIiY1NDYBIgYVFBYzMjY1NCYlMwEjEzIWFRQGIyImNTQ2BdFXY2NXVWNjVZ66u52gurv8l1ZjYldXY2QDMaD8WqAfnry7n5+5ugKRlISClZWCg5V/3Lu729u7vNsCYZWChJSUhIGWf/nzBg3bu73a27y63AACAIH/4wX+BfAACQAwAAABBgYVFBYzMjY3AQE2NjczBgIHASMnBgYjIgA1NDY3JiY1NDYzMhYXFSYmIyIGFRQWAfJbVdSgX6ZJ/nsB/DtCBroMaF0BF/yPaOSD8f7OhoYwMt64U6VVV55EaYM7AyNRoViSwj9AAo/9+FnLcoT+/n7+45NZVwET14DhYz99PKLFJCS2LzFvWDNnAAABAMUDqgFvBdUAAwAAAREjEQFvqgXV/dUCKwAAAQCw/vICewYSAA0AAAEGAhUUEhcjJgI1NBI3AnuGgoOFoJaVlJcGEub+Pufn/jvl6wHG4N8BxOwAAAEApP7yAm8GEgANAAATMxYSFRQCByM2EjU0AqSglpWVlqCFg4MGEuz+PN/g/jrr5QHF5+cBwgAAAQA9AkoDwwXwABEAAAEFBQclESMRBSclJTcFETMRJQPD/pkBZzr+sHL+sDoBZ/6ZOgFQcgFQBN/Cw2LL/ocBectiw8JjywF5/ofLAAEA2QAABdsFBAALAAABESEVIREjESE1IREDrgIt/dOo/dMCLQUE/dOq/dMCLaoCLQAAAQCe/xIBwwD+AAUAADczFQMjE/DTpIFS/qz+wAFAAAABAGQB3wJ/AoMAAwAAEyEVIWQCG/3lAoOkAAEA2wAAAa4A/gADAAA3MxUj29PT/v4AAAEAAP9CArIF1QADAAABMwEjAgiq/fiqBdX5bQACAIf/4wSPBfAACwAXAAABIgIREBIzMhIREAInMgAREAAjIgAREAACi5ydnZydnZ2d+wEJ/vf7+/73AQkFUP7N/sz+zf7NATMBMwE0ATOg/nP+hv6H/nMBjQF5AXoBjQABAOEAAARaBdUACgAANyERBTUlMxEhFSH+AUr+mQFlygFK/KSqBHNIuEj61aoAAQCWAAAESgXwABwAACUhFSE1NgA3NjY1NCYjIgYHNTY2MzIEFRQGBwYAAYkCwfxMcwGNM2FNp4Zf03h61FjoARRFWxn+9KqqqncBkTptl0l3lkJDzDEy6MJcpXAd/usAAQCc/+MEcwXwACgAAAEWFhUUBCEiJic1FhYzMjY1NCYjIzUzMjY1NCYjIgYHNTY2MzIEFRQGAz+Ro/7Q/uhex2pUyG2+x7mlrraVnqOYU75yc8lZ5gEMjgMlH8SQ3fIlJcMxMpaPhJWmd3BzeyQmtCAg0bJ8qwAAAgBkAAAEpAXVAAIADQAAAQEhAzMRMxUjESMRITUDBv4CAf41/tXVyf1eBSX84wPN/DOo/qABYMMAAAEAnv/jBGQF1QAdAAATIRUhETY2MzIAFRQAISImJzUWFjMyNjU0JiMiBgfdAxn9oCxYLPoBJP7U/u9ew2hawGutysqtUaFUBdWq/pIPD/7u6vH+9SAgyzEwtpyctiQmAAIAj//jBJYF8AALACQAAAEiBhUUFjMyNjU0JgEVJiYjIgIDNjYzMgAVFAAjIAAREAAhMhYCpIifn4iIn58BCUybTMjTDzuya+EBBf7w4v79/u4BUAEbTJsDO7qiobu7oaK6Anm4JCb+8v7vV13+7+vm/uoBjQF5AWIBpR4AAAEAqAAABGgF1QAGAAATIRUBIwEhqAPA/eLTAf79MwXVVvqBBSsAAwCL/+MEiwXwAAsAIwAvAAABIgYVFBYzMjY1NCYlJiY1NDYzMhYVFAYHFhYVFAQjIiQ1NDYTFBYzMjY1NCYjIgYCi5ClpZCQpqX+pYKR/97f/pGBkqP+9/f3/vekSJGDgpOTgoORAsWah4eam4aHmlYgsoCz0NCzgLIgIsaP2ejo2Y/GAWF0goJ0dIKCAAIAgf/jBIcF8AAYACQAADc1FhYzMhITBgYjIgA1NAAzIAAREAAhIiYBMjY1NCYjIgYVFBbhTJxLyNMPOrJs4P77ARDiAQMBEf6x/uVMnAE+iJ+fiIifnx+4JCYBDQESVlwBD+vmARb+c/6G/p/+Wx4Cl7qiobu7oaK6AAACAPAAAAHDBCMAAwAHAAA3MxUjETMVI/DT09PT/v4EI/4AAgCe/xIBwwQjAAMACQAAEzMVIxEzFQMjE/DT09OkgVIEI/792az+wAFAAAABANkAXgXbBKYABgAACQIVATUBBdv7+AQI+v4FAgPw/pH+k7YB0aYB0QACANkBYAXbA6IAAwAHAAATIRUhFSEVIdkFAvr+BQL6/gOiqPCqAAEA2QBeBdsEpgAGAAATNQEVATUB2QUC+v4EBgPwtv4vpv4vtgFtAAACAJMAAAOwBfAAAwAkAAAlMxUjEyM1NDY3NzY2NTQmIyIGBzU2NjMyFhUUBgcHBgYHBgYVAYfLy8W/OFpaOTODbE+zYV7BZ7jfSFpYLycIBgb+/gGRmmWCVlk1XjFZbkZDvDk4wp9MiVZWLzUZFTw0AAACAIf+nAdxBaIACwBMAAABFBYzMjY1NCYjIgYBBgYjIiY1NDYzMhYXNTMRNjY1NCYnJiQjIgYHBgIVFBIXFgQzMjY3FwYEIyIkJyYCNTQSNzYkMzIEFxYWFRAABQL6jnx7jZB6eY8CITybZ6zX2KtnnDuPkqU/QGj+1bB74mCdsXNtaQEUnYH5aFp9/tmYuf64gICGiH6BAVK91AFre0tP/sL+6AIZj6OkjoylpP5ITUn5yMj6S0yD/SAW37FrvFCDi0FAZv61wZ/+6mpobVdRb2Fng319AUm9tgFKfX+HrqBi5nv++f7QBgACABAAAAVoBdUAAgAKAAABASEBMwEjAyEDIwK8/u4CJf575QI50oj9X4jVBQ79GQOu+isBf/6BAAMAyQAABOwF1QAIABEAIAAAAREhMjY1NCYjAREhMjY1NCYjJSEyFhUUBgcWFhUUBCMhAZMBRKOdnaP+vAErlJGRlP4LAgTn+oB8laX+8Pv96ALJ/d2Hi4yFAmb+Pm9ycXCmwLGJohQgy5jI2gAAAQBz/+MFJwXwABkAAAEVJiYjIAAREAAhMjY3FQYGIyAAERAAITIWBSdm54L/AP7wARABAILnZmrthP6t/noBhgFThu0FYtVfXv7H/tj+2f7HXl/TSEgBnwFnAWgBn0cAAgDJAAAFsAXVAAgAEQAAAREzIAAREAAhJSEgABEQACEhAZP0ATUBH/7h/sv+QgGfAbIBlv5o/lD+YQUv+3cBGAEuASwBF6b+l/6A/n7+lgABAMkAAASLBdUACwAAEyEVIREhFSERIRUhyQOw/RoCx/05Avj8PgXVqv5Gqv3jqgABAMkAAAQjBdUACQAAEyEVIREhFSERI8kDWv1wAlD9sMoF1ar+SKr9NwABAHP/4wWLBfAAHQAAJREhNSERBgQjIAAREAAhMgQXFSYmIyAAERAAITI2BMP+tgISdf7moP6i/nUBiwFekgEHb3D8i/7u/u0BEwESa6jVAZGm/X9TVQGZAW0BbgGZSEbXX2D+zv7R/tL+ziUAAAEAyQAABTsF1QALAAATMxEhETMRIxEhESPJygLeysr9IsoF1f2cAmT6KwLH/TkAAAEAyQAAAZMF1QADAAATMxEjycrKBdX6KwAAAf+W/mYBkwXVAAsAABMzERAGIyM1MzI2NcnKzeNNP4ZuBdX6k/7y9KqWwgABAMkAAAVqBdUACgAAEzMRASEBASEBESPJygKeAQT9GwMa/vb9M8oF1f2JAnf9SPzjAs/9MQABAMkAAARqBdUABQAAEzMRIRUhycoC1/xfBdX61aoAAAEAyQAABh8F1QAMAAATIQEBIREjEQEjAREjyQEtAX0BfwEtxf5/y/5/xAXV/AgD+PorBR/8AAQA+uEAAAEAyQAABTMF1QAJAAATIQERMxEhAREjyQEQApbE/vD9asQF1fsfBOH6KwTh+x8AAAIAc//jBdkF8AALABcAAAEiABEQADMyABEQACcgABEQACEgABEQAAMn3P79AQPc3AEB/v/cAToBeP6I/sb+xf6HAXkFTP64/uX+5v64AUgBGgEbAUik/lv+nv6f/lsBpAFiAWIBpQAAAgDJAAAEjQXVAAgAEwAAAREzMjY1NCYjJSEyBBUUBCMjESMBk/6NmpqN/jgByPsBAf7/+/7KBS/9z5KHhpKm49vd4v2oAAIAc/74BdkF8AALAB0AAAEiABEQADMyABEQABMBIycGBiMgABEQACEgABEQAgMn3P79AQPc3AEB/v8/AQr03SEjEP7F/ocBeQE7AToBeNEFTP64/uX+5v64AUgBGgEbAUj6z/7d7wICAaUBYQFiAaX+W/6e/vz+jgAAAgDJAAAFVAXVABMAHAAAARYWFxMjAyYmIyMRIxEhIBYVFAYBETMyNjU0JiMDjUF7Ps3Zv0qLeNzKAcgBAPyD/Yn+kpWVkgK8FpB+/mgBf5Zi/YkF1dbYjboCT/3uh4ODhQABAIf/4wSiBfAAJwAAARUmJiMiBhUUFhcXFhYVFAQhIiYnNRYWMzI2NTQmJycmJjU0JDMyFgRIc8xfpbN3pnri1/7d/udq74B77HKtvIeae+LKARf1adoFpMU3NoB2Y2UfGSvZttngMC/QRUaIfm58HxgtwKvG5CYAAAH/+gAABOkF1QAHAAADIRUhESMRIQYE7/3uy/3uBdWq+tUFKwAAAQCy/+MFKQXVABEAABMzERQWMzI2NREzERAAISAAEbLLrsPCrsv+3/7m/uX+3wXV/HXw09PwA4v8XP7c/tYBKgEkAAABABAAAAVoBdUABgAAIQEzAQEzAQJK/cbTAdkB2tL9xwXV+xcE6forAAABAEQAAAemBdUADAAAEzMBATMBATMBIwEBI0TMAToBOeMBOgE5zf6J/v7F/sL+BdX7EgTu+xIE7vorBRD68AAAAQA9AAAFOwXVAAsAABMzAQEzAQEjAQEjAYHZAXMBddn+IAIA2f5c/lnaAhUF1f3VAiv9M/z4Anv9hQMdAAAB//wAAATnBdUACAAAAzMBATMBESMRBNkBngGb2f3wywXV/ZoCZvzy/TkCxwAAAQBcAAAFHwXVAAkAABMhFQEhFSE1ASFzBJX8UAPH+z0DsPxnBdWa+2+qmgSRAAEAsP7yAlgGFAAHAAATIRUjETMVIbABqPDw/lgGFI/5/I8AAAEAAP9CArIF1QADAAATASMBqgIIqv34BdX5bQaTAAEAx/7yAm8GFAAHAAABESE1MxEjNQJv/ljv7wYU+N6PBgSPAAEA2QOoBdsF1QAGAAABASMBASMBA7wCH8n+SP5IyQIfBdX90wGL/nUCLQAAAf/s/h0EFP6sAAMAAAEVITUEFPvY/qyPjwABAKoE8AKJBmYAAwAAAQEjAQFvARqZ/roGZv6KAXYAAAIAe//jBC0EewAKACUAAAEiBhUUFjMyNjU1NxEjNQYGIyImNTQ2MyE1NCYjIgYHNTY2MzIWAr7frIFvmbm4uD+8iKzL/fsBAqeXYLZUZb5a8/ACM2Z7YnPZtClM/YGqZmHBor3AEn+LLi6qJyf8AAACALr/4wSkBhQACwAcAAABNCYjIgYVFBYzMjYBNjYzMhIREAIjIiYnFSMRMwPlp5KSp6eSkqf9jjqxe8z//8x7sTq5uQIvy+fny8vn5wJSZGH+vP74/vj+vGFkqAYUAAABAHH/4wPnBHsAGQAAARUmJiMiBhUUFjMyNjcVBgYjIgAREAAhMhYD506dULPGxrNQnU5NpV39/tYBLQEGVaIENawrK+PNzeMrK6okJAE+AQ4BEgE6IwAAAgBx/+MEWgYUABAAHAAAAREzESM1BgYjIgIREBIzMhYBFBYzMjY1NCYjIgYDori4OrF8y///y3yx/cenkpKoqJKSpwO2Al757KhkYQFEAQgBCAFEYf4Vy+fny8vn5wAAAgBx/+MEfwR7ABQAGwAAARUhFhYzMjY3FQYGIyAAERAAMzIAByYmIyIGBwR//LIMzbdqx2Jj0Gv+9P7HASn84gEHuAKliJq5DgJeWr7HNDSuKiwBOAEKARMBQ/7dxJe0rp4AAAEALwAAAvgGFAATAAABFSMiBhUVIRUhESMRIzUzNTQ2MwL4sGNNAS/+0bmwsK69BhSZUGhjj/wvA9GPTrurAAACAHH+VgRaBHsACwAoAAABNCYjIgYVFBYzMjYXEAIhIiYnNRYWMzI2NTUGBiMiAhEQEjMyFhc1MwOipZWUpaWUlaW4/v76YaxRUZ5StbQ5snzO/PzOfLI5uAI9yNzcyMfc3Ov+4v7pHR6zLCq9v1tjYgE6AQMBBAE6YmOqAAABALoAAARkBhQAEwAAAREjETQmIyIGFREjETMRNjYzMhYEZLh8fJWsublCs3XBxgKk/VwCnp+evqT9hwYU/Z5lZO8AAAIAwQAAAXkGFAADAAcAABMzESMRMxUjwbi4uLgEYPugBhTpAAL/2/5WAXkGFAALAA8AABMzERQGIyM1MzI2NREzFSPBuKO1RjFpTLi4BGD7jNbAnGGZBijpAAEAugAABJwGFAAKAAATMxEBMwEBIwERI7q5AiXr/a4Ca/D9x7kGFPxpAeP99P2sAiP93QABAMEAAAF5BhQAAwAAEzMRI8G4uAYU+ewAAAEAugAABx0EewAiAAABNjYzMhYVESMRNCYjIgYVESMRNCYjIgYVESMRMxU2NjMyFgQpRcCCr765cnWPprlyd42mubk/sHl6qwOJfHb14v1cAp6hnL6k/YcCnqKbv6P9hwRgrmdifAAAAQC6AAAEZAR7ABMAAAERIxE0JiMiBhURIxEzFTY2MzIWBGS4fHyVrLm5QrN1wcYCpP1cAp6fnr6k/YcEYK5lZO8AAgBx/+MEdQR7AAsAFwAAASIGFRQWMzI2NTQmJzIAERAAIyIAERAAAnOUrKuVk6ysk/ABEv7u8PH+7wERA9/nycnn6MjH6Zz+yP7s/u3+xwE5ARMBFAE4AAIAuv5WBKQEewAQABwAACURIxEzFTY2MzISERACIyImATQmIyIGFRQWMzI2AXO5uTqxe8z//8x7sQI4p5KSp6eSkqeo/a4GCqpkYf68/vj++P68YQHry+fny8vn5wACAHH+VgRaBHsACwAcAAABFBYzMjY1NCYjIgYBBgYjIgIREBIzMhYXNTMRIwEvp5KSqKiSkqcCczqxfMv//8t8sTq4uAIvy+fny8vn5/2uZGEBRAEIAQgBRGFkqvn2AAABALoAAANKBHsAEQAAASYmIyIGFREjETMVNjYzMhYXA0ofSSycp7m5OrqFEy4cA7QSEcu+/bIEYK5mYwUFAAEAb//jA8cEewAnAAABFSYmIyIGFRQWFxcWFhUUBiMiJic1FhYzMjY1NCYnJyYmNTQ2MzIWA4tOqFqJiWKUP8Sl99haw2xmxmGCjGWrQKuY4M5mtAQ/rigoVFRASSEOKpmJnLYjI741NVlRS1AlDySVgp6sHgABADcAAALyBZ4AEwAAAREhFSERFBYzMxUjIiY1ESM1MxEBdwF7/oVLc7291aKHhwWe/sKP/aCJTpqf0gJgjwE+AAACAK7/4wRYBHsAEwAUAAATETMRFBYzMjY1ETMRIzUGBiMiJgGuuHx8la24uEOxdcHIAc8BugKm/WGfn76kAnv7oKxmY/ADqAABAD0AAAR/BGAABgAAEzMBATMBIz3DAV4BXsP+XPoEYPxUA6z7oAAAAQBWAAAGNQRgAAwAABMzExMzExMzASMDAyNWuObl2ebluP7b2fHy2QRg/JYDavyWA2r7oAOW/GoAAAEAOwAABHkEYAALAAAJAiMBASMBATMBAQRk/msBqtn+uv662QGz/nLZASkBKQRg/d/9wQG4/kgCSgIW/nEBjwABAD3+VgR/BGAADwAABQYGIyM1MzI2NzcBMwEBMwKTTpR8k2xMVDMh/jvDAV4BXsNoyHqaSIZUBE78lANsAAEAWAAAA9sEYAAJAAATIRUBIRUhNQEhcQNq/UwCtPx9ArT9ZQRgqPzbk6gDJQABAQD+sgQXBhQAJAAABRUjIiY1NTQmIyM1MzI2NTU0NjMzFSMiBhUVFAYHFhYVFRQWMwQXPvmpbI49PY9rqfk+RI1WW25vWlaNvpCU3e+XdI9zlfDdk49Yjfidjhkbjpz4jVgAAQEE/h0BrgYdAAMAAAERIxEBrqoGHfgACAAAAAEBAP6yBBcGFAAkAAAFMzI2NTU0NjcmJjU1NCYjIzUzMhYVFRQWMzMVIyIGFRUUBiMjAQBGjFVab29aVYxGP/mnbI4+Po5sp/k/vlaP+JyOGxmOnfiOV4+T3fCVc490l+/dlAABANkB0wXbAzEAHQAAARUGBiMiJyYnJicmIyIGBzU2NjMyFxYXFhcWMzI2Bdtps2FukgsFBw+bXlisYmmzYW6TCgUIDpteVqkDMbJPRDsEAgMFPk1Tsk9FPAQCAwU+TAACATX+iwIABGAAAwAJAAABIzUzESMREzMTAgDLy8sVohQDYv76KwKPAWX+mwAAAgCs/scEIwWYAAYAIQAAJREGBhUUFgEVJiYnAzY2NxUGBgcRIxEmABEQADcRMxMWFgKmk6SkAhBKiEQBRolIQYlNZvH+9wEJ8WYBSYmDA1gS4ri54gOhrCkqA/ygBSonqh4jB/7kASAUATMBAQECATIWAR/+4QQhAAABAIEAAARiBfAAGwAAARUmJiMiBhUVIRUhESEVITUzESM1MzUQNjMyFgROTIg9lHQBh/55Ai38H+zHx9boPZcFtLYpKZvU14/+L6qqAdGP7gEF8x8AAAIAXgBSBLwEsgAjAC8AAAE3FwcWFhUUBgcXBycGBiMiJicHJzcmJjU0NjcnNxc2NjMyFhM0JiMiBhUUFjMyNgN7z3LOJSQmKNFyzzt0PTp4Pc9xzyUlJibPc883dEA8dVybcnCenXFxnAPh0XPOO3c+P3M5z3HPKCYlJc9zzj52OkB0OM5zzyclJP58cJqacHKcnQABAFIAAATDBdUAGAAAASERIxEhNSE1JyE1IQEzAQEzASEVIQcVIQSN/mPJ/mABoFT+tAEI/sO+AXsBeb/+wgEI/rVUAZ8Bx/45Acd7M5t7Akr9RAK8/bZ7mzMAAAIBBP6iAa4FmAADAAcAAAERIxETESMRAa6qqqoBmP0KAvYEAP0KAvYAAAIAXP89A6IF8AALAD4AAAEGBhUUFhc2NjU0JhMVJiYjIgYVFBcWFxYWFRQGBxYWFRQGIyImJzUWFjMyNjU0JycmJjU0NjcmJjU0NjMyFgF7Pz6L+j8+j8xTjzhhbM4aDtODXF0+OcytSZpYV5Q6ZnHdGdaAXVs7O8imSZkDqC5aLkyFhy1bLkuIApOkJydQR1pzDwh3mmVajDU0bUCOqB0dpCcnVExmew54mWZbjzEscEWCnx0AAgDXBUYDKQYQAAMABwAAATMVIyUzFSMCXsvL/nnLywYQysrKAAADARsAAAblBc0AFwAvAEkAAAEyBBcWEhUUAgcGBCMiJCcmAjU0Ejc2JBciBgcGBhUUFhcWFjMyNjc2NjU0JicmJhcVJiYjIgYVFBYzMjY3FQYGIyImNTQ2MzIWBACYAQdtbWxsbW3++ZiY/vltbWxsbW0BB5iD4l5eYGBeXuKDhONeXV1eXF7jp0KCQpWnq5tAekJDiUbY+/vYSYgFzW5tbf76mpj++21tbm5tbQEFmJoBBm1tbmdeXl7lgoHjXl5fX15d4oOF411eXvWBISCvnZ+uHyJ/HRz00NHyHAADAHMB1QM7BfAAAwAeACkAABMhFSEBESM1BgYjIiY1NDYzMzU0JiMiBgc1NjYzMhYFIgYVFBYzMjY1NYsCsP1QAq6VLJBdgJi/vLZ1dT6IREmRRbez/uyhfmJSaIICUHsCuP5AcD9Eh3GHigRbWyIifxwcsPBDT0BNkHIdAAACAJ4AjQQlBCMABgANAAABFQEBFQE1ExUBARUBNQQl/tMBLf4rI/7TAS3+KwQjv/70/vS/AaJSAaK//vT+9L8BolIAAAEA2QEfBdsDXgAFAAATIREjESHZBQKo+6YDXv3BAZUAAQBkAd8CfwKDAAMAABMhFSFkAhv95QKDpAAEARsAAAblBc0AFwAvADgATAAAASIGBwYGFRQWFxYWMzI2NzY2NTQmJyYmJzIEFxYSFRQCBwYEIyIkJyYCNTQSNzYkEyMRMzI2NTQmJzIWFRQGBxYWFxcjJyYmIyMRIxEEAIPiXl5gYF5e4oOE415dXV5cXuOEmAEHbW1sbG1t/vmYmP75bW1sbG1tAQd9e3tuV1hmsK5pYBhDLomsgTtJNkKbBWZeXl7lgoHjXl5fX15d4oOF411eXmdubW3++pqY/vttbW5ubW0BBZiaAQZtbW7+Yv7sPktMP2d3eVZwEQhNSd/RYDP+nANEAAEA1QViAysF9gADAAATIRUh1QJW/aoF9pQAAgDDA3UDPQXwAAsAGgAAASIGFRQWMzI2NTQmJzIWFxYWFRQGIyImNTQ2AgBQbm5QUG5vT0B2Ky4uuYaHtLgFb29QT21tT09wgTEuLXJChLe0h4a6AAACANkAAAXbBQQACwAPAAABESEVIREjESE1IREBIRUhA64CLf3TqP3TAi390wUC+v4FBP59qv59AYOqAYP7pqoAAQBeApwCtAXwABgAAAEhFSE1NjcANTQmIyIGBzU2NjMyFhUUAQYBDAGo/aoiPwFYaFU0ekhNhTmRrv61OAMOcm4fOAExXkJRIyN7HByEbIv+5DAAAQBiAo0CzQXwACgAAAEWFhUUBiMiJic1FhYzMjY1NCYjIzUzMjY1NCYjIgYHNTY2MzIWFRQGAgxcZb6xOX1GNHdDbXhvbFZeXmFkXyhmUUmAN5CpWgRgEm1SfIYVFHkbGk9GSkxsPzw6PRIXcxESdmNFYAABAXME7gNSBmYAAwAAATMBIwKLx/66mQZm/ogAAQCu/lYE5QRgACAAABMRMxEUFjMyNjURMxEUFjMyNjcVBgYjIiYnBgYjIiYnEa64ioeUlbgjJQkgHClJI0VSDzKRYmaPKv5WBgr9SJGUqKgCjfyiPDkLDJQXFk5QT09OTv3XAAEAnv87BDkF1QANAAABIREjESMRIxEmJjU0JAJ5AcCNvo7X6wEEBdX5ZgYf+eEDThHduL7oAAEA2wJIAa4DRgADAAATMxUj29PTA0b+AAEBI/51AsEAAAATAAAhFhYVFAYjIiYnNRYWMzI2NTQmJwJUNzZ4di5XKyJKLzs8Ky0+aTBZWwwMgxEPMC4eVz0AAAEAiQKcAsUF3wAKAAATMxEHNTczETMVIZzM3+aJzf3XAwoCYyl0J/0rbgAAAwBgAdUDZAXwAAMADwAbAAATIRUhATIWFRQGIyImNTQ2FyIGFRQWMzI2NTQmiwKw/VABWLPOzrOz0NCzaX5/aGl9fAJQewQb3b+/29y+v91zoYiFoKCFiaAAAgDBAI0ESAQjAAYADQAAEwEVATUBASUBFQE1AQHBAdX+KwEt/tMBsgHV/isBLf7TBCP+XlL+Xr8BDAEMv/5eUv5evwEMAQz//wCJ/+MHfwXwECYAewAAECcCSwSL/WQQBwJKAzUAAP//AIn/4wc/BfAQJgB7AAAQJwB0BIv9ZBAHAkoDNQAA//8AYv/jB38F8BAmAHUAABAnAksEi/1kEAcCSgM1AAAAAgCP/m4DrARgACAAJAAAATMVFAYHBwYGFRQWMzI2NxUGBiMiJjU0Njc3NjY3NjY1EyM1MwH0vjdaWjozg21OtGBewGe44ElZWDAmCAcGxMrKAs+cZYJXWDVeMVluRkO8OTjCn0yJVlYvNRkVPDYBDv7//wAQAAAFaAdrEiYAJAAAEAcCUQS8AXX//wAQAAAFaAdrEiYAJAAAEAcCTwS8AXX//wAQAAAFaAdtEiYAJAAAEAcCUgS8AXX//wAQAAAFaAdeEiYAJAAAEAcCUAS8AXX//wAQAAAFaAdOEiYAJAAAEAcCTgS8AXUAAwAQAAAFaAdtAAsADgAhAAABNCYjIgYVFBYzMjYDASEBJiY1NDYzMhYVFAYHASMDIQMjA1RZP0BXWD8/WZj+8AIh/lg9Pp9zcqE/PAIU0oj9X4jVBlo/WVdBP1hY/vP9GQNOKXNJc6ChckZ2KfqLAX/+gQACAAgAAAdIBdUADwATAAABFSERIRUhESEVIREhAyMBFwEhEQc1/RsCx/05Avj8Pf3woM0CcYv+tgHLBdWq/kaq/eOqAX/+gQXVnvzwAxAA//8Ac/51BScF8BImACYAABAHAHoBLQAA//8AyQAABIsHaxImACgAABAHAlEEngF1//8AyQAABIsHaxImACgAABAHAk8EngF1//8AyQAABIsHbRImACgAABAHAlIEngF1//8AyQAABIsHThImACgAABAHAk4EngF1//8AOwAAAboHaxImACwAABAHAlEDLwF1//8AogAAAh8HaxImACwAABAHAk8DLwF1/////gAAAmAHbRImACwAABAHAlIDLwF1//8ABgAAAlgHThImACwAABAHAk4DLwF1AAIACgAABboF1QAMABkAABMhIAAREAAhIREjNTMTESEVIREzIAAREAAh0wGgAbEBlv5p/lD+YMnJywFQ/rDzATUBH/7h/ssF1f6X/oD+fv6WAryQAeP+HZD96gEYAS4BLAEXAP//AMkAAAUzB14SJgAxAAAQBwJQBP4Bdf//AHP/4wXZB2sSJgAyAAAQBwJRBScBdf//AHP/4wXZB2sSJgAyAAAQBwJPBScBdf//AHP/4wXZB20SJgAyAAAQBwJSBScBdf//AHP/4wXZB14SJgAyAAAQBwJQBScBdf//AHP/4wXZB04SJgAyAAAQBwJOBScBdQABARkAPwWcBMUACwAACQIHAQEnAQE3AQEFnP43Acl3/jX+NXYByP44dgHLAcsETP41/jd5Acv+NXkByQHLef41AcsAAAMAZv+6BeUGFwAJABMAKwAAAQEWFjMyABE0JicmJiMiABEUFhcHJgI1EAAhMhYXNxcHFhIVEAAhIiYnBycEtv0zPqFf3AEBJ3k9oV/c/v0nJ4ZOTwF5ATuC3VeiZqpOUP6I/saA3VuiZwRY/LJAQwFIARpwuLhAQ/64/uVwvESeZgEIoAFiAaVNS79Zxmf+9p7+n/5bS0u/WP//ALL/4wUpB2sSJgA4AAAQBwJRBO4Bdf//ALL/4wUpB2sSJgA4AAAQBwJPBO4Bdf//ALL/4wUpB20SJgA4AAAQBwJSBO4Bdf//ALL/4wUpB04SJgA4AAAQBwJOBO4Bdf////wAAATnB2sSJgA8AAAQBwJPBHMBdQACAMkAAASNBdUADAAVAAATMxEzMgQVFAQjIxEjExEzMjY1NCYjycr++wEB/v/7/srK/o2amY4F1f744dzc4v6uBCf90ZKGhpEAAAEAuv/jBKwGFAAvAAATNDYzMhYXBgYVFBYXFxYWFRQGIyImJzUWFjMyNjU0JicnJiY1NDY3JiYjIgYVESO679rQ2wOXqDpBOaZg4dNAiElQjEF0eDtlXGBXp5cIg3GCiLsEccjb6OAIc2AvUSolao5krLcZGKQeHV9bP1Q+NzuHW3+sHWdwi4P7kwD//wB7/+MELQZmEiYARAAAEAYAQ1IA//8Ae//jBC0GZhImAEQAABAGAHZSAP//AHv/4wQtBmYSJgBEAAAQBgIVUgD//wB7/+MELQY3EiYARAAAEAYCGlIA//8Ae//jBC0GEBImAEQAABAGAGpSAP//AHv/4wQtBwYSJgBEAAAQBgIYUgAAAwB7/+MHbwR7AAYAMwA+AAABJiYjIgYHAzY2MzIAFRUhFhYzMjY3FQYGIyImJwYGIyImNTQ2MyE1NCYjIgYHNTY2MzIWAyIGFRQWMzI2NTUGtgGliZm5DkRK1ITiAQj8sgzMt2jIZGTQaqf4TUnYj73S/fsBAqeXYLZUZb5ajtXv36yBb5m5ApSXtK6eATBaXv7d+lq/yDU1rioseXd4eLuovcASf4suLqonJ2D+GGZ7YnPZtCkA//8Acf51A+cEexImAEYAABAHAHoAjwAA//8Acf/jBH8GZhImAEgAABAHAEMAiwAA//8Acf/jBH8GZhImAEgAABAHAHYAiwAA//8Acf/jBH8GZhImAEgAABAHAhUAiwAA//8Acf/jBH8GEBImAEgAABAHAGoAiwAA////xwAAAaYGZhAnAEP/HQAAEgYA8wAA//8AkAAAAm8GZhAnAHb/HQAAEgYA8wAA////3gAAAlwGZhImAPMAABAHAhX/HQAA////9AAAAkYGEBImAPMAABAHAGr/HQAAAAIAcf/jBHUGFAAOACgAAAEmJiMiBhUUFjMyNjU0JhMWEhUUACMiADU0ADMyFhcnBSclJzMXJRcFA0YyWCmnua6Ska42CX5y/uTm5/7lARTdEjQqn/7BIQEZteR/AU0h/tkDkxEQ2MO83t68erwBJo/+4K3//skBN//6ATcFBbRrY1zMkW9hYv//ALoAAARkBjcSJgBRAAAQBwIaAJgAAP//AHH/4wR1BmYSJgBSAAAQBgBDcwD//wBx/+MEdQZmEiYAUgAAEAYAdnMA//8Acf/jBHUGZhImAFIAABAGAhVzAP//AHH/4wR1BjcSJgBSAAAQBgIacwD//wBx/+MEdQYQEiYAUgAAEAYAanMAAAMA2QCWBdsEbwADAAcACwAAATMVIxEzFSMBIRUhAt/29vb2/foFAvr+BG/2/hL1AkGqAAADAEj/ogScBLwACQATACsAAAEBFhYzMjY1NCYnJiYjIgYVFBYXByYmNRAAMzIWFzcXBxYWFRAAIyImJwcnA4n+GSlnQZOsFFwqZz6XqRMUfTY2ARHxXZ9Di1+SNTb+7vBgoT+LYAMh/bAqKOjIT3WaKSnr00huLpdNxXcBFAE4MzSoT7NNxnj+7f7HNDOoTv//AK7/4wRYBmYSJgBYAAAQBgBDewD//wCu/+MEWAZmEiYAWAAAEAYAdnsA//8Arv/jBFgGZhImAFgAABAGAhV7AP//AK7/4wRYBhASJgBYAAAQBgBqewD//wA9/lYEfwZmEiYAXAAAEAYAdl4AAAIAuv5WBKQGFAAQABwAACURIxEzETY2MzISERACIyImATQmIyIGFRQWMzI2AXO5uTqxe8z//8x7sQI4p5KSp6eSkqeo/a4Hvv2iZGH+vP74/vj+vGEB68vn58vL5+cA//8APf5WBH8GEBImAFwAABAGAGpeAP//ABAAAAVoBzEQJwBxALwBOxIGACQAAP//AHv/4wQtBfYQJgBxSgASBgBEAAD//wAQAAAFaAeSECcCFwDOAUoSBgAkAAD//wB7/+MELQYfECYCF0/XEgYARAAA//8AEP51BaUF1RImACQAABAHAhkC5AAA//8Ae/51BIAEexImAEQAABAHAhkBvwAA//8Ac//jBScHaxImACYAABAHAk8FLQF1//8Acf/jA+cGZhImAEYAABAHAHYAiQAA//8Ac//jBScHbRAnAlIFTAF1EgYAJgAA//8Acf/jA+cGZhImAEYAABAHAhUApAAA//8Ac//jBScHUBAnAlYFTAF1EgYAJgAA//8Acf/jA+cGFBAnAhwEpAAAEgYARgAA//8Ac//jBScHbRImACYAABAHAlMFLQF1//8Acf/jA+cGZhImAEYAABAHAhYAiQAA//8AyQAABbAHbRAnAlME7AF1EgYAJwAA//8Acf/jBdsGFBImAEcAABAHAk0FFAAA//8ACgAABboF1RAGAJIAAAACAHH/4wT0BhQAGAAkAAABESE1ITUzFTMVIxEjNQYGIyICERASMzIWARQWMzI2NTQmIyIGA6L+ugFGuJqauDqxfMv//8t8sf3Hp5KSqKiSkqcDtgFOfZOTffr8qGRhAUQBCAEIAURh/hXL5+fLy+fnAP//AMkAAASLBzMSJgAoAAAQBwBxAKEBPf//AHH/4wR/BfYQJwBxAJYAABIGAEgAAP//AMkAAASLB20QJwJVBKEBdRIGACgAAP//AHH/4wR/BkgQJwIXAJYAABIGAEgAAP//AMkAAASLB1AQJwJWBJ4BdRIGACgAAP//AHH/4wR/BhQQJwIcBJYAABIGAEgAAP//AMn+dQSNBdUSJgAoAAAQBwIZAcwAAP//AHH+dQR/BHsSJgBIAAAQBwIZAXgAAP//AMkAAASLB2cSJgAoAAAQBwJTBKYBb///AHH/4wR/BmESJgBIAAAQBwIWAJT/+///AHP/4wWLB20QJwJSBVwBdRIGACoAAP//AHH+VgRaBmYQJgIVaAASBgBKAAD//wBz/+MFiwdtEiYAKgAAEAcCVQUbAXX//wBx/lYEWgZIEiYASgAAEAcCFwCLAAD//wBz/+MFiwdQECcCVgVcAXUSBgAqAAD//wBx/lYEWgYUECcCHARqAAASBgBKAAD//wBz/gEFiwXwECcCIgVe/+0SBgAqAAD//wBx/lYEWgY0ECcCIAPgAQwSBgBKAAD//wDJAAAFOwdtECcCUgUCAXUSBgArAAD////lAAAEZAdtECcCUgMWAXUSBgBLAAAAAgDJAAAGiwXVABMAFwAAATMVITUzFTMVIxEjESERIxEjNTMXFSE1AXHKAt7KqKjK/SLKqKjKAt4F1eDg4KT7rwLH/TkEUaSk4OAAAAEAeAAABJ8GFAAbAAABESMRNCYjIgYVESMRIzUzNTMVIRUhETY2MzIWBJ+4fHyVrLl9fbkBYP6gQrN1wcYCpP1cAp6fnr6k/YcE9qR6eqT+vGVk7wD////kAAACeAdeECcCUAMuAXUSBgAsAAD////TAAACZwY3ECcCGv8dAAASBgDzAAD//wADAAACWQcxECcAcf8uATsSBgAsAAD////yAAACSAX1ECcAcf8d//8SBgDzAAD////1AAACZwdtECcCVQMuAXUSBgAsAAD////kAAACVgZIECcCF/8dAAASBgDzAAD//wCw/nUCJQXVECcCGf9kAAASBgAsAAD//wCW/nUCCwYUECcCGf9KAAASBgBMAAD//wDJAAABlQdQEiYALAAAEAcCVgMvAXUAAgDBAAABeQR7AAMABAAAEzMRIxPBuLhcBGD7oAR7AP//AMn+ZgPvBdUQJwAtAlwAABAGACwAAP//AMH+VgOxBhQQJwBNAjgAABAGAEwAAP///5b+ZgJfB20QJwJSAy4BdRIGAC0AAP///9v+VgJcBmYQJwIV/x0AABIGAfkAAP//AMn+HgVqBdUQJwIiBRsAChIGAC4AAP//ALr+HgScBhQQJwIiBKwAChIGAE4AAAABALoAAAScBGAACgAAEzMRATMBASMBESO6uQIl6/2uAmvw/ce5BGD+GwHl/fL9rgIh/d///wDJAAAEagdsECcCTwNuAXYSBgAvAAD//wDBAAACSgdsECcCTwNaAXYSBgBPAAD//wDJ/h4EagXVECcCIgSbAAoSBgAvAAD//wCI/h4BrQYUECcCIgMeAAoSBgBPAAD//wDJAAAEagXVECcCTQKf/8MSBgAvAAD//wDBAAADAAYUECcCTQI5AAIQBgBPAAD//wDJAAAEagXVECcAeQIxAHcSBgAvAAD//wDBAAAChAYUECcAeQDWAHMQBgBPAAAAAf/yAAAEdQXVAA0AABMzESUXAREhFSERByc308sBOVD+dwLX/F6UTeEF1f2Y22/+7v3jqgI7am6eAAEAAgAAAkgGFAALAAATMxE3FwcRIxEHJzfHuH1Mybh7SsUGFP2mWmqN/OMCmlhqjQD//wDJAAAFMwdsECcCTwTFAXYSBgAxAAD//wC6AAAEZAZtECYAdkIHEgYAUQAA//8Ayf4eBTMF1RAnAiIFAAAKEgYAMQAA//8Auv4eBGQEexAnAiIEkAAKEgYAUQAA//8AyQAABTMHXxImADEAABAHAlME9QFn//8AugAABGQGZhImAFEAABAHAhYAjQAA//8AzQAABbkF1RAnAFEBVQAAEAYCFBsAAAEAyf5WBRkF8AAcAAABECEiBhURIxEzFTY3NjMyEhERFAcGIyM1MzI2NQRQ/s2z18rKTmlqmePpUVK1VzFmTwN/Aaz/3vyyBdXxhkND/sH+zPxv1WFgnFqgAAEAuv5WBGQEewAfAAABERQHBiMjNTMyNzY1ETQmIyIGFREjETMVNjc2MzIXFgRkUlG1/ulpJiZ8fJWsublCWVp1wWNjAqT9SNZgYJwwMZkCsp+evqT9hwRgrmUyMnd4//8Ac//jBdkHMRAnAHEBJwE7EgYAMgAA//8Acf/jBHUF9RAmAHFz/xIGAFIAAP//AHP/4wXZB20QJwJVBScBdRIGADIAAP//AHH/4wR1BkgQJgIXcwASBgBSAAD//wBz/+MF2QdrECcCVwUnAXUSBgAyAAD//wBx/+MEdQZmECcCGwCgAAASBgBSAAAAAgBzAAAIDAXVABAAGQAAARUhESEVIREhFSEgABEQACEXIyAAERAAITMH+v0aAsf9OQL4+9f+T/5BAb8BsWeB/r/+wAFAAUGBBdWq/kaq/eOqAXwBcAFtAXyq/uH+4P7f/t8AAAMAcf/jB8MEewAGACcAMwAAASYmIyIGBwUVIRYWMzI2NxUGBiMiJicGBiMiABEQADMyFhc2NjMyACUiBhUUFjMyNjU0JgcKAqSJmbkOA0j8sgzMt2rIYmTQaqDyUUfRjPH+7wER8YzTQk7oj+IBCPqwlKyrlZOsrAKUmLOunjVavsc0NK4qLG5tbm0BOQETARQBOG9sa3D+3Yfnycnn6MjH6QD//wDJAAAFVAdsECcCTwSVAXYSBgA1AAD//wC6AAADlAZtECYAdkIHEgYAVQAA//8Ayf4eBVQF1RAnAiIFEAAKEgYANQAA//8Agv4eA0oEexAnAiIDGAAKEgYAVQAA//8AyQAABVQHXxImADUAABAHAlMEfQFn//8AugAAA1oGZhImAFUAABAGAhYbAP//AIf/4wSiB2wQJwJPBJUBdhIGADYAAP//AG//4wPHBm0QJgB2QgcSBgBWAAD//wCH/+MEogdtECcCUgSTAXUSBgA2AAD//wBv/+MDxwZmECYCFSUAEgYAVgAA//8Ah/51BKIF8BImADYAABAHAHoAiwAA//8Ab/51A8cEexImAFYAABAGAHoXAP//AIf/4wSiB20SJgA2AAAQBwJTBIsBdf//AG//4wPHBmYSJgBWAAAQBwIdBCcAAP////r+dQTpBdUQJgB6UAASBgA3AAD//wA3/nUC8gWeECYAeuEAEgYAVwAA////+gAABOkHXxImADcAABAHAlMEcwFn//8ANwAAAv4GghImAFcAABAHAk0CNwBwAAH/+gAABOkF1QAPAAADIRUhESEVIREjESE1IREhBgTv/e4BCf73y/73AQn97gXVqv3Aqv2/AkGqAkAAAAEANwAAAvIFngAdAAABESEVIRUhFSEVFBcWMzMVIyInJjU1IzUzNSM1MxEBdwF7/oUBe/6FJSZzvb3VUVGHh4eHBZ7+wo/pjumJJyeaUE/S6Y7pjwE+AP//ALL/4wUpB14QJwJQBO4BdRIGADgAAP//AK7/4wRYBjcQJwIaAIMAABIGAFgAAP//ALL/4wUpBzEQJwBxAO4BOxIGADgAAP//AK7/4wRYBfUQJwBxAIP//xIGAFgAAP//ALL/4wUpB20QJwJVBO4BdRIGADgAAP//AK7/4wRYBkgQJwIXAIMAABIGAFgAAP//ALL/4wUpB28SJgA4AAAQBwIYAPAAaf//AK7/4wRYBsoSJgBYAAAQBgIYfMT//wCy/+MFKQdrECcCVwTuAXUSBgA4AAD//wCu/+MEXgZmECcCGwCwAAASBgBYAAD//wCy/nUFKQXVEiYAOAAAEAcCGQD6AAD//wCu/nUE6AR7EiYAWAAAEAcCGQInAAD//wBEAAAHpgd0ECcCUgX1AXwSBgA6AAD//wBWAAAGNQZtECcCFQFFAAcSBgBaAAD////8AAAE5wd0ECcCUgRyAXwSBgA8AAD//wA9/lYEfwZtECYCFV4HEgYAXAAA/////AAABOcHThImADwAABAHAk4EcwF1//8AXAAABR8HbBAnAk8ElQF2EgYAPQAA//8AWAAAA9sGbRAmAHZCBxIGAF0AAP//AFwAAAUfB1AQJwJWBL4BdRIGAD0AAP//AFgAAAPbBhQQJwIcBBcAABIGAF0AAP//AFwAAAUfB20SJgA9AAAQBwJTBL4Bdf//AFgAAAPbBmYSJgBdAAAQBgIWGwAAAQAvAAAC+AYUABAAACEjESM1MzU0NjMzFSMiBwYVAZi5sLCuva6wYycmA9GPTrurmSgpZwAAAgAg/+MEpAYUAA8ALAAAATQnJiMiBwYVFBcWMzI3NgE2NzYzMhcWERAHBiMiJyYnFSMRIzUzNTMVIRUhA+VTVJKSVFNTVJKSVFP9jjpZWHvMf4CAf8x7WFk6uZqauQFF/rsCL8t0c3N0y8t0c3N0AlJkMDGiov74/viiojEwZKgFBH2Tk30AAAP/lwAABVAF1QAIABEAKQAAAREhMjY1NCYjAREhMjY1NCYjJSEyFhUUBgcWFhUUBCMhESIGFRUjNTQ2AfcBRKOdnaP+vAErlJGRlP4LAgTn+oB8laX+8Pv96IR2nMACyf3dh4uMhQJm/j5vcnFwpsCxiaIUIMuYyNoFMF9pMUa1o///AMkAAATsBdUSBgImAAAAAgC6/+MEpAYUABYAJgAAATY3NjMyFxYREAcGIyInJicVIxEhFSUBNCcmIyIHBhUUFxYzMjc2AXM6WVh7zH+AgH/Me1hZOrkDTv1rAnJTVJKSVFNTVJKSVFMDtmQwMaKi/vj++KKiMTBkqAYUpgH8wMt0c3N0y8t0c3N0AAIAAAAABOwF1QAKABcAAAE0JyYjIREhMjc2AREhMgQVFAQjIREjAQQXT06j/rwBRKNOT/18AU77ARD+8Pv96MkBOAG3i0RD/d1EQwSo/Zra3t3aBEQBkQACAAD/4wSkBhUAEgAeAAABNjYzMhIREAIjIiYnFSMRIwEzATQmIyIGFRQWMzI2AXM6sXvM///Me7E6uboBIlECcqeSkqenkpKnA7ZkYf68/vj++P68YWSoBEQB0fway+fny8vn5wABAHP/4wUnBfAAGQAAEzY2MyAAERAAISImJzUWFjMgABEQACEiBgdzaO2GAVMBhv56/q2E7Wpm54IBAAEQ/vD/AILnZgViR0f+Yf6Y/pn+YUhI019eATkBJwEoATleXwABAHP/4wZaB2QAJAAAARUmJiMgABEQACEyNjcVBgYjIAAREAAhMhcWFzY3NjMzFSMiBgUnZueC/wD+8AEQAQCC52Zq7YT+rf56AYYBU2CcDQwQU2bjTT+GbgVi1V9e/sf+2P7Z/sdeX9NISAGfAWcBaAGfJAMEw2J6qpYAAQBx/+MEzAYUACIAAAEVJiYjIgYVFBYzMjY3FQYGIyIAERAAITIXNTQ2MzMVIyIGA+dOnVCzxsazUJ1OTaVd/f7WAS0BBkdGobVFMGlMBH71Kyvjzc3jKyuqJCQBPgEOARIBOgwP1sCcYQD//wAKAAAFugXVEAYAkgAAAAL/lwAABhQF1QAIABoAAAERMyAAERAAISUhIAAREAAhIREiBhUVIzU0NgH39AE1AR/+4f7L/kIBnwGyAZb+aP5Q/mGEdpzABS/7dwEYAS4BLAEXpv6X/oD+fv6WBTBfaTFGtaMAAAIAyQAABOwF1QAHABQAAAEQISERISIGESERISIkNTQkMyERIQGeAUABRP68o50DTv3o+/7wARD7AU79fAG3/u8CI4cDk/or2t7d2gHAAAIAcf/jBFoGFAASAB4AAAE1IREjNQYGIyICERASMzIWFxEBFBYzMjY1NCYjIgYBDQNNuDqxfMv//8t8sTr9jaeSkqiokpKnBW6m+eyoZGEBRAEIAQgBRGFkAbn8wMvn58vL5+cAAAIAcf5WBHUEYwAZACcAACUWFRAhIic1FjMyNTQlJicmERAAMzIAAxQCAzYmIyIGFRQWFxYXNjYDa53+R914Zvb2/vjQdY4BEu/wARMBmycBq5SUrLx+QDNjbkJPjf7wRplGdVwwJXCHAQ8BDwE5/sf+7Zz+/AGgy+Xow8LHCwYOKtwAAAEAgwAABEUF1QALAAABESE1IREhNSERITUERfw+Avj9OQLH/RoF1forqgIdqgG6qgAAAgB1/+MF2QXwABMAGgAAEyEQACEiBgc1NiQzIAAREAAhIAA3FhIzMhI3dQSP/u3+7ov8cG8BB5IBXgGL/oj+xv63/pfcDf/Kyv8NAwwBDAEyYF/XRkj+Z/6S/p/+WwG3zMP+5AEcwwABAKT/4wR7BfAAKAAAASYmNTQkMzIWFxUmJiMiBhUUFjMzFSMiBhUUFjMyNjcVBgYjICQ1NDYB2IOOAQzmWclzcr5TmKOelbaupbnHvm3IVGrHXv7o/tCjAyUhq3yy0SAgtCYke3Nwd6aVhI+WMjHDJSXy3ZDEAAAB/5b+ZgQjBdUAEQAAEyEVIREhFSEREAYjIzUzMjY1yQNa/XACUP2wzeNNP4ZuBdWq/kiq/Z/+8vSqlsIAAAH/f/5WAvgGFAAbAAABFSMiBhUVIRUhERQGIyM1MzI2NREjNTM1NDYzAviwY00BL/7Rrr2usGNNsLCuvQYUmVBoY4/767urmVBoBCqPTrurAAABAHP/4waXB2QAJgAAJREhNSERBgQjIAAREAAhMhYXNDYzMxUjIgYVFSYmIyAAERAAITI2BMP+tgISdf7moP6i/nUBiwFeW6NEyeNNP4ZucPyL/u7+7QETARJrqNUBkab9f1NVAZkBbQFuAZkZGbzqqpbC119g/s7+0f7S/s4lAAIACP5SBXYF1QAPACUAAAEyNzY1NCcmJwYHBhUUFxYTATMBFhcWFRQHBiMiJyY1NDc2NwEzAr82LBwfMywsMx8cLDYB2d79umhDLktkm5tkSy5DaP263v79IBRCOUl5XFx5STlCFCADegNe+8/IrndCi0FXV0GLQneuyAQxAAEAugAAB0cGFAAqAAAlMjc2NTQnJic1FhcWERQAIyMiJjURNCYjIgYVESMRMxE2NjMyFhURFBYzBUyVVFdKPnngbW/+4N1Gu518fJWsublCs3XBxkxpnGJlm95wXyGUHY+R/uz1/ubIzgEIn56+pP2HBhT9nmVk7+j+8pNnAAEAyQAAAsYF1QALAAATMxEUFjMzFSMiJhHJym6GP03jzQXV/C3Clqr0AQ4AAQAKAAACUgXVAAsAABMzETMVIxEjESM1M8nKv7/Kv78F1f0Wqv2/AkGqAAABAMkAAAX3BfAAFwAAASM1NCYjIgcBASEBESMRMxEBNjMyFxYVBfeqSSZGJf3dAxr+9v0zysoCbFVxiFVVBEh5NlAj/fn84wLP/TEF1f2JAkNPXFtuAAEAuQAABJwGFAASAAATNDYzMxUjIgYVEQEzAQEjAREjuaO1v6hpTAIl6/2uAmvw/ce5BH7WwJxhmf3/AeP99P2sAiP93QABAAoAAAIqBhQACwAAEzMRMxUjESMRIzUzwbixsbi3twYU/TiQ/UQCvJAAAAEAPQAABH8GFAAPAAAzAScFJyUnMxclFwUBIwEBPQHrR/7UIQEpS8g0AToh/skB7cP+xv5+BDK8ZWNjxYpoYWj61wM8/MQAAAEAsv/jBycF1QAnAAAlBgYjIicmNREzERQXFjMyNjURMxEUFxYzMjc2NREzESM1BgYjIicmA6ZFwIKvX1/LJzl1j6bLOTl3e1NTy8s/sHl6VlXVfHZ7euIEG/vvujVOvqQD7Pvvok5NX2CjA+z6Ka5nYj4+AAAB/5b+ZgUzBdUAEQAAEyEBETMRIQEREAYjIzUzMjY1yQEQApbE/vD9as3jRz+GbgXV+x8E4forBOH7h/7y9KqWwv//ALr+VgRkBHsQBgIlAAAAAwBz/+MF2QXwAAsAEgAZAAATEAAhIAAREAAhIAABIgAHISYCARISMzISE3MBeQE6ATsBeP6I/sX+xv6HArXK/wAMA6wO/v1WCPvc3PgIAukBYgGl/lv+n/6e/lsBpAPF/uTDwwEc/Xr+//7CAT0BAgD//wBn/+MGHQYUECYAMvQAEAcCIQWiATT//wB2/+ME0wTrECcCIQRYAAsQBgBSBQAAAgBz/+MGzwXwABQAHwAAIRE0JiMRBiEgABEQACEyFyEyFhERASIAERAAMzI3ESYGBW56vP7F/sb+hwF5ATtwYQEn4838WNz+/QED3K+AigPTwpb7i9MBpAFiAWIBpRv0/vL8LQVM/rj+5v7l/rhnBBhGAAACAHH+VgVZBHsAFgAhAAABETQnJiMRBiMiABEQADMyFzMyFxYVEQEiBhUUFjMyNxEmBKEmJmmJ8PH+7wER8WRS2LVSUf0alKyrlYFAVP5WBHSZMTD8vJ0BOQETARQBOBtgYNb7jAWJ58nJ5zoC8DYAAv+XAAAE8QXVAAgAHAAAAREzMjY1NCYjJSEyBBUUBCMjESMRIgYVFSM1NDYB9/6NmpqN/jgByPsBAf7/+/7KhHacwAUv/c+Sh4aSpuPb3eL9qAUwX2kxRrWjAAACALn+VgSkBhQAGAAkAAAlESMRNDYzMxUjIgYVFTY2MzISERACIyImATQmIyIGFRQWMzI2AXO6o7X+52lMOrF7zP//zHuxAjinkpKnp5KSp6j9rgYo1sCcYZnIZGH+vP74/vj+vGEB68vn58vL5+cAAgDJ/vgFVAXVABUAHQAAARYWFxMjAyYmIyMRIxEzETMgFhUUBgERMzI2ECYjA41Bez7N2b9Ki3jcysr+AQD8g/2J/o2amY4BtBaQfv5oAX+WYv6RBdX++NbYjboCT/3RkgEMkQAAAQBy/+MEjQXwACEAABM2IAQQBgcHBgYUFjMyNxUEIyAnJjU0Njc3Njc2NCcmIAfM5AHGARfK4nuah7yt4fj+/db+55KR1+J6pjw7WVr+oeQFpEzk/o/ALRgffOyIi9BfcHDZttkrGR8yM9lAQG0AAAEAZP/jA7wEewAnAAATNjYzMhYVFAYHBwYGFRQWMzI2NxUGBiMiJjU0Njc3NjY1NCYjIgYHoEy0Zs7gmKtAq2WMgmHGZmzDWtj3pcQ/lGKJiVqoTgQ/Hh6snoKVJA8lUEtRWTU1viMjtpyJmSoOIUlAVFQoKP//AMkAAASLBdUQBgIkAAAAAv7y/lYC1wYUABYAHwAAAREUFjMzFSMiJjURIyA1NCEyFxYXMxUlJicmIyIHBjMBd01jsK69rr7+8gEvtVI1Er/+hggRIW58AwN3BGr7PWhQmau7BK7S2GBAb5uaLBgwQTMAAAEAN/5WAvIFngAdAAABESEVIREUFjMzFRQGIyM1MzI3NjU1IiY1ESM1MxEBdwF7/oVLc72ktEYwaiYm1aeHhwWe/sKP/aCJTq7WwJwwMZkUn9ICYI8BPgABABgAAATpBdUADwAAASEVIREjESMiBhUVIzU0NgGuAzv97stehHacwAXVqvrVBStaaTFGtaMAAAEANwAAAvIGFAAbAAABFSEVIREUFjMzFSMiJjURIzUzNTQ2MzMVIyIGAXcBe/6FS3O9vdWih4euva6wY00Ew2OP/aCJTpqf0gJgj067q5lRAAAB//r+ZgTpBdUADwAAAyEVIREUFjMzFSMiJhERIQYE7/3uboY/TuPN/e4F1ar7PcKWqvQBDgTD//8Arf/3Bl8GFBAmADj7FBAHAiEF5AE0//8AsP/jBWkE6xAnAiEE7gALEAYAWAIAAAEATv/jBc8FygAfAAABIRYSFRAAISAAETQSNyE1IRUGAhUUADMyADU0Aic1IQXP/sChjv5//tH+z/6BkZ7+wQJYsscBCdjYAQjGsQJYBRiN/tjC/sv+dwGKAT64ASqLsrJh/rTK7/7dASLwygFMYbIAAAEAyf/hBXYF1QAbAAAlMgA1NCcmJzUXFhIVEAcGIScmJyYRETMRFBYzAsbYAQhjQW6zoY7Av/7PTehhZ8puho0BIvDKpm1XRAGN/tjC/svFxAIGdHoBDgPw/BDClgAB//wAAAXwBfAAFwAAASIHBgcBESMRATMBATYzMhcWFRUjNTQmBNc5FSUR/oTL/fDZAZ4BTlqjiFVVqkkFRw4YGf2//TkCxwMO/ZoB+YhcW26DeTZQAAEAPf5WBdgEewAfAAAFBgYjIzUzMjY3NwEzAQE2NzYzMhYVFSM1NCYjIgcGBwKTTpR8k2xMVDMh/jvDAV4BGhUwWIeDubJROTkpFApoyHqaSIZUBE78lALANDNgv4ZycjpUKhQZAAEAXAAABR8F1QARAAATIRUBIRUhASEVITUBITUhASFzBJX+cAEZ/nP+VAPH+z0Buf7VAZ8Bg/xnBdWa/hGQ/e6qmgIikAHfAAEAWAAAA9sEYAARAAATIRUDMxUhASEVITUBIzUhASFxA2r7wv7C/sMCtPx9ASvUAVABDf1lBGCo/tyQ/o+TqAFckAE5AAABAKD/wQT4BdUAIgAAJTI3NjU0JyYjIzUBITUhFQEyFxYXFhUUBwYhIicmJzUWFxYCqMBjZFxdpa4Bgfz8BAD+ZWqAYlZRmJj+6Hd9foZqf35rS0uPhklKmAHqqpr+FjgqbWiK3Hp5ExIlwzEZGQAAAQBc/8EEtAXVACIAACUyNzY3FQYHBiMgJyY1NDc2NzYzATUhFSEBFSMiBwYVFBcWAqyJfn9qhn59d/7omJhRVmKAav5lBAD8/AGBrqVdXGRjaxkZMcMlEhN5etyKaG0qOAHqmqr+FphKSYaPS0sAAAEAaP5MBD8EYAAgAAABATUhFSEBFSMiBwYVFBcWMzI2NxUGBwYjICQ1NDc2NzYCW/5lA2r9ZQGurqVdXGRjvm3IVGpkY17+6P7QUVZigAHcAdyok/4NpkpLhI9LSzIxwyUTEvLdimhtKjgAAAEAcf5WA+gEYAAgAAABMjc2NxUGBwYjIBE0JSQ1NCMwIQEhNSEVASAVEAUGFRQCf1RNT1FXUFZh/iABlgEc6/7eAeX9ZQNq/p4Bb/4w4v7uFRUssyANDgEZ7jUlYnwCOJOo/mTl/uwxGGGLAAEAlgAABEoF8AAkAAAlIRUhNQE3ITUhNjc2NTQnJiMiBwYHNTY2MzIEFRQHBgczFSMHAYkCwfxMATpz/qcB4l8lJ1NUhl9panh61FjoARQiH0po7DCqqqoBQHWQbUhMSXdLSyEhQ8wxMujCXFJJYJAxAAEAXf/BBPkF1QAZAAABECARNCYjIREhFSERJSQXFhAHBwYHBiAkNQEmAwq5pf33A6H9KQFzAQCiUTscFC2Y/cT+0AGQ/tsBJYaTAyyq/iUBAdBo/uBWKR0kefLdAAABAGj+TAQ/BGAAGgAAFxYzIBE0JiMhESEVIREzMhYWEAcHBgcGISInaKrOAZa5pf6fAxn9n91p5KY7HBQtmP7ou9SnYwElhpMDLKr+JmPU/uBWKR0keUoAAQBY/+MDpQWeACQAAAEHFhcWFRQHBiEiJyYnNRYXFjMyNzY3NCcmIyMTIzUzETMRMxUCIQKqcGxuif7tVVFRTElUTlCzYzkBOlbAPgLl5crnA+Z9Hndzqrp9nRIRI6woGBZyQYViTHIBD6QBFP7spAAAAgC6/lYEpAR7AA4AFwAABREjETMVNjc2MzIXFhUQAQA1NCcmIyIHAXO5uTSHUdK4TU78zwJyOTh43K16/tAGCqpCUjFwcZn+V/7kAZD5hUJB7wAAAQDJ/lYBkwXVAAMAABMzESPJysoF1fiBAP//AMn+VgMnBdUQJwGCAZQAABAGAYIAAAABABT+VgOcBdUAEwAAATMRIRUhFSEVIREjESE1ITUhNSEBc8oBX/6hAV/+ocr+oQFf/qEBXwXV/Zeo8Kr9LALUqvCo//8AyQAAAZQF1RAGAASUAP//AMkAAArQB20QJwE/BbEAABAGACcAAP//AMkAAAmwBmYQJwFABdUAABAGACcAAP//AHH/4wiRBmYQJwFABLYAABAGAEcAAP//AMn+ZgYkBdUQJwAtBJEAABAGAC8AAP//AMn+VgXeBhQQJwBNBGUAABAGAC8AAP//AMH+VgLvBhQQJwBNAXYAABAGAE8AAP//AMn+ZgbyBdUQJwAtBV8AABAGADEAAP//AMn+Vga3BhQQJwBNBT4AABAGADEAAP//ALr+VgXeBhQQJwBNBGUAABAGAFEAAP//ABAAAAVoB20SJgAkAAAQBwJTBL4Bdf//AHv/4wQtBmYSJgBEAAAQBgIWWgD////+AAACYAdtEiYALAAAEAcCUwMvAXX////gAAACXgZmEiYA8wAAEAcCFv8fAAD//wBz/+MF2QdtEiYAMgAAEAcCUwUnAXX//wBx/+MEdQZmEiYAUgAAEAYCFnYA//8Asv/jBSkHbRImADgAABAHAlME9gF1//8Arv/jBFgGZhImAFgAABAGAhZ2AP//ALL/4wUpCDMQJgJZMAASBgA4AAD//wCu/+MEWAcxECcAcQB7ATsSBgC+AAD//wCy/+MFKQhaEiYAOAAAEAYCWzYA//8Arv/jBFgHIhImAFgAABAHAlv/vv7I//8Asv/jBSkIWhImADgAABAGAl4wAP//AK7/4wRYByISJgBYAAAQBwJe/8T+yP//ALL/4wUpCGASJgA4AAAQBgJcMAb//wCu/+MEWAciEiYAWAAAEAcCXP++/sj//wBx/+MEfwR7EgYCEgAA//8AEAAABWgIMxImACQAABAGAlkAAP//AHv/4wQtBzESJgCmAAAQBwBxAFIBO///ABAAAAVoCDMSJgAkAAAQBgJaAAD//wB7/+MELQb0EiYARAAAEAcCWv+T/sH//wAIAAAHSAc0ECcAcQLXAT4SBgCIAAD//wB7/+MHbwXyECcAcQHo//wSBgCoAAAAAQBz/+MGBAXwACUAAAERMxUjFQYEIyAAERAAITIEFxUmJiMgABEQACEyNjc1IzUzNSE1BYt5eXX+5qD+ov51AYsBXpIBB29w/Iv+7v7tARMBEmuoQ/39/rYDDP7WWP9TVQGZAW0BbgGZSEbXX2D+zv7R/tL+ziUntViEpgAAAgBx/lYE+gR7AAsANAAAATQmIyIGFRQWMzI2FxQHMxUjBgcGISImJzUWFjMyNzY3ITUhNjU1BgYjIgIREBIzMhYXNTMDoqWVlKWllJWluBOzxh86f/76YaxRUZ5StVoVEf2EApoWObJ8zvz8znyyObgCPcjc3MjH3NzrblhGXUCMHR6zLCpfFxxFR15bY2IBOgEDAQQBOmJjqgD//wBz/+MFiwdtEiYAKgAAEAcCUwVKAXX//wBx/lYEWgZjECYCFkr9EgYASgAA//8AyQAABWoHbRAnAlMEogF1EgYALgAA////6QAABJwHbRImAE4AABAHAlMDGgF1//8Ac/51BdkF8BAnAhkBNAAAEgYAMgAA//8Acf51BHUEexAnAhkAgAAAEgYAUgAA//8Ac/51BdkHMRAnAHEBJwE7EgYBrAAA//8Acf51BHUF9RAmAHFz/xIGAa0AAP//AKD/wQT4B20QJwJTBL4BdRIGAXkAAP//AFj+TAQvBmYQJgIWGwAQBgITAAD////b/lYCZAZmECcCFv8lAAAQBgH5AAD//wDJAAAK0AXVECcAPQWxAAAQBgAnAAD//wDJAAAJsAXVECcAXQXVAAAQBgAnAAD//wBx/+MIkQYUECcAXQS2AAAQBgBHAAD//wBz/+MFiwdsECcCTwUbAXYSBgAqAAD//wBx/lYEWgZjEiYASgAAEAYAdhv9AAEAyf/jCC0F1QAdAAATMxEhETMRFBcWFzI3NjURMxEUBwYhICcmNREhESPJygLeyj49mZRCPspkYP7m/u1nZP0iygXV/ZwCZPvsn1BOAU9LpAKf/VrfgHh4dukBDf05AAIAyf5WBQIF8AAOABcAACURIxEzFTY3NjMyFxYVEAEAETQnJiMiAwGTyso4kVfixlNU/JECoT08ge26nP26B3+5SFc1eHqk/jf+zgGuAQyPR0b+/wD//wDJAAAFMwdrECcCUQUeAXUSBgAxAAD//wC6AAAEZAZkEiYAUQAAEAcAQwEY//7//wAQAAAFaAdzEiYAhwAAEAcCTwZcAX3//wB7/+ME3AdzEiYApwAAEAcCTwXsAX3//wAIAAAHSAdsECcCTwZcAXYSBgCIAAD//wB7/+MHbwZjEiYAqAAAEAcAdgFl//3//wBm/7oF5QdsECcCTwT+AXYSBgCaAAD//wBI/6IEnAZjEiYAugAAEAYAdhz9//8AEAAABWgHcBImACQAABAHAlgE5QF6//8Ae//jBC0GZBAnAh4EmP/+EgYARAAA//8AEAAABWgHNhImACQAABAHAlQEvAE+//8Ae//jBC0GSBAnAh8EZQAAEgYARAAA//8AyQAABIsHcBImACgAABAHAlgEpQF6//8Acf/jBH8GYxAnAh4Euv/9EgYASAAA//8AyQAABIsHNhImACgAABAHAlQEpgE+//8Acf/jBH8GSBAnAh8EqQAAEgYASAAA////pwAAAnMHcBImACwAABAHAlgDWQF6////wwAAAoEGYxAnAh4DZv/9EgYA8wAA//8ABQAAAncHNhImACwAABAHAlQDPgE+////4wAAAlUGSBAnAh8DJAAAEgYA8wAA//8Ac//jBdkHcBImADIAABAHAlgFQQF6//8Acf/jBHUGZBAnAh4En//+EgYAUgAA//8Ac//jBdkHNhImADIAABAHAlQFHAE+//8Acf/jBHUGSBAnAh8EmAAAEgYAUgAA//8AxwAABVQHcBImADUAABAHAlgEeQF6//8AggAAA0oGYxAnAh4EJf/9EgYAVQAA//8AyQAABVQHNhImADUAABAHAlQEgAE+//8AugAAA14GSBAnAh8ELQAAEgYAVQAA//8Asv/jBSkHcBImADgAABAHAlgFFQF6//8Arv/jBFgGZBAnAh4E1P/+EgYAWAAA//8Asv/jBSkHNhImADgAABAHAlQE7AE+//8Arv/jBFgGSBAnAh8EqwAAEgYAWAAA//8Ah/4UBKIF8BAnAiIEdgAAEgYANgAA//8Ab/4UA8cEexAnAiIELAAAEgYAVgAA////+v4UBOkF1RAnAiIEUwAAEgYANwAA//8AN/4UAvIFnhAnAiIEAAAAEgYAVwAAAAEAnP5SBHMF8AAuAAABBBEUBgYEBAc1NiQ2NjU0JiMiBwc1Nz4DNTQuAyMiBzU2MzIWFhUUDgIDPwE0b7n/AP7qmcgBMblcfXBfc6P4PGZoPSM3S0gmuPPvzoPLfBc6bgKiQ/7bcM6giGAioDeMmZ1PZYQzSKtqGkFji1I3VjMiDLi+pFa2gDxmcXQAAQBH/k8DvAR7ADQAAAEeAxUUDgUHNT4ENTQmIyIHBzU3PgQ1NC4DIyIGBzUkMzIWFhUUBgKnRnA+IUJsmJ2zlUqi9Z5jKHZdOz/Y3yJBVz8tHzFDQSNFqJMBCoZwuHRnAc0IRFpYJUuKbGFGPScPgi5gW2JbM1hwGVaLVQ0gPEVmOSxGKhsKO1qahUeSYW6ZAP//AMkAAAU7B20QJwJTBQQBdRIGACsAAP////AAAARkB20QJwJTAyEBdRIGAEsAAAABAMn+VgUZBfEAEwAAATQmIyIGFREjETMVNjYXMhIRESMEUJqZs9fKylHMnePpyQN/19X/3vyyBdXxh4YB/sH+zPrZAAMAcf9wBkQGFAAHACgANAAAJRYzMjU0JyIHNjMyFRAhIicGByM2NyY1BgcGIyInJhA3NjMyFxYXETMAEBcWIDc2ECcmIAcEthEloDQ0ym6I9P6qSTUiGMQdQzA6WFl8y4B/f4DLfFlYOrj81VNUASRUVFRU/txUggWvLQEguM7+vw9IOkWTPCRkMDGiogIQoqIxMGQCXvzm/mp0c3N0AZZ0c3MAAgBx/+MFJQXwAAwAOwAAASIHBhAXFiA3NjU0JgMGBhUUFxYzMjc2NTQnJic1MhcWFRQGBxYXFhUUBwYgJyY1NDc2NyYnJjU0NzYhAsu4amtragFwa2vU9IKqXzvMqF9gTG2C5JaLqpisX2Ccm/26m5xgYaurQ1WCdAEBAsVNTf7yTU1NToaHmgInA3xPRUgtQUGInitNCGRoYbqAsiAiY2OP2XR0dHTZj2NjIh9GWViCU0oAAgBx/+MEcQUPAA0ANAAAASIHBhAXFiA3NjU0JyYTFhUUBwYHFhcWFRQHBiAnJjU0NjcmJyY1NDczBhQXFjMyNzY1NCcCcZBTUlJTASBTU1NS/jo0SIKSUlGFhP4ShIWkkpA7ND+hK0lIg4JJSiwCxU1N/vJNTU1OhodNTQJKQGKZQFkgImNjj9l0dHR02Y/GIiNWS45ZSUHoQUFBQXR3PgAAAQBc/lYFHwXVABUAAAUQBwYjIzUzMjc2NTUhNQEhNSEVASEFH55Icv7paSYm+/UDsPxnBJX8UAPHFP7fUCWcMDGZFJoEkaqa+28AAAEAWP5WA9sEYAAVAAAFEAcGIyM1MzI3NjU1ITUBITUhFQEhA9ueSHL+6WkmJv01ArT9ZQNq/UwCtBT+31AlnDAxmRSoAyWTqPzbAP//ABAAAAVoB1AQJwJWBLwBdRIGACQAAP//AHv/4wQtBhQQJwIcBEoAABIGAEQAAP//AMn+dQSLBdUSJgAoAAAQBwB6AKIAAP//AHH+dQR/BHsSJgBIAAAQBgB6ewD//wBz/+MF2QgzEiYAMgAAEAYCWWIA//8Acf/jBHUHMRImALgAABAHAHEAcwE7//8Ac//jBdkIMxImADIAABAGAl1pAP//AHH/4wR1BukSJgBSAAAQBwJd/7X+tv//AHP/4wXZB1AQJwJWBScBdRIGADIAAP//AHH/4wR1BhQQJwIcBHMAABIGAFIAAP//AHP/4wXZCDMSJgAyAAAQBgJaagD//wBx/+MEdQcxEiYB8QAAEAcAcQBzATv////8AAAE5wcxECcAcQByATsSBgA8AAD//wA9/lYEfwX1ECYAcV7/EgYAXAAAAAIAiv9wA1wGDgAHABkAACUWMzI1NCciBzYzMhUQISInBgcjNjcmNxEzAc4RJaA0NMpuiPT+qkk1IhjEHUMxAbiCBa8tASC4zv6/D0g6RZM8WgUwAAIAuv9wBk4EewAHACsAACUWMzI1NCciBzYzMhUQISInBgcjNjcmNxE0JiMiBhURIxEzFTY3NjMyFxYVBMARJaA0NMpuiPT+qkk1IhjEHUMxAXx8lay5uUJZWnXBY2OCBa8tASC4zv6/D0g6RZM8WgHAn56+pP2HBGCuZTIyd3joAAACADf/cANhBZ4ABwAhAAAlFjMyNTQnIgc2MzIVECEiJwYHIzY3JjURIzUzETMRIRUhAdMRJaA0NMpuiPT+qkk2IRjEHUMxh4e5AXv+hYIFry0BILjO/r8PSDpFkzxaAvOPAT7+wo8AAAH/2/5WAXkEYAALAAATMxEUBiMjNTMyNjXBuKO1RjFpTARg+4zWwJxhmQAAAwBx/+MHjAYUAAkAIwAvAAAAEBcWIDYQJiAHEzIXETMRNjMyEhACIyInFSM1BiMiJyYQNzYAECcmIAcGEBcWIDcBL1NUASSoqP7cVLn1crly9Mz//8z0crly9cuAf3+ABV1TVP7cVFNTVAEkVAL6/mp0c+cBludzAQ3FAl79osX+vP3w/rzFqKjFoqICEKKi/OkBlnRzc3T+anRzcwADAHH+VgeMBHsACwAlAC8AAAAQJyYgBwYQFxYgNwMiJxEjEQYjIicmEDc2MzIXNTMVNjMyEhACABAXFiA2ECYgBwbNU1T+3FRTU1QBJFS59HK5cvXLgH9/gMv1crly9Mz///qiU1QBJKio/txUAWQBlnRzc3T+anRzc/7zxf2uAlLFoqICEKKixaqqxf68/fD+vAMX/mp0c+cBludzAAP//f+6BXwGFwASABYAGQAAATMTARcBASMDIQcHIwcnIzcnNwEBMwEDIQMCSuWGAWFm/nABfNKI/dbNMkY7UgIBFC8CkP7uFgFvvQFdagXV/qEBoVn+J/wbAX/xjkZGARE4BMT9GQGx/k8BHwAAAgAM/7oFigYXACIALAAAFycTJhEQNzYhMhcWFzcXBxUmJwEWFxYhMjc2NxUGBwYjICcTASMmIyAHBhEUcmbcdcPDAVOGdj06ZWZjLjH89AkLiAEAgnRzZmp3doT+tMI5AtgBdIL/AIiIRlgBBbsBFwFoz9AkEht4WXa7KyH8Zg0MnS8vX9NIJCTHARUDXC+cnf7YrQAAAgAJ/6IEXQS8ACIAKwAAFyc3JjUQNzYhMhcWFzcXBxUmJwEWFxYzMjc2NxUGBwYjIicTASYjIgcGFRRpYL1Vl5YBBlVRLi1ZX3YZGP3TBwZjs1BOT05NUlNd8JM3Ae5HR7NjY15O5o3MARKdnREKEGxPj1UOC/1eCAhxFRYrqiQSEpABBQJWEXFyzWcAAAEACgAABGoF1QANAAATMxEzFSMRIRUhESM1M8nKv78C1/xfv78F1f13kP3uqgK8kAAAAv+y/7oFMQYXAA8AEgAAARUjAREjEQEnAREhNSE3FwEBIQTpNP4iy/4NZwJa/e4EmThm/aYBLP7UBWk+/cz9CQIH/bNYAscCUqpCWf4LAWIAAAEAb/4QBBkEewA9AAABNCcmJycmJyY1NDYzMhYXFSYmIyIHBhUUFxYXFxYXFhUUBwYHFxcWMxUjIicmJycmJyYnJic1FhcWMzI3NgMKMjOrQKtMTODOZrRMTqhaiURFMTGUP8ZQU3tXhJ+TKkwnVHJHWe0eJBARYWxmY2NhgkZGASdLKCglDyRKS4KerB4erigoKipUQCUkIQ4sS0yJnFtAE59+JJo9JlvzHhADAhIjvjUaGy0sAAABAFj+EAQzBGAAGAAAEyEVARYXARcWMzMVIyInJicnJiMjNTUBIXEDav1OXDEBCJMqTGyTVHJHWe09Wl4CtP1lBGCo/N0QMf74fiSaPSZb8z+cDAMlAAEAUAAABI0F1QAYAAABIxEjETMyNjU0JiMjIgYHNTYzMzIEFRQEApEnyvGNmpqN/kWvT5ir/vQBCP73Alr9pgMAkYeIjyostkbc4dfnAAEAUAAAA48EewAYAAABMzI2NTQnJiMiBwYHNTYzMhcWFRQGIxEjAS9kjZpMVYZJVlZOmKv7fYTUwsoBppGHjUFIFRUrtkZudNvV5f78AAMACgAABOwF1QAMABUAKAAAARUhFSEVITI2NTQmIwERITI2NTQmIyUhMhYVFAYHFhYVFAQjIREjNTMBkwFb/qUBRKOdnaP+vAErlJGRlP4LAgTn+oB8laX+8Pv96L+/AsnJkMqHi4yFAmb+Pm9ycXCmwLGJohQgy5jI2gFwkAAAAgAM/+MFzgXVABQAHQAAEzMRIREzETMVIxUQACEgABE1IzUzBSEVFBYzMjY1sssC4culpf7f/ub+5f7fpqYDrP0frsPCrgXV/ZYCav2WpJb+3P7WASoBJJakpH3w09PwAP//ABAAAAVoBdUQBgIjAAAAAwDJ/0IEiwaTABMAFwAbAAABMwczFSMDIRUhAyEVIQcjNyMRIQETIxEBEyERA7iqQViSlwEK/ry5Ai79mEGqQbACrv48udkBE5f+VgaTvqr+Rqr946q+vgXV+tUCHf3jAscBuv5GAAAEAHH/QgR/BR4ABQAmAC0AMQAAASYnJicDBRUhAxYzMjY3FQYGIyInByMTJicmERAAMzIXNzMHFhcWBRMmIyIGBxMTIxYDxwJTDhBvAZr+K5RKYWrHYmPQa3tjUKptIRydASn8ODFHqlw5L4P9vIcUFpq5DlpvzwsClJdaEA3+8jZa/pccNDSuKiwhwgEJFx2cAQoBEwFDCazgIjKSxQFKAq6e/mMBDqwAAAH/lv5mAlIF1QATAAABIxEQBiMjNTMyNjURIzUzETMRMwJSv83jTT+Gbr+/yr8Cd/3x/vL0qpbCAg+mArj9SAAC/9v+VgIcBhQAEwAXAAATMxEzFSMRFAYjIzUzMjY1ESM1MxEzFSPBuKOjo7VGMWlMtbW4uARg/gik/ijWwJxhmQHYpAOs6QACAHP+ZgawBfEAGAAkAAABNTMRFBYzMxUjIiYRNQYGIyAAERAAITIWARASMzISERACIyICBLPEboZFTePNTeyl/vL+rAFUAQ6l7Pzf6szN6+vNzOoE7ej6k8KWqvQBDn+EgAGrAVwBXAGrgP14/uP+uwFFAR0BHQFF/rsAAgBx/lYFQAR7ABgAJAAAASMiJjU1BgYjIgIREBIzMhYXNTMRFBYzMwEUFjMyNjU0JiMiBgVARrWjOrF8y///y3yxOrhMaTH776eSkqiokpKn/lbA1rxkYQFEAQgBCAFEYWSq+4yZYQM9y+fny8vn5wAAAgAKAAAFVAXVABcAIAAAARYWFxMjAyYmIyMRIxEjNTMRISAWFRQGAREzMjY1NCYjA41Bez7N2b9Ki3jcyr+/AcgBAPyD/Yn+kpWVkgK8FpB+/mgBf5Zi/YkCd6YCuNbYjboCT/3uh4ODhQAAAQAOAAADSgR7ABgAAAEVIxEjESM1MxEzFTY2MzIWFxcmJiMiBhUCHqu5rKy5OrqFEy4cAR9JLJynAmik/jwBxKQB+K5mYwUFvRIRzqEAAv/2AAAE7AXVABEAFAAAAzMXITczBzMVIQERIxEBITUzBSEXBNmXAgyW2Zec/vX+9sv+9v70nQJ3/tGYBdXg4OCk/nb9OQLHAYqkpOIAAgAL/lYEtQRgABgAGwAABQYGIyM1MzI2NzcDITUzAzMTIRMzAzMVISMjEwKTTpR8k2xMVDMhzf7W8L7DuAFMuMO57/7XwdptaMh6mkiGVAHyjwHN/jMBzf4zj/7wAAIAcf/jBH8EewAUABsAABM1ISYmIyIGBzU2NjMgABEQACMiADcWFjMyNjdxA04Mzbdqx2Jj0GsBDAE5/tf84v75uAKliJq5DgIAWr7HNDSuKiz+yP72/u3+vQEjxJe0rp4AAQBY/kwELwRgACAAAAEyFxYXFhUUBCEiJyYnNRYWMzI3NjU0JyYjIzUBITUhFQI8aoBiVlH+0P7oXmNkalTIbb5jZFxdpa4Brv1lA2oB3DgqbWiK3fISEyXDMTJLS4+ES0qmAfOTqP//ALID/gHXBdUQBgIwAAAAAQDBBO4DPwZmAAYAAAEzEyMnByMBtpT1i7S0iwZm/oj19QAAAQDBBO4DPwZmAAYAAAEDMxc3MwMBtvWLtLSL9QTuAXj19f6IAAABAMcFKQM5BkgADQAAEzMWFjMyNjczBgYjIibHdgthV1ZgDXYKnpGRngZIS0tKTI+QkAAAAgDuBOEDEgcGAAsAFwAAATQmIyIGFRQWMzI2NxQGIyImNTQ2MzIWAphYQEFXV0FAWHqfc3Ofn3NznwX0P1hXQEFXWEBzoKBzc5+fAAEBTP51AsEAAAATAAAhMwYGFRQWMzI2NxUGBiMiJjU0NgG4dy0rNzYgPh8mRB56czU9WB8uLg8PhQoKV10waQABALYFHQNKBjcAGwAAAScmJiMiBgcjNjYzMhYXFxYWMzI2NzMGBiMiJgH8ORYhDSYkAn0CZlsmQCU5FiENJiQCfQJmWyZABVo3FBNJUoeTHCE3FBNJUoeTHAACAPAE7gOuBmYAAwAHAAABMwMjAzMDIwL8sviHgarfiQZm/ogBeP6IAAAC/aIEe/5aBhQAAwAEAAABMxUjF/2iuLheBhTpsAAC/MUEe/9DBmYABgAHAAABAzMXNzMDB/269Yu0tIv1TgTuAXj19f6IcwAC/F0E7v8bBmYAAwAHAAABEyMDIRMjA/0PzYf4AgC+id8GZv6IAXj+iAF4AAH8vwUp/zEGSAAMAAADIyYmIyIGByM2NiAWz3YLYVdWYA12Cp4BIp4FKUtLSkyPkJAAAf4fA+n/RAUoAAMAAAEjEzP+8tOkgQPpAT8AAAH+8ANrAHsE4AATAAABNRYWMzI2NTQmJzMWFhUUBiMiJv7wPVgfLi4PD4UKClddMGkD13ctKzc2ID4fJkQeenM1AAH9av4U/o//VAADAAAFMwMj/bzTpIGs/sAAAQAQAAAFaAXVAAYAADMjATMBIwHl1QI65QI50v4mBdX6KwUOAAABAMkAAASLBdUACwAAJSEVITUBATUhFSEBAbEC2vw+Ad/+IQOw/TgB36qqqgJwAhGqqv3zAAABALr+VgRkBHsAFQAAAREjETQmIyIGFREjETMVNjc2MzIXFgRkuHx8lay5uUJZWnXBY2MCpPuyBEifnr6k/YcEYK5lMjJ3eAACAMkAAATsBdUACAAVAAABNCYjIREhMjYTFSERITIEFRQEISERBBedo/68AUSjnWz9EAFO+wEQ/vn+/P3oAbeLh/3dhwSopv5A2t7d2gXVAAEAZAHfAn8CgwADAAATIRUhZAIb/eUCg6T//wBkAd8CfwKDEgYCJwAAAAEAZAHpBLMCeQADAAATIRUhZARP+7ECeZAAAQBkAekDnAJ5AAMAABMhFSFkAzj8yAJ5kAABAGQB6QecAnkAAwAAEyEVIWQHOPjIAnmQAAEAAAHpCAACeQADAAARIRUhCAD4AAJ5kAD//wEE/h0C+AYdECYAXwAAEAcAXwFKAAD////s/h0EFP/uECYAQgAAEAcAQgAAAUIAAQCuA+kB0wXVAAUAAAEjNRMzAwGB06SBUgPprQE//sEAAAEAsgP+AdcF1QAFAAABMxUDIxMBBNOkgVIF1Zj+wQE/AAABAK7/EgHTAP4ABQAAJTMVAyMTAQDTpIFS/qz+wAFAAAEAsgP+AdcF1QAFAAABFRMjAzUBhVKBpAXVmP7BAT+YAAACAK4D6QNtBdUABQALAAABIzUTMwMFIzUTMwMBgdOkgVIBmtOkgVID6a0BP/7Bra0BP/7BAAACAK4D6QNtBdUABQALAAABMxUDIxMlMxUDIxMBANOkgVIBmtOkgVIF1az+wAFArKz+wAFAAAACAK7/EgNtAP4ABQALAAAlMxUDIxMlMxUDIxMCmtOkgVL+ZtOkgVL+rP7AAUCsrP7AAUAAAgCuA+kDbQXVAAUACwAAARUTIwM1IRUTIwM1AYFSgaQCbVKBpAXVrf7BAT+trf7BAT+tAAEAOf87A8cF1QALAAABMxEhFSERIxEhNSEBqLABb/6RsP6RAW8F1f5cmfujBF2ZAAEAOf87A8cF1QATAAAlIREjESE1IREhNSERMxEhFSERIQPH/pGw/pEBb/6RAW+wAW/+kQFv3/5cAaSaAh+ZAaT+XJn94QABATMB0QOFBCEACwAAATQ2MzIWFRQGIyImATOtfnyrrH19rAL6fKurfH2srAAAAQEzAYED1QRxAAUAAAEwETABMAEzAqIBgQLw/ogAAQDsAAABwQD+AAMAADczFSPs1dX+/gAAAgDsAAAEawD+AAMABwAAJTMVIyUzFSMDltXV/VbV1f7+/v4AAwDsAAAHFAD+AAMABwALAAAlMxUjJTMVIyUzFSMDltTUAqnV1fqt1dX+/v7+/v4AAQDcAmsBrwNpAAMAABMzFSPc09MDaf4ABwBx/+MKTAXwAAsAFwAjACcAMwA/AEsAAAEiBhUUFjMyNjU0JicyFhUUBiMiJjU0NgEyFhUUBiMiJjU0NiEzASMTIgYVFBYzMjY1NCYBMhYVFAYjIiY1NDYXIgYVFBYzMjY1NCYI9FdkZFdVY2NVnrq7naC6u/l0nry7n5+5ugQloPxaoB9WY2JXV2NkA7KeurudoLq7n1djY1dVY2MCkZSEgpWVgoOVf9y7u9vbu7zbAuDbu73a27y63PnzBY6VgoSUlISBlv2f3Lu729u7vNt/lISClZWCg5UAAAkAcf/jDXIF8AALABYAIgAtADcAOwBFAFAAXAAAASIGFRQWMzI2NTQmJzIWEAYjIiY1NDYFIgYVFBYzMjY1NCYnMhYQBiMiJjU0NgAgFhUUBiAmNTQlMwEjEiIGFRQWMjY1NAEyFhAGIyImNTQ2FyIGFRQWMzI2NTQmDBpXZGRXVWNjVZ66u52gurv9eVdkZFdVY2NVnrq7naC6u/jWATy8u/7CuQTfoPxaoHWsY2KuYwNOnrq7naC6u59XY2NXVWNjApGUhIKVlYKDlX/c/orb27u823+UhIKVlYKDlX/c/orb27u82wLg27u92tu8utz58wWOlYKElJSEgf413P6K29u7vNt/lISClZWCg5UAAQAoBGABoAXVAAMAABMTMwEorcv+3wRgAXX+iwD//wAoBGACzAXVECYCQQAAEAcCQQEsAAD//wAoBGAD+AXVECcCQQEsAAAQJgJBAAAQBwJBAlgAAAABACgEYAGgBdUAAwAAASMBMwGgV/7fywRgAXX//wAoBGACzAXVECYCRAAAEAcCRAEsAAD//wAoBGAD+AXVECYCRAAAECcCRAJYAAAQBwJEASwAAAABAAv+HQKr/8MABQAAASMnByMBAquUu7yVAVL+Hfn5AaYAAQCeAI0CcwQjAAYAAAEVAQEVATUCc/7TAS3+KwQjv/70/vS/AaJSAAEAwQCNApYEIwAGAAATARUBNQEBwQHV/isBLf7TBCP+XlL+Xr8BDAEMAAH+if/jAs0F8AADAAABMwEjAi2g/FygBfD58wACAD8CnAL0Bd8AAgANAAABASEDMxEzFSMVIzUhNQHd/ssBNRamh4eQ/mIFZv5dAhz95G26unkAAAEAAP/jBI8F8AAxAAABFSYmIyIGByEHIQYGFRQWFyEHIRYWMzI2NxUGBiMiAAMjNzM0JjU0NjUjNzMSADMyFgSPW6lmncogAkE3/eYCAQECAb44/oogyp1mqVtZuWDt/sso0zeLAQHCN5woATbsYrkFYtVpWsi7exguIyAuGHu7ylpp00hIASIBA3sXLyAjLxd7AQEBIkcAAf+5BJoAxwYSAAMAABEzAyPHdZkGEv6IAAAC/NcFDv8pBdkAAwAHAAABMxUjJTMVI/5ey8v+ecvLBdnLy8sAAAH9cwTu/vAF9gADAAABMwMj/je55JkF9v74AAAB/LYFDv9KBekAHQAAAScmJiMiBhUVIzQ2MzIWFxcWFjMyNjU1MwYGIyIm/fw5GR8MJCh9Z1YkPTA5FyIPICh9AmdUIjsFOSEOCzItBmV2EBseDQwzKQZkdxAAAAH9DATu/osF9gADAAABEyMD/cfEmeYF9v74AQgAAAH8zwTu/zEF+AAGAAABMxMjJwcj/aK804umposF+P72srIAAAH8zwTu/zEF+AAGAAABAzMXNzMD/aLTi6ami9ME7gEKsrL+9gAAAfzHBQb/OQX4AA0AAAMjJiYjIgYHIzY2MzIWx3YNY1NSYRB2CqCPkJ8FBjY5Nzh3e3oAAAH8xwUG/zkF+AANAAABMxYWMzI2NzMGBiMiJvzHdg1jU1JhEHYKoI+QnwX4Njk3OHd7egAB/ZoFDv5mBdsAAwAAATMVI/2azMwF280AAAL85gTu/7IF9gADAAcAAAEzAyMDMwMj/vm55JmLueSZBfb++AEI/vgAAAL8TgTu/xoF9gADAAcAAAETIwMhEyMD/QfEmeQCCMSZ5AX2/vgBCP74AQj//wGSBmMD6AgzECcAcQC9Aj0QBwJOBLwBVf//AZIGXgPoCDMQJwJWBLwBUBAHAHEAvQI9//8BkwZjA+UIWhAnAk8E8AJkEAcCTgS8AVX//wGTBmMD5QhaECcCUQSMAmQQBwJOBLwBVf//AXYGagQKCDMQJwJQBMABXBAHAHEAvQI9//8BiwZjA+0IWhAnAlMEvAJiEAcCTgS8AVUAAQAAAl8AXQAJAEMABQABAAAAAAAAAAAAAAAAAAMAAgAAABUAFQAVABUAKwA/AHsAxwEVAWMBcQGOAaoB0AHpAfkCBgISAiACUAJnApcC0wLwAyADXwNyA7kD9wQIBB4EMwRGBFoEkwUIBSQFWwWLBbMFywXgBhcGLwY8BlIGbQZ9BpsGswbnBwoHRwd4B7UHyAfqB/8IHwg+CFUIbAh+CI0Inwi1CMII0gkKCToJZgmWCcgJ6AonCkkKWwp2CpAKnQrRCvILHgtNC30LnAvXC/gMHAwwDE0MbQyMDKMM1QzjDRUNRQ1FDVwNmQ3EDg4OPA5RDqwOvw8uD20Pjw+fD6wQIhAvEFoQehCkEN4Q7BEeETkRRRFmEXwRqRHNEd0R7RH9EjYSQhJOEloSZhJyEqwS1BLgEuwS+BMEExATHBMoEzQTQBNyE34TihOWE6ITrhO6E9wUKRQ1FEEUTRRZFGUUihTQFNsU5hTxFPwVBxUSFW4VehWGFZIVnhWqFbYVwhXOFdoWHhYqFjUWQBZLFlYWYRZ7FsMWzhbZFuQW7xb6FyoXNRdBF0wXWBdjF28XexeHF5MXnxerF7cXwxfPF9sX5xfzF/sYNBhAGEwYWBhkGHAYfBiIGJQYoBisGLgYwxjPGNsY5xjzGP8ZCxkXGSMZSRl0GYAZjBmYGaQZsBm8GcgZ1BngGfAZ/BoIGhQaIBosGjgaUhpeGmoadhqCGo4amhqmGrIazxroGvQa/xsLGxcbIxsvGzsbaBuYG6Qbrxu7G8Yb0hveHBAcYhxuHHkchRyRHJ0cqBy0HL8cyxzWHOIc7Rz5HQUdEB0bHScdMx1RHX0diR2VHaEdrR25HcUd0R3cHegd9B4AHgweGB4kHjAeOx5HHlMeXh5qHnYegh6NHqge7B8tHzUfcx+fH9IgAiBAIHYgfiCxINghCyFNIWYhmiHWIfUiHiJeIp0i3CLyIwgjMyNWI2wjkCPLI+wj9CQtJDkkRSR/JLck5SUdJVAliCXDJcsl/SYpJkUmbiaKJpYmoibbJwonNSdoJ4wnryfnKB8oVSiLKMQo8ykfKVgpgimPKZspvSnFKdEp3SnpKfUqASoNKhkqJSoxKj0qSCpUKmAqbCp3KoMqjiqZKqUqsCq8Kscq0yreKuoq8ir9KwkrFCsgKywrOCt3K8Ur0SvcK+gr9CwALAwsGCwjLC8sOixGLFIsXixqLHYsgSyxLNws6Cz0LQAtDC0YLSQtMC07LUctUy1fLWstdy2DLY8tmy2nLbMtvy3LLdct4y3vLfsuBy4TLh8uKy43LkMuTy5bLmcucy5/Losu0S8aLyYvMi9UL6YwADBRMHcwnTCpMLUwwTDMMNcw4zDuMPoxBjESMR0xKTE1MUAxajGrMd8x9TJEMpMyyjMVM1wzdTOeM/o0JTRMNHM0szTkNOw1IDV1NZU1uTX3NjA2ZjaNNrQ24zcUN0g3UDdiN3U3jze1N9U4AjgXOCY4OzhROGo4eDiZOKY4uTjUOPg5IDktOTU5QjlPOVw5aTl1OYE5kjmjObM5xDnfOfo6FDouOkY6aTqAOo86mzqtOsU60Ts/O8c71jviO/I8ADwMPBw8LTxBPFY8ZDyAPMw82TzsPPo9KD03PUk9XD12PZA9nT2yPcg91T3iPe89/D4JPhYAAQAAAAJeuFV4kINfDzz1AB8IAAAAAADg+tE5AAAAAOaGaOn8Tv4BDXIIYAAAAAgAAgAAAAAAAATNAGYAAAAAAqoAAAKLAAADNQE1A64AxQa0AJ4FFwCqB5oAcQY9AIECMwDFAx8AsAMfAKQEAAA9BrQA2QKLAJ4C4wBkAosA2wKyAAAFFwCHBRcA4QUXAJYFFwCcBRcAZAUXAJ4FFwCPBRcAqAUXAIsFFwCBArIA8AKyAJ4GtADZBrQA2Qa0ANkEPwCTCAAAhwV5ABAFfQDJBZYAcwYpAMkFDgDJBJoAyQYzAHMGBADJAlwAyQJc/5YFPwDJBHUAyQbnAMkF/ADJBkwAcwTTAMkGTABzBY8AyQUUAIcE4//6BdsAsgV5ABAH6QBEBXsAPQTj//wFewBcAx8AsAKyAAADHwDHBrQA2QQA/+wEAACqBOcAewUUALoEZgBxBRQAcQTsAHEC0QAvBRQAcQUSALoCOQDBAjn/2wSiALoCOQDBB8sAugUSALoE5QBxBRQAugUUAHEDSgC6BCsAbwMjADcFEgCuBLwAPQaLAFYEvAA7BLwAPQQzAFgFFwEAArIBBAUXAQAGtADZAosAAAM1ATUFFwCsBRcAgQUXAF4FFwBSArIBBAQAAFwEAADXCAABGwPFAHME5QCeBrQA2QLjAGQIAAEbBAAA1QQAAMMGtADZAzUAXgM1AGIEAAFzBRcArgUXAJ4CiwDbBAABIwM1AIkDxQBgBOUAwQfBAIkHwQCJB8EAYgQ/AI8FeQAQBXkAEAV5ABAFeQAQBXkAEAV5ABAHywAIBZYAcwUOAMkFDgDJBQ4AyQUOAMkCXAA7AlwAogJc//4CXAAGBjMACgX8AMkGTABzBkwAcwZMAHMGTABzBkwAcwa0ARkGTABmBdsAsgXbALIF2wCyBdsAsgTj//wE1wDJBQoAugTnAHsE5wB7BOcAewTnAHsE5wB7BOcAewfbAHsEZgBxBOwAcQTsAHEE7ABxBOwAcQI5/8cCOQCQAjn/3gI5//QE5QBxBRIAugTlAHEE5QBxBOUAcQTlAHEE5QBxBrQA2QTlAEgFEgCuBRIArgUSAK4FEgCuBLwAPQUUALoEvAA9BXkAEATnAHsFeQAQBOcAewV5ABAE5wB7BZYAcwRmAHEFlgBzBGYAcQWWAHMEZgBxBZYAcwRmAHEGKQDJBRQAcQYzAAoFFABxBQ4AyQTsAHEFDgDJBOwAcQUOAMkE7ABxBQ4AyQTsAHEFDgDJBOwAcQYzAHMFFABxBjMAcwUUAHEGMwBzBRQAcQYzAHMFFABxBgQAyQUS/+UHVADJBY8AeAJc/+QCOf/TAlwAAwI5//ICXP/1Ajn/5AJcALACOQCWAlwAyQI5AMEEuADJBHIAwQJc/5YCOf/bBT8AyQSiALoEogC6BHUAyQI5AMEEdQDJAjkAiAR1AMkDAADBBHUAyQK8AMEEf//yAkYAAgX8AMkFEgC6BfwAyQUSALoF/ADJBRIAugaCAM0F/ADJBRIAugZMAHME5QBxBkwAcwTlAHEGTABzBOUAcQiPAHMILwBxBY8AyQNKALoFjwDJA0oAggWPAMkDSgC6BRQAhwQrAG8FFACHBCsAbwUUAIcEKwBvBRQAhwQrAG8E4//6AyMANwTj//oDIwA3BOP/+gMjADcF2wCyBRIArgXbALIFEgCuBdsAsgUSAK4F2wCyBRIArgXbALIFEgCuBdsAsgUSAK4H6QBEBosAVgTj//wEvAA9BOP//AV7AFwEMwBYBXsAXAQzAFgFewBcBDMAWALRAC8FFAAgBeH/lwV9AMkFFAC6BX0AAAUUAAAFoABzBZYAcwRmAHEGMwAKBo3/lwV9AMkFFABxBOUAcQUOAIMGTAB1BOoApASa/5YC0f9/BjMAcwV+AAgH3wC6AtQAyQJcAAoF9wDJBKIAuQI5AAoEvAA9B8sAsgX8/5YFEgC6BkwAcwdOAGcE5QB2B5cAcwYTAHEFN/+XBRQAuQWPAMkFFAByBCsAZAUOAMkCsP7yAyMANwTjABgDIwA3BOP/+gbdAK0FEgCwBh0ATgXEAMkF8//8BdgAPQV7AFwEMwBYBVQAoAVUAFwEnwBoBDMAcQUXAJYFVABdBJ8AaAQVAFgFFAC6AlwAyQPwAMkDrAAUAl0AyQtgAMkKZADJCTwAcQavAMkGSwDJA6cAwQdzAMkHZADJBmEAugV5ABAE5wB7Alz//gI5/+AGTABzBOUAcQXbALIFEgCuBdsAsgUSAK4F2wCyBRIArgXbALIFEgCuBdsAsgUSAK4E7ABxBXkAEATnAHsFeQAQBOcAewfLAAgH2wB7BjMAcwUUAHEGMwBzBRQAcQU/AMkEov/pBkwAcwTlAHEGTABzBOUAcQVUAKAEnwBYAjn/2wtgAMkKZADJCTwAcQYzAHMFFABxCOcAyQV1AMkF/ADJBRIAugV5ABAE5wB7B8sACAfbAHsGTABmBOUASAV5ABAE5wB7BXkAEATnAHsFDgDJBOwAcQUOAMkE7ABxAlz/pwI5/8MCXAAFAjn/4wZMAHME5QBxBkwAcwTlAHEFjwDHA0oAggWPAMkDSgC6BdsAsgUSAK4F2wCyBRIArgUUAIcEKwBvBOP/+gMjADcFBACcBCwARwYEAMkFEv/wBeIAyQa0AHEFlgBxBOIAcQV7AFwEMwBYBXkAEATnAHsFDgDJBOwAcQZMAHME5QBxBkwAcwTlAHEGTABzBOUAcQZMAHME5QBxBOP//AS8AD0DzACKBr4AugPRADcCOf/bB/wAcQf8AHEFef/9BZYADARmAAkEdQAKBOP/sgQrAG8EMwBYBNMAUAPVAFAFfQAKBdsADAV5ABAFDgDJBOwAcQJc/5YCOf/bBkAAcwUUAHEFjwAKA0oADgTj//YEvAALBOwAcQSfAFgCiwCyBAAAwQQAAMEEAADHBAAA7gQAAUwEAAC2BAAA8AAA/aIAAPzFAAD8XQAA/L8AAP4fAAD+8AAA/WoFeQAQBQ4AyQUSALoFfQDJAuMAZALjAGQFFwBkBAAAZAgAAGQIAAAABAABBAQA/+wCiwCuAosAsgKLAK4CiwCyBCUArgQlAK4EJQCuBCUArgQAADkEAAA5BLgBMwS4ATMCrQDsBVcA7AgAAOwCiwDcCrwAcQ3iAHEB0QAoAv0AKAQpACgB0QAoAv0AKAQpACgCtgALAzMAngMzAMEBVv6JAzUAPwUXAAAAAP+5AAD81wAA/XMAAPy2AAD9DAAA/M8AAPzPAAD8xwAA/McAAP2aAAD85gAA/E4FeAGSAZIBkwGTAXYBiwAAAAEAAAdt/h0AAA3i/E7+iQ1yAAEAAAAAAAAAAAAAAAAAAAJaAAEEDgGQAAUAAAUzBZkAAAEeBTMFmQAAA9cAZgISAAACCwYDAwgEAgIEgAAADwAAAAIAAAAAAAAAAFBmRWQAQAAgIKwGFP4UAZoHbQHjAAAAkwAAAAAAAAAAAAIAAAADAAAAFAADAAEAAAAUAAQAQAAAAAwACAACAAQAfgJPICcgOiCs//8AAAAgAKAgECAwIKz////j/8LiF+IP4aAAAQAAAAAAAAAAAAAAAAAAAAcAWgADAAEECQAAATAAAAADAAEECQABABYBMAADAAEECQACAAgBRgADAAEECQADABYBMAADAAEECQAEABYBMAADAAEECQAFABgBTgADAAEECQAGABQBZgBDAG8AcAB5AHIAaQBnAGgAdAAgACgAYwApACAAMgAwADAAMwAgAGIAeQAgAEIAaQB0AHMAdAByAGUAYQBtACwAIABJAG4AYwAuACAAQQBsAGwAIABSAGkAZwBoAHQAcwAgAFIAZQBzAGUAcgB2AGUAZAAuAAoAQwBvAHAAeQByAGkAZwBoAHQAIAAoAGMAKQAgADIAMAAwADYAIABiAHkAIABUAGEAdgBtAGoAbwBuAGcAIABCAGEAaAAuACAAQQBsAGwAIABSAGkAZwBoAHQAcwAgAFIAZQBzAGUAcgB2AGUAZAAuAAoARABlAGoAYQBWAHUAIABjAGgAYQBuAGcAZQBzACAAYQByAGUAIABpAG4AIABwAHUAYgBsAGkAYwAgAGQAbwBtAGEAaQBuAAoARABlAGoAYQBWAHUAIABTAGEAbgBzAEIAbwBvAGsAVgBlAHIAcwBpAG8AbgAgADIALgAzADcARABlAGoAYQBWAHUAUwBhAG4AcwADAAAAAAAA/9gAWgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAIAAL//wAD";
const FONT_BOLD_B64 = "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BW0AWAK+/9UCvgCsAr7/5QK+ACMFfwBYBbIArAV/AFgFfwBYBX8AWAV/AFgFfwBYBrQA2QV/AE4FsgCgBbIAoAWyAKAFsgCgBTcAGQW6AKwFNwAZBjEACgVmAFgGMQAKBWYAWAYxAAoFZgBYBd8AZgS+AFgF3wBmBL4AWAXfAGYEvgBYBd8AZgS+AFgGpAC8BboAXAa0ACEFugBcBXcAvAVtAFgFdwC8BW0AWAV3ALwFbQBYBXcAvAVtAFgFdwC8BW0AWAaRAGYFugBcBpEAZgW6AFwGkQBmBboAXAaRAGYFugBcBrIAvAWy/+0HygC8BlIApgL6ACACvgADAvoAQQK+ACQC+gAsAr4ADwL6ALwCvgCsAvoAvAK+AKwF9AC8BXwArAL6/40Cvv+8BjMAvAVSAKwFUgCsBRkAvAK+AKwFGQC8Ar4AkQUZALwD1gCsBRkAvAR0AKwFI/+kAvj/2wayALwFsgCsBrIAvAWyAKwGsgC8BbIArAfdAGkGsgCsBbIArAbNAGYFfwBYBs0AZgV/AFgGzQBmBX8AWAlWAGYIwQBYBikAvAPyAKwGKQC8A/IAkQYpALwD8gCsBcMAkwTDAGoFwwCTBMMAagXDAJMEwwBqBcMAkwTDAGoFdQAKA9MAGwV1AAoD0wAbBXUACgPTABsGfwC8BbIAoAZ/ALwFsgCgBn8AvAWyAKAGfwC8BbIAoAZ/ALwFsgCgBn8AvAWyAKAI0wA9B2QASAXL/+wFNwAZBcv/7AXNAFwEqABcBc0AXASoAFwFzQBcBKgAXAN7ACcFugASBn3/dAYZALwFugCsBhkAUQW6ADQF3wBmBd8AZgS+AFgGtAAhBwj/dAYOAJAFugBcBYAAWAV3ALwGywBoBZEAiQV3/40De/+LBpEAZgZYAAUIXACsA3wAvAMdAAoGMwC8BVIArALiAAoEvP/qCFYAqgay/40FsgCsBs0AZgb9AGwFfwBfCKkAZgdMAFgGQf90BboArAYpALwFwwA1BMMAHwV3ALwEav/AA9MAGwWnAB4D0wAbBXUACgavALsFsgCaBs0ANwaCALwGYf/sBjoAGQXNAFwEqABcBi4AlAYuAFQFIABMBKgAdQWRAKIGLgBUBSAATASVAEoFugCsAvoAvAVFALwEWgAKAvoAygxxALwLTAC8CmIAXAgTALwH1wC8BXwArAmsALwJcAC8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";
