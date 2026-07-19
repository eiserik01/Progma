-- Migrace: rozšíření CRM (kanály, úkoly navázané na klienty, atd.)
--
-- Tenhle skript je bezpečné spustit i na databázi, kde už máte reálná data —
-- každý příkaz použije "if not exists", takže nic nesmaže ani nepřepíše.
-- Pokud už sloupec existuje, příkaz se prostě přeskočí.
--
-- Postup: Supabase Dashboard → SQL Editor → vložit celý tento soubor → Run.

alter table clients add column if not exists website text not null default '';
alter table clients add column if not exists tags text[] not null default '{}';
alter table clients add column if not exists "leadSource" text not null default '';
alter table clients add column if not exists owner text not null default '';
alter table clients add column if not exists channels text[] not null default '{}';

alter table tasks add column if not exists "clientId" bigint references clients(id) on delete set null;
