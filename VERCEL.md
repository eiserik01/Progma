# Jak to celé zapadá do sebe — GitHub, Vercel, Supabase

Tři různé služby, tři různé role. Zmatek většinou vzniká z toho, že to zní podobně technicky, ale dělají úplně jiné věci.

## Tři kusy skládačky

**GitHub** — sklad zdrojového kódu. Nic víc. Appka tam neběží, jen tam leží soubory a jejich historie. Veřejně (nebo mezi spolupracovníky) viditelné, takže tam **nikdy nepatří hesla ani tajné klíče**.

**Vercel** — bere kód z GitHubu, spustí `npm run build:admin` (sestaví appku do statických souborů) a ty pak servíruje na `admin.progma.cz`. Vercel navíc umí appce za běhu "našeptat" tajné hodnoty (proměnné prostředí), aniž by byly kdekoliv v kódu na GitHubu.

**Supabase** — samotná databáze a přihlašování. Ty dva klíče (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) jsou jako adresa a vstupní klíč k tomu, kam se appka má připojit.

Tok je: **GitHub → (Vercel to vezme a sestaví) → výsledek běží na admin.progma.cz → ten se za běhu připojí na Supabase pomocí těch dvou klíčů, které mu Vercel předal.**

## Proč ty klíče nejdou do GitHubu

`.env.local` je schválně v `.gitignore` — soubor existuje jen na vašem počítači, na GitHub se nikdy nenahraje. Kdyby se klíč dostal do repozitáře, uvidí ho každý, kdo k repu má přístup, navždy v historii (i kdybyste ho pak smazali).

Mimochodem — `VITE_SUPABASE_ANON_KEY` není tak citlivý jako heslo k databázi: jde o tzv. veřejný klíč, který stejně uvidí kdokoli, kdo si appku otevře v prohlížeči a podívá se do síťového provozu. Skutečnou bezpečnost zajišťuje nastavení v Supabase (Row Level Security — bez přihlášení appka nic nezmůže, i kdyby klíč měl kdokoli). I tak se ale drží mimo GitHub — je to jen čistá praxe: konfigurace zvlášť od kódu.

Proto se klíče vkládají **přímo do nastavení Vercelu** — appka je při sestavování/běhu dostane, ale v žádném souboru na GitHubu nejsou.

## Co přesně teď udělat

Podle toho, co jste popsal, máte: kód na GitHubu ✓, Supabase projekt s klíči ✓, Vercel projekt, který appku umí sestavit ✓. Chybí jediné: **říct Vercelu, jaké ty dva klíče jsou.**

1. Na [vercel.com](https://vercel.com) otevřete projekt, který servíruje `admin.progma.cz`.
2. **Settings → Environment Variables.**
3. Přidejte dva záznamy (hodnoty zkopírujte přesně z vašeho `.env.local`):
   - Key: `VITE_SUPABASE_URL` → Value: (vaše URL)
   - Key: `VITE_SUPABASE_ANON_KEY` → Value: (váš klíč)
   - U obou zaškrtněte aspoň **Production** (klidně i Preview a Development, ať to funguje všude).
4. **Save.**
5. **Redeploy.** Tohle je důležitý krok, na který se často zapomíná — Vercel proměnné nepoužije retroaktivně na už hotový build. Jděte do **Deployments**, u posledního nasazení klikněte na tři tečky → **Redeploy**. (Nebo stačí počkat na příští `git push` — ten spustí nové sestavení automaticky.)

## Pak už jen doména

Tohle jsme řešili v `TROUBLESHOOTING.md` — **Settings → Domains → `admin.progma.cz`** by po chvíli mělo ukazovat zeleně "Valid Configuration". Pokud ne, je to samostatný DNS problém, ne problém s klíči.

## Jak poznat, že je to celé v pořádku

Otevřete `admin.progma.cz` v prohlížeči (klidně v anonymním okně, ať vyloučíte cache) a měli byste vidět přihlašovací obrazovku Progma Admin — ne bílou stránku, ne "Systém není připraven". Po přihlášení by se měla objevit stejná data, co vidíte lokálně přes `npm run dev`.

## Veřejný, nebo soukromý repozitář?

Než půjdete s Progma naplno ven (Firma na Googlu, sociální sítě), stojí za to se rozhodnout.

**Není tam únik tajemství.** Supabase klíče nikdy nebyly v gitu (jsou jen ve Vercelu), skuteční klienti nejsou v kódu vůbec — žijí v Supabase databázi. To, co je v repozitáři vidět, je zdrojový kód a fiktivní ukázková data.

**Přesto má smysl chtít repozitář soukromý** — jde spíš o to nezveřejňovat zbytečně obchodní logiku (jak počítáte slevy, jak vypadá CRM zevnitř), ne o skutečnou bezpečnostní díru.

**Háček:** GitHub Pages (na čem běží `progma.cz`) na zdarma plánu vyžaduje **veřejný** repozitář. Přepnutí na soukromý by hlavní web rozbilo, dokud byste nezaplatili GitHub Pro (~4 $/měsíc).

**Čistší cesta:** přesunout i hlavní web na Vercel (druhý projekt, stejně jako Progma Admin) — Vercel na zdarma Hobby plánu soukromé repozitáře u osobního GitHub účtu podporuje bez příplatku. Pak jde repozitář zavřít bez placení GitHub Pro.

**Vedlejší poznámka k Vercelu:** jeho zdarma Hobby plán je podle podmínek určený pro osobní/nekomerční použití. Progma je reálná firma, takže formálně vzato patří na Pro (20 $/měsíc), jakmile jde o ostrý komerční provoz. V praxi na Hobby běží spousta malých firem bez problémů, ale je dobré to vědět dopředu, ne až by to jednou začalo vadit.
