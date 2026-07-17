# Řešení potíží — nasazení

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
