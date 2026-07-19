-- Progma Admin — nastavení databáze v Supabase
--
-- Postup:
-- 1. V Supabase Dashboardu otevřete svůj projekt.
-- 2. Vlevo v menu klikněte na "SQL Editor".
-- 3. Vložte sem celý tento soubor a klikněte "Run".
-- 4. Hotovo — appka si při prvním spuštění sama naplní tabulky ukázkovými
--    daty (klienti, úkoly, slevové kódy), stejnými jako v prototypu.

-- ============================== KLIENTI ==============================

create table if not exists clients (
  id bigint generated always as identity primary key,
  company text not null,
  contact text not null default '',
  industry text not null default '',
  status text not null default 'novy_lead',
  "packageId" text,
  "potentialPackageId" text,
  "commitmentId" text not null default 'none',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  ico text not null default '',
  dic text not null default '',
  since text not null default '',
  website text not null default '',
  tags text[] not null default '{}',
  "leadSource" text not null default '',
  owner text not null default '',
  channels text[] not null default '{}',
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================== ÚKOLY ==============================

create table if not exists tasks (
  id bigint generated always as identity primary key,
  text text not null,
  assignee text not null default '',
  due text not null default '',
  done boolean not null default false,
  "clientId" bigint references clients(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ============================== SLEVOVÉ KÓDY ==============================

create table if not exists discount_codes (
  id bigint generated always as identity primary key,
  code text not null unique,
  type text not null default 'percent',
  value numeric not null default 0,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================== ZABEZPEČENÍ ==============================
-- Přístup mají jen přihlášení uživatelé (Erik a Adam) — nikdo jiný, i kdyby
-- znal veřejný "anon" klíč z appky, se bez přihlášení k datům nedostane.

alter table clients enable row level security;
alter table tasks enable row level security;
alter table discount_codes enable row level security;

drop policy if exists "authenticated full access" on clients;
create policy "authenticated full access" on clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full access" on tasks;
create policy "authenticated full access" on tasks
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated full access" on discount_codes;
create policy "authenticated full access" on discount_codes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================== REALTIME ==============================
-- Aby se změny jednoho člověka hned promítly druhému, tabulky musí být
-- v realtime publikaci. Pokud tenhle příkaz spadne s chybou, že tabulka už
-- v publikaci je, je to v pořádku — jen to znamená, že Supabase to má
-- zapnuté už ve výchozím stavu (dá se ověřit i v Dashboardu pod
-- Database → Replication).

alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table discount_codes;
