# Progma — web + interní administrace

Tento repozitář obsahuje **dvě aplikace** postavené na Reactu, Tailwind CSS a Framer Motion, sdílející stejný kód/design systém:

1. **Veřejný web** (`progma.cz`) — landing page pro klienty.
2. **Progma Admin** (`admin.progma.cz`) — interní CRM a prodejní nástroj pro Erika a Adama, se skutečným přihlašováním a sdílenými daty přes [Supabase](https://supabase.com) (nastavení v sekci [Supabase — sdílená data a přihlašování](#supabase--sdílená-data-a-přihlašování)).

Obě se sestavují z jednoho repozitáře, ale nasazují se jako dva samostatné weby na dvou doménách — postup je v sekci [Nasazení dvou webů z jednoho repozitáře](#nasazení-dvou-webů-z-jednoho-repozitáře).

## Spuštění lokálně

Potřebujete [Node.js](https://nodejs.org/) 18+ a **funkční Supabase projekt** (Progma Admin bez něj nejde spustit — veřejný web to nepotřebuje).

```bash
npm install
npm run dev
```

- Veřejný web poběží na `http://localhost:5173`.
- Progma Admin (admin) poběží na `http://localhost:5173/admin.html` — stejný dev server obsluhuje obě appky zároveň, není potřeba nic spouštět zvlášť. Bez nastaveného Supabase (viz níže) appka zobrazí srozumitelnou hlášku místo přihlašovací obrazovky.

## Build pro produkci

```bash
npm run build
```

Vygeneruje statický build **veřejného webu** do složky `dist/`.

```bash
npm run build:admin
```

Vygeneruje statický build **Progma Admin** do složky `dist-admin/`. Používá vlastní konfigurák (`vite.admin.config.js`) a po sestavení automaticky přejmenuje `admin.html` na `index.html`, aby fungoval jako samostatný web na `admin.progma.cz` (viz níže).

```bash
npm run preview        # náhled veřejného webu z dist/
npm run preview:admin  # náhled Progma Admin z dist-admin/
```

## Struktura projektu

```
├── index.html               # HTML shell veřejného webu
├── admin.html                # HTML shell Progma Admin (admin)
├── vite.config.js             # build veřejného webu (npm run build)
├── vite.admin.config.js       # build Progma Admin (npm run build:admin)
├── .env.local.example         # šablona pro Supabase klíče (zkopírovat jako .env.local)
├── supabase/
│   └── schema.sql               # SQL pro založení tabulek a zabezpečení v Supabase
├── src/
│   ├── main.jsx                # vstupní bod veřejného webu
│   ├── App.jsx                  # celá landing page (hero, ceník, tým, kontakt...)
│   ├── index.css                 # Tailwind + fonty — sdílené OBĚMA appkami
│   └── admin/
│       ├── main.jsx                # vstupní bod Progma Admin (obaluje appku přihlašováním)
│       ├── AdminAuth.jsx            # přihlašovací obrazovka (Supabase Auth)
│       ├── AuthContext.js            # sdílí přihlášeného uživatele a odhlášení po appce
│       ├── supabaseClient.js          # připojení k Supabase
│       ├── useSyncedTable.js           # hook: tabulka ↔ React state + realtime sync
│       └── AdminApp.jsx                # celé Progma Admin — dashboard, klienti, kalkulace...
├── public/                    # statické soubory veřejného webu (logo, favicon, showreel, tým...)
│   └── team/                    # fotky Erika, Adama a Maka
├── public-admin/               # statické soubory Progma Admin (vlastní robots.txt = zákaz indexace)
├── scripts/
│   └── rename-admin-entry.js    # pomocný skript pro build:admin
└── tailwind.config.js          # rozšíření Tailwind palety o fonty a animace — sdílené
```

## Logo a barvy

- **Logo** je uložené jako `public/logo.png` — čisté PNG s průhledným pozadím, takže funguje na jakémkoli podkladu (tmavá navigace, patička). Používá se v `Navbar` a `Footer` v `src/App.jsx` (`<img src="/logo.png" ... />`). Pro výměnu stačí nahradit tento soubor stejným názvem.
- **Favicon** (`public/favicon.png`, a stejná kopie v `public-admin/favicon.png` pro Progma Admin) — vaše skutečná značka, ne generovaná náhrada. Pro výměnu nahraďte oba soubory stejným názvem.
- **Barevná paleta** v `tailwind.config.js` (klíč `theme.extend.colors.violet`) je vyladěná přesně na barvu loga (odstín cca 283° — fialovo-purpurová, ne standardní modro-fialová z výchozí Tailwind palety). Protože je to napojené přes `violet-*` třídy, celý web (tlačítka, zvýraznění, gradienty) se drží stejného odstínu jako logo automaticky — není potřeba nic dohledávat ručně v komponentách. Pokud se logo v budoucnu změní, stačí přepočítat tuto paletu (odstín/sytost) a zbytek webu se přebarví sám.

## Zveřejnění a viditelnost ve vyhledávání (SEO)

Co je už v projektu připravené:

- **Meta title/description**, **Open Graph** a **Twitter card** tagy v `index.html` — určují, jak stránka vypadá ve výsledcích vyhledávání i při sdílení na sociálních sítích (`public/og-image.jpg`).
- **Strukturovaná data** (JSON-LD, typ `ProfessionalService`) v `index.html` — pomáhají Googlu pochopit, že jde o firmu s telefonem, e-mailem a působností v ČR.
- **`robots.txt`** a **`sitemap.xml`** v `public/` — říkají vyhledávačům, že mají stránku procházet.

**Než nasadíte, projděte a upravte:**

1. **Nahraďte `progma.cz` skutečnou doménou** na 4 místech: `index.html` (`canonical`, `og:url`, `og:image`, JSON-LD `url`/`logo`/`image`) a `public/robots.txt` (`Sitemap:`) a `public/sitemap.xml` (`<loc>`).
2. **Doplňte přesnou adresu** v JSON-LD bloku (`address`), pokud ji chcete zveřejnit — pomáhá to při zobrazení v lokálním vyhledávání.

**Kroky k zveřejnění, aby vás Google skutečně našel:**

1. **Nasaďte web na skutečnou doménu** (ne jen `*.vercel.app`) — postup je v sekci Nasazení výše. Vlastní doména je pro důvěryhodnost i SEO důležitá.
2. **Založte Firmu na Googlu** ([google.com/business](https://www.google.com/business/)) — pro lokální B2B služby (stavební firmy, autoservisy...) je tohle často důležitější než cokoli na webu samotném. Zobrazí vás to v mapách a lokálních výsledcích, i s recenzemi.
3. **Zaregistrujte doménu v [Google Search Console](https://search.google.com/search-console)** — ověříte vlastnictví (přes DNS záznam nebo meta tag) a odešlete `sitemap.xml`, aby Google věděl, že stránka existuje a má ji indexovat.
4. **Zaregistrujte se i v [Bing Webmaster Tools](https://www.bing.com/webmasters)** — menší podíl na trhu, ale rychlé a zdarma.
5. **Zápis do českých katalogů firem** (Firmy.cz, Seznam.cz Firmy) — zpětné odkazy odsud pomáhají důvěryhodnosti domény v očích vyhledávačů.
6. **Sledujte Core Web Vitals** (rychlost načítání, stabilita layoutu) přes [PageSpeed Insights](https://pagespeed.web.dev/) — Google rychlost webu bere v potaz při řazení ve výsledcích.

Organické vyhledávání se buduje týdny až měsíce, ne dny — nejrychlejší viditelnost pro nového klienta v praxi obvykle přijde z Firmy na Googlu a placené reklamy, ne z organického SEO.

## Co ještě doladit

- **Showreel na pozadí hero sekce** — hotovo, `public/showreel.mp4`, `public/showreel.webm` a `public/showreel-poster.jpg` jsou váš skutečný materiál (zkomprimovaný z původního souboru na cca 3,3 MB na verzi, ať web zbytečně nebrzdí). Pokud budete chtít video vyměnit za novější, prostě nahraďte tyto tři soubory stejnými názvy:

  | Soubor | K čemu slouží |
  | --- | --- |
  | `public/showreel.webm` | hlavní formát videa (VP9, menší) |
  | `public/showreel.mp4` | záložní formát (H.264) pro prohlížeče bez podpory webm |
  | `public/showreel-poster.jpg` | statický snímek — zobrazí se okamžitě a na mobilu úplně nahradí video |

  Video se zapíná jen na větších obrazovkách a jen když návštěvník nemá v systému zapnuté omezení pohybu (`prefers-reduced-motion`). Vpravo dole je navíc malé tlačítko pro ruční pauzu/přehrání.

- **Fotky týmu** — hotovo, Erik, Adam i Mako mají v `src/App.jsx` (pole `TEAM`) nastavené skutečné fotky (`/team/erik.jpg`, `/team/adam.jpg`, `/team/mako.jpg`). Pro výměnu stačí nahradit soubor ve `public/team/` stejným názvem.

- **Formulář v sekci Kontakt** je napojený na [Formspree](https://formspree.io) (bezplatná služba, která submit přepošle na váš e-mail — žádný vlastní server není potřeba). Než formulář začne opravdu odesílat poptávky, dokončete nastavení:

  1. Založte si zdarma účet na [formspree.io](https://formspree.io) a vytvořte nový formulář.
  2. Zkopírujte endpoint, který vám přidělí (tvar `https://formspree.io/f/xxxxxxxx`).
  3. V `src/App.jsx` najděte konstantu `FORM_ENDPOINT` (úplně nahoře v souboru) a vložte tam svůj endpoint místo placeholderu.

  Dokud endpoint nevyplníte, formulář po odeslání zobrazí srozumitelnou chybovou hlášku místo tichého selhání — nic se "nerozbije", jen to zatím nikam neodešle. Pokud budete chtít poptávky posílat i do CRM (např. Zapier, HubSpot) nebo mít plnou kontrolu, lze `handleSubmit` v komponentě `Contact` napojit na vlastní backend místo Formspree.

- **Kontaktní údaje** (telefon, e-mail, město) jsou v `src/App.jsx` na dvou místech — v sekci Kontakt a v patičce.

## Supabase — sdílená data a přihlašování

> Nejste si jistí, jak spolu GitHub, Vercel a Supabase vlastně souvisí a co kam patří? Přehledné vysvětlení celého toku je v [`VERCEL.md`](./VERCEL.md).

Progma Admin teď má skutečné přihlašování (ne jedno sdílené heslo v kódu) a data, která uvidíte vy i Adam zároveň, ať sedíte kdekoli. Zajišťuje to [Supabase](https://supabase.com) — hostovaná Postgres databáze s vestavěným přihlašováním, kterou appka volá přímo z prohlížeče (žádný vlastní server není potřeba, appka zůstává statická). Bezplatná vrstva na tohle bohatě stačí.

### 1. Založte projekt

1. Jděte na [supabase.com](https://supabase.com) → **Start your project** → přihlaste se (stačí přes GitHub).
2. **New Project** → dejte mu jméno (např. `progma-os`), zvolte heslo pro databázi (uložte si ho, budete ho potřebovat málokdy, ale je dobré ho mít) a region co nejblíž ČR (typicky `Central EU (Frankfurt)`).
3. Založení projektu chvíli trvá (cca 2 minuty).

### 2. Vytvořte tabulky

1. V levém menu klikněte na **SQL Editor**.
2. Otevřete soubor `supabase/schema.sql` z tohoto repozitáře, celý obsah zkopírujte a vložte do editoru.
3. Klikněte **Run**. Vytvoří se 3 tabulky (`clients`, `tasks`, `discount_codes`) se zabezpečením, které povoluje přístup jen přihlášeným uživatelům.

> **Už máte databázi se skutečnými daty a appka vám přibyla o nová pole** (kanály, úkoly navázané na klienta apod.)? `schema.sql` tabulky, které už existují, nepřepíše ani je nedoplní o nové sloupce. Místo něj spusťte `supabase/migration-crm-rozsireni.sql` — bezpečně doplní jen to, co chybí, bez ztráty dat.

### 3. Získejte API klíče

1. V levém menu **Project Settings → API**.
2. Zkopírujte **Project URL** a **anon public** klíč (ne `service_role` — ten je tajný a do appky nepatří).
3. Vytvořte v kořeni repozitáře soubor `.env.local` (zkopírujte `.env.local.example` a přejmenujte) a vyplňte:
   ```
   VITE_SUPABASE_URL=https://vaseprojectref.supabase.co
   VITE_SUPABASE_ANON_KEY=vas-anon-public-klic
   ```
4. Restartujte `npm run dev`, pokud běžel.

### 4. Založte účty pro Erika a Adama

V appce **není registrace** — to je záměr, ať si tam nikdo cizí sám nezaloží účet. Účty zakládáte vy:

1. V Supabase Dashboardu **Authentication → Users → Add user**.
2. Zadejte e-mail a heslo pro Erika, uložte. Zopakujte pro Adama.
3. Případně zaškrtněte "Auto Confirm User", ať nemusí potvrzovat e-mail.

Tím je hotovo lokálně — `npm run dev` a `http://localhost:5173/admin.html` by teď mělo zobrazit přihlašovací obrazovku, a po přihlášení uvidíte appku s daty z databáze.

### 5. Nastavte proměnné i na produkci (Vercel)

`.env.local` se nenahrává do gitu, takže totéž musíte zopakovat i pro nasazený web:

1. V projektu **progma-admin** na Vercelu → **Settings → Environment Variables**.
2. Přidejte `VITE_SUPABASE_URL` a `VITE_SUPABASE_ANON_KEY` se stejnými hodnotami jako v `.env.local`.
3. Redeploy (Vercel to při přidání proměnných obvykle nabídne sám).

### Co to reálně znamená

- **Sdílená data.** Když Adam na schůzce přidá klienta nebo vygeneruje objednávku, Erik ho uvidí na svém zařízení — appka poslouchá změny v databázi na pozadí (během pár vteřin, ne nutně okamžitě).
- **Skutečné zabezpečení.** Bez platného přihlášení (e-mail + heslo, které jste založili v Supabase) appka nejde vůbec otevřít, a databáze navíc odmítne jakýkoli dotaz bez platného přihlášení i kdyby někdo znal technické API adresy.
- **Zapomenuté heslo** — Erik nebo Adam si ho resetují stejně jako u jiných služeb, buď přes "Forgot password" flow (museli byste zapnout e-mailové notifikace v Supabase) nebo nejjednodušeji: vy jim ho ručně změníte v Dashboardu (Authentication → Users → tři tečky u uživatele → Reset password).

### Ještě doladit

- **Nahraďte kontaktní údaje dodavatele v PDF.** V `src/admin/AdminApp.jsx` najděte konstantu `SUPPLIER` (IČO, DIČ, adresa Progma) — teď jsou tam vymyšlené placeholder hodnoty, nahraďte je skutečnými registračními údaji vaší firmy.
- **PDF generování** funguje bez dalšího nastavování — knihovna (jsPDF) i český font s diakritikou jsou zabalené přímo v appce/kódu.

## Nasazení dvou webů z jednoho repozitáře

> Web se nezobrazuje správně nebo hází chybu v konzoli prohlížeče? Mrkněte do [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) — pokrývá nejčastější zádrhel (chyba `'text/jsx' is not a valid JavaScript MIME type` a jemu podobné).

Nejdřív nahrajte celý repozitář na GitHub:

```bash
git init
git add .
git commit -m "Progma web + Progma Admin"
git branch -M main
git remote add origin <URL vašeho repozitáře>
git push -u origin main
```

Teď potřebujete **dva samostatné projekty** u hostingu (např. Vercel), oba napojené na **stejný GitHub repozitář**, ale s jiným build příkazem a jinou doménou. Postup pro Vercel (Netlify funguje analogicky — místo "Project" tam říkají "Site", nastavení je téměř identické):

### 1. Veřejný web → `progma.cz`

1. Na [vercel.com](https://vercel.com) klikněte **Add New → Project** a vyberte tento GitHub repozitář.
2. Nastavení nechte výchozí: Build Command `npm run build`, Output Directory `dist`.
3. Po nasazení: **Settings → Domains** → přidejte `progma.cz` a `www.progma.cz`.

### 2. Progma Admin → `admin.progma.cz`

1. Znovu **Add New → Project** a vyberte **ten samý** GitHub repozitář (Vercel dovolí jeden repozitář použít ve více projektech).
2. V **Build & Development Settings** přepište:
   - Build Command: `npm run build:admin`
   - Output Directory: `dist-admin`
3. Dejte projektu jiný název (např. `progma-admin`), ať se odliší od prvního.
4. V **Environment Variables** přidejte `VITE_SUPABASE_URL` a `VITE_SUPABASE_ANON_KEY` (viz sekce [Supabase — sdílená data a přihlašování](#supabase--sdílená-data-a-přihlašování)) — bez nich se Progma Admin na produkci nepřipojí k databázi.
5. Po nasazení: **Settings → Domains** → přidejte `admin.progma.cz`.

### 3. DNS

U správce domény `progma.cz` (registrátor nebo DNS provider) přidejte:
- `A`/`CNAME` záznam pro `progma.cz` (a `www`) → dle instrukcí, které vám Vercel zobrazí u prvního projektu.
- `CNAME` záznam pro `admin` → dle instrukcí, které vám Vercel zobrazí u druhého projektu (typicky `cname.vercel-dns.com`).

DNS změny se mohou promítnout až několik hodin. Vercel automaticky vydá HTTPS certifikát pro obě domény, jakmile DNS ukazuje správně.

Od teď: každý `git push` na `main` automaticky přebuildí a nasadí **oba** weby zároveň (Vercel spustí obě konfigurace, protože jsou to dva propojené projekty na stejném repozitáři).

## Alternativa: nasazení hlavního webu na GitHub Pages

Pokud chcete `progma.cz` mít přes GitHub Pages místo Vercelu, jde to, ale **jen pro veřejný web** — vysvětlení proč u Progma Admin níže.

**Co se běžně stane, když v Settings → Pages necháte "Deploy from a branch":** GitHub servíruje soubory z repozitáře přesně tak, jak jsou, bez sestavení. Jenže `index.html` v tomhle projektu odkazuje na nezkompilovaný React/JSX kód (`/src/main.jsx`), který prohlížeč neumí spustit sám o sobě — proto se DNS připojí v pořádku (zelené "DNS check successful"), ale stránka zůstane prázdná. Potřebuje se `npm run build` — přesně to, co jinak dělá Vercel/Netlify automaticky.

**Oprava — možnost A, automaticky (workflow už je v repozitáři, `.github/workflows/deploy-pages.yml`):**

1. V repozitáři na GitHubu: **Settings → Pages → Build and deployment → Source** přepněte z "Deploy from a branch" na **"GitHub Actions"**.
2. Zkontrolujte, že `public/CNAME` obsahuje vaši doménu (`progma.cz`) — je tam už připravený, GitHub Pages ho potřebuje, aby si vlastní doménu pamatoval i po každém novém nasazení.
3. Po dalším `git push` na `main` se v záložce **Actions** spustí workflow, který projekt sestaví a nasadí. První běh trvá cca minutu.
4. Pole "Custom domain" v Settings → Pages nechte beze změny (`progma.cz` už tam máte a DNS funguje) — mění se jen zdroj nasazení, ne doména.

**Oprava — možnost B, ručně přes `npm run deploy`:** pokud radši sestavujete lokálně sami (jak jste zkoušeli), použijte balíček [`gh-pages`](https://www.npmjs.com/package/gh-pages), který je už v projektu připravený:

```bash
npm run deploy
```

Tenhle příkaz udělá `npm run build` a pak sám nahraje **jen obsah `dist/`** (ne celý projekt) do samostatné větve `gh-pages` — přesně tam, odkud to GitHub Pages umí servírovat bez zmatků s `.gitignore` nebo podsložkami. V **Settings → Pages → Source** pak zvolte "Deploy from a branch", větev `gh-pages`, složka `/ (root)`. Při každé změně webu pak stačí znovu spustit `npm run deploy`.

Nepoužívejte možnost A i B zároveň zbytečně — stačí jedna. Actions (možnost A) je pohodlnější, protože nemusíte na nic pamatovat; `npm run deploy` (možnost B) dává větší kontrolu nad tím, kdy přesně se web aktualizuje.

**Proč Progma Admin (admin.progma.cz) takhle nejde:** GitHub Pages umí na jeden repozitář napojit jen jednu vlastní doménu. Vercel to obchází tak, že stejný repozitář naimportujete jako dva samostatné projekty (viz výše) — na GitHub Pages by to znamenalo založit **druhý, samostatný repozitář** jen pro Progma Admin. Je to řešitelné, ale je to zbytečná práce navíc oproti Vercelu, který tohle zvládá nativně a k tomu ještě férově zvládá proměnné prostředí pro Supabase. Pokud chcete Progma Admin opravdu nasadit, doporučuju se u něj držet Vercelu/Netlify i kdyby hlavní web běžel na GitHub Pages — klidně napište, pomůžu založit ten druhý repozitář, kdybyste přesto chtěli zůstat čistě u GitHubu.
