# Řešení potíží — nasazení

## Vercel ukazuje "Valid Configuration", ale prohlížeč hlásí "nemůže nalézt server"

**Jak to poznat:** ve Vercelu Settings → Domains je `admin.progma.cz` zeleně "Valid Configuration" — DNS záznam je tedy správně nastavený a Vercel ho vidí. Ale v prohlížeči se stránka nenačte a hlásí něco jako "Safari nemůže nalézt server" / "This site can't be reached".

**Co to znamená:** samotný DNS záznam je v pořádku, jen se ještě nerozšířil (nepropagoval) až ke konkrétnímu zařízení nebo síti, ze které se připojujete. To je normální — Vercel to vidí ze svého vlastního pohledu dřív, než se změna dostane ke všem DNS resolverům světa.

**Co zkusit:**

1. Zkuste to na mobilu **přes mobilní data, ne přes wifi** — jiná síť, jiný DNS resolver. Pokud tam to funguje, je to čistě otázka času.
2. Vyčistěte lokální DNS cache (macOS):
   ```bash
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   ```
3. Zkontrolujte globální stav propagace na [dnschecker.org](https://dnschecker.org) nebo [whatsmydns.net](https://www.whatsmydns.net) — zadejte `admin.progma.cz`, typ CNAME.
4. Počkejte — se zvoleným TTL 300 (5 minut) to typicky doputuje do půl hodiny až hodiny, ve výjimečných případech déle.

---

## Konkrétní řešení pro tenhle projekt: DNS u WEDOSu

Přesná příčina byla potvrzená přímo — ve WEDOS DNS panelu pro `progma.cz` chyběl jakýkoli záznam pro `admin` (jsou tam jen `www`, kořenová doména na GitHub Pages a e-mailové záznamy). Vercel u `admin.progma.cz` ukazoval **"Invalid Configuration"** a přesně napsal, co chybí.

**Postup ve WEDOSu (client.wedos.com → DNS → progma.cz → DNS záznamy):**

1. Klikněte **"nový záznam"**.
2. Vyplňte:
   - název: `admin`
   - typ: `CNAME`
   - data: `0d4d25bed75966aa.vercel-dns-017.com` (bez tečky na konci, stejný formát jako existující záznam `www` → `eiserik01.github.io`)
   - TTL: `300`
3. Uložte záznam.
4. **Klikněte "aplikovat změny"** — ve WEDOSu se nově přidané záznamy bez tohoto kroku neprojeví.
5. Počkejte na propagaci (minuty až desítky minut) a ve Vercelu na **Settings → Domains** klikněte **Refresh** u `admin.progma.cz`.

Pokud byste v budoucnu měnili hosting Progma Admin na jiný Vercel projekt, hodnotu CNAME najdete vždy znovu na stejném místě (Vercel → Settings → Domains → klik na doménu → "Show DNS configuration") — může se mírně lišit od téhle konkrétní hodnoty.

## Vlastní doména (`admin.progma.cz`) nefunguje, ale `*.vercel.app` adresa ano

**Jak to poznat:** ve Vercelu je `admin.progma.cz` normálně vypsaná v seznamu Domains, bez varovného trojúhelníku — vypadá to v pořádku. Náhodná adresa typu `progma.vercel.app` nebo `progma-xxxxx.vercel.app` funguje a ukazuje správný obsah (přihlašovací obrazovku Progma Admin). Ale `admin.progma.cz` v prohlížeči nic nenačte.

**Co to znamená:** appka je sestavená správně a Vercel doménu eviduje — ale to, že je doména "přidaná ve Vercelu", automaticky neznamená, že u vašeho poskytovatele domény existuje skutečný DNS záznam, který na Vercel návštěvníky nasměruje. To je oddělený, ruční krok.

**Oprava:**

1. Ve Vercelu: **Settings → Domains** → klikněte přímo na text `admin.progma.cz` (ne na ikonku externího odkazu vedle něj) — otevře se konfigurační detail. Ukáže buď zelené **"Valid Configuration"**, nebo přesně napíše, jaký záznam ještě chybí (obvykle: typ `CNAME`, název `admin`, hodnota `cname.vercel-dns.com`).
2. Přejděte tam, kde spravujete DNS pro `progma.cz` — pravděpodobně stejné místo, kde jste nastavoval záznam pro hlavní web na GitHub Pages.
3. Přidejte **nový, samostatný záznam** pro hostitele `admin` (ten je nezávislý na záznamech pro kořenovou doménu nebo `www`, které používá GitHub Pages) — s přesně tou hodnotou, kterou ukázal krok 1.
4. Uložte. DNS změny se projeví se zpožděním — klidně desítky minut až pár hodin. Zkuste to pak znovu v anonymním okně prohlížeče, ať vyloučíte starou verzi v cache.

## Vercel: varovný trojúhelník u "Assigning Custom Domains"

**Jak to poznat:** Deployment Details ukazuje build jako úspěšný (zelené fajfky), náhodná `.vercel.app` adresa toho konkrétního nasazení funguje a ukazuje správný obsah (třeba přihlašovací obrazovku Progma Admin), ale vlastní doména (`admin.progma.cz`) se nenačte a u řádku "Assigning Custom Domains" je oranžový/červený varovný trojúhelník.

**Co to znamená:** appka se sestavila správně — problém není v kódu ani v build nastavení, ale v tom, že Vercel se nepodařilo doméně přiřadit tenhle deployment. Nejčastěji jde o DNS.

**Jak to ověřit a opravit:**

1. Klikněte přímo na řádek "Assigning Custom Domains" — rozbalí se přesná hláška, co konkrétně nesedí.
2. V projektu: **Settings → Domains** → klikněte na `admin.progma.cz`. Vercel tam ukáže, jaký DNS záznam očekává (obvykle CNAME na `cname.vercel-dns.com`) a jestli ho aktuálně vidí správně nastavený.
3. U správce DNS pro `progma.cz` (tam, kde jste nastavovali i hlavní doménu) zkontrolujte, že existuje **CNAME záznam pro `admin`** ukazující přesně na hodnotu, kterou Vercel vyžaduje.
4. DNS změny se mohou promítnout se zpožděním (klidně desítky minut). Pokud jste záznam přidali nedávno, počkejte a zkuste **Refresh** v Settings → Domains.
5. Zkontrolujte, že `admin.progma.cz` není omylem přiřazená k **jinému** Vercel projektu z dřívějška (např. pokud jste během nastavování zkoušeli založit projekt vícekrát) — doména může platně patřit jen k jednomu projektu najednou. Pokud najdete duplicitu, doménu ve starém/nechtěném projektu odeberte (Settings → Domains → Remove).

---

## „Supabase není nastavený" i po vyplnění `.env.local`

Nejčastější příčina: **dev server (`npm run dev`) už běžel, když jste soubor vytvořili nebo upravili.** Vite čte `.env.local` jen při startu — pouhé obnovení stránky v prohlížeči nestačí.

**Oprava:**

1. Zastavte dev server (`Ctrl+C` v terminálu, kde běží).
2. Ověřte obsah souboru:
   ```bash
   cat .env.local
   ```
   Měly by tam být dva řádky přesně v tomto tvaru (bez uvozovek, bez mezer kolem `=`):
   ```
   VITE_SUPABASE_URL=https://vaseprojectref.supabase.co
   VITE_SUPABASE_ANON_KEY=vas-anon-public-klic
   ```
3. Zkontrolujte tři časté chyby:
   - Soubor se musí jmenovat přesně `.env.local` — textové editory (TextEdit, Poznámky) občas neviditelně přidají `.txt` na konec. `cat .env.local` v kroku 2 tohle zároveň ověří (kdyby se soubor jmenoval jinak, dostanete "No such file").
   - Musí být v **kořeni projektu**, ve stejné složce jako `package.json` — ne v `src/`.
   - Název proměnné musí začínat přesně `VITE_` — bez toho ho Vite do appky vůbec nepustí, i kdyby byl soubor jinak v pořádku.
4. Spusťte znovu `npm run dev` (nový start procesu, ne jen refresh v prohlížeči).

---

## Vercel: "Deployment failed with error" u projektu pro Progma Admin (admin)

**Jak to poznat:** v Build Logs vidíte řádek `Running "npm run build"` — správně by tam mělo být `Running "npm run build:admin"`. Pokud tam je jen `npm run build`, Vercel u tohohle projektu pořád staví **hlavní web**, ne Progma Admin, a buď to rovnou selže, nebo to sice doběhne, ale výstup skončí ve složce `dist/`, zatímco Vercel hledá `dist-admin/` (protože jste to tak nastavili) — nenajde ji a nahlásí chybu nasazení.

**Oprava — jen ve Vercel nastavení, žádný kód se nemění:**

1. V projektu, který má být `admin.progma.cz`, na Vercelu: **Settings → General → Build & Development Settings**.
2. U pole **Build Command** zapněte přepínač **"Override"** (bez něj Vercel vaše zadání ignoruje) a vyplňte:
   ```
   npm run build:admin
   ```
3. Stejně tak u **Output Directory** — zapněte Override a vyplňte:
   ```
   dist-admin
   ```
4. Uložte a v **Deployments** klikněte **Redeploy**.

Zapomenutý přepínač "Override" je nejčastější příčina — políčko je vyplněné správně, ale bez zapnutého přepínače se to potichu ignoruje a použije se výchozí odhad frameworku.

---

## `! [rejected] main -> main (fetch first)` při `git push`

**Tohle nesouvisí s tím, jestli web funguje.** `npm run deploy` (přes balíček `gh-pages`) nahrává sestavený web na samostatnou větev `gh-pages` a dělá to nezávisle na `main`. Pokud vám `npm run deploy` na konci napsalo `Published`, web se nasadil úspěšně, i když `git push` na `main` zrovna selhal.

**Proč k tomu dochází:** větev `main` na GitHubu obsahuje commit, který lokálně nemáte — typicky proto, že GitHub při nastavení vlastní domény přes **Settings → Pages** (webové rozhraní) sám připsal na `main` commit se souborem `CNAME`. Váš lokální git o něm neví, a git push podobné "přepsání cizí práce" ze zásady odmítne.

**Oprava:**

```bash
git pull origin main --no-rebase --no-edit
git push -u origin main
```

První příkaz stáhne a sloučí tu chybějící vzdálenou změnu do vaší lokální historie (`--no-edit` = nezobrazovat editor pro zprávu k mergi, použije se výchozí). Pokud by se objevil konflikt přímo v souboru `CNAME` (both strany ho mají, ale s jiným obsahem), otevřete ho v editoru, nechte tam jen řádek s vaší doménou (`progma.cz`), uložte, a pak:

```bash
git add CNAME
git commit -m "Vyřešen konflikt CNAME"
git push -u origin main
```

---

## Nevidím větev `gh-pages` vůbec / nevidím v ní `/assets`

Tohle znamená, že `npm run deploy` buď nikdy neproběhl, nebo proběhl a **selhal** — příkaz `gh-pages -d dist` v tom případě nic na GitHub nenahraje, ale často to není vidět na první pohled, pokud si nikdo nevšimne chybové hlášky v terminálu.

**Spusťte v terminálu, v kořenové složce projektu (tam, kde je `package.json`):**

```bash
npm install
npm run deploy
```

`npm install` je důležitý krok — pokud jste stáhli novější verzi projektu (tu, co už má `gh-pages` v `package.json`), ale předtím jste ho neinstalovali, příkaz `gh-pages` prostě neexistuje a `npm run deploy` selže hned na začátku.

**Po spuštění `npm run deploy` sledujte výstup v terminálu.** Nejčastější chybové hlášky a co znamenají:

| Chyba v terminálu | Co to znamená |
| --- | --- |
| `gh-pages: command not found` nebo podobné | `npm install` neproběhl / nedoinstaloval se `gh-pages` balíček. Zkuste `npm install` znovu a sledujte, jestli doběhne bez chyb. |
| `fatal: not a git repository` | Příkaz spouštíte mimo složku, kde jste dělali `git init` / `git clone`. Přesuňte se (`cd`) do správné složky projektu. |
| `remote: Permission denied` / `fatal: unable to access ... 403` | Nemáte oprávnění pushovat do repozitáře s aktuálně přihlášeným git účtem. Ověřte, že jste přihlášení jako `eiserik01` (nebo kdo je vlastník repozitáře), případně že máte nastavený přístupový token. |
| `error: src refspec dist does not match any` nebo appka doběhne, ale bez chyby, a přesto nic nevidíte | Build (`npm run build`) pravděpodobně selhal ještě před nahráváním — podívejte se o pár řádků výš v terminálu, jestli tam není chyba ze sestavování. |

**Nejrychlejší způsob, jak mi pomoct dál poradit:** zkopírujte sem celý výstup, co se objeví v terminálu po `npm run deploy` (i kdyby to vypadalo jako spousta nesrozumitelného textu — přesně tam bude vidět, kde se to zaseklo).

---

## „TypeError: 'text/jsx' is not a valid JavaScript MIME type"

**Co to znamená:** prohlížeč se pokouší spustit soubor `/src/main.jsx` přímo — tedy nezkompilovaný zdrojový kód, ne hotový sestavený web. Server ho posílá s MIME typem `text/jsx`, což prohlížeč jako `<script type="module">` odmítne spustit. Jinými slovy: **web pořád servíruje syrový zdrojový kód místo výstupu z `npm run build`.**

Tahle chyba se objeví jen v jednom případě: `index.html` v tom, co GitHub Pages skutečně servíruje, pořád obsahuje řádek

```html
<script type="module" src="/src/main.jsx"></script>
```

Sestavený web (obsah `dist/`) vypadá jinak — `index.html` tam odkazuje na něco jako `/assets/index-a1b2c3.js` (zkompilovaný, ohashovaný soubor), ne na `/src/main.jsx`. Pokud vidíte tuhle chybu, znamená to, že se buď sestavení nikdy nespustilo, nebo se spustilo, ale GitHub Pages ho stejně nepoužívá.

### Jak to ověřit a opravit

GitHub Pages má dvě nezávislá nastavení, která musí sedět k sobě: **jak se web sestaví** (Actions vs. ruční `npm run deploy`) a **odkud se servíruje** (Settings → Pages → Source/Branch). Nejčastější chyba je, že se nastaví jen jedno z toho.

**Pokud používáte GitHub Actions** (soubor `.github/workflows/deploy-pages.yml`):

1. Záložka **Actions** na GitHubu → poslední běh workflow "Deploy web na GitHub Pages" musí být zelený (úspěšný). Pokud je červený, klikněte na něj a podívejte se, na kterém kroku selhal.
2. **Settings → Pages → Build and deployment → Source** musí být nastaveno na **"GitHub Actions"** — ne "Deploy from a branch". Pokud tam pořád je "Deploy from a branch", Actions sice můžou doběhnout, ale GitHub Pages jejich výstup ignoruje a dál servíruje starou verzi z větve.

**Pokud používáte `npm run deploy`** (balíček `gh-pages`):

1. Na GitHubu v přepínači větví (nahoře nad seznamem souborů) zkontrolujte, že existuje větev **`gh-pages`** a že v ní `index.html` odkazuje na `/assets/...`, ne na `/src/main.jsx`.
2. **Settings → Pages → Build and deployment → Source** musí být **"Deploy from a branch"** a Branch musí být **`gh-pages`** (ne `main`!) se složkou `/ (root)`. Tohle je nejčastější zádrhel — pokud tam po `npm run deploy` zůstane vybraná větev `main`, web se dál servíruje ze starého zdrojového kódu, i když `gh-pages` větev se sestaveným webem existuje.

### Po opravě nastavení

- Uložení v Settings → Pages spustí nové nasazení — počkejte cca minutu.
- Prohlížeč si starou (rozbitou) verzi může držet v cache. Zkuste tvrdý reload (`Cmd+Shift+R` na Macu) nebo otevřete web v anonymním okně, ať vyloučíte cache jako příčinu.
- Pokud chyba přetrvává i po tvrdém reloadu a nastavení sedí, zkontrolujte v záložce **Network** v DevTools, jakou konkrétní URL prohlížeč pro `/src/main.jsx` volá — pomůže to poznat, jestli je problém v CDN cache, DNS, nebo pořád ve špatném nastavení Pages.
