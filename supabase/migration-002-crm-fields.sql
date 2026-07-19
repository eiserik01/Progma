-- Migrace 002 — rozšíření CRM o další pole
--
-- Tohle spusťte v Supabase SQL Editoru JEDNOU, navíc k původnímu schema.sql
-- (ten spouštět znovu netřeba a ani by nevadilo — používá "if not exists").
-- Tahle migrace jen PŘIDÁVÁ nové sloupce k existujícím tabulkám, žádná
-- stávající data (klienty, úkoly, kódy) nijak nemaže ani nemění.

-- Klienti: web, štítky, zdroj leadu, zodpovědná osoba, aktivní kanály
alter table clients add column if not exists website text not null default '';
alter table clients add column if not exists tags text[] not null default '{}';
alter table clients add column if not exists "leadSource" text not null default '';
alter table clients add column if not exists owner text not null default '';
alter table clients add column if not exists channels text[] not null default '{}';

-- Úkoly: volitelné propojení na konkrétního klienta
alter table tasks add column if not exists "clientId" bigint references clients(id) on delete set null;
