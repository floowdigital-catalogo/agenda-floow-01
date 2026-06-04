-- ─────────────────────────────────────────────────────────────
-- Agenda FLOOW — esquema do Supabase
--
-- Cole TODO este conteúdo no SQL Editor do Supabase e clique em "Run".
-- Cria uma tabela key-value que espelha a API window.storage do app.
-- ─────────────────────────────────────────────────────────────

create table if not exists agenda_store (
  key        text primary key,
  value      text,
  shared     boolean default true,
  updated_at timestamptz default now()
);

-- Atualiza updated_at automaticamente a cada gravação.
create or replace function agenda_store_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_agenda_store_touch on agenda_store;
create trigger trg_agenda_store_touch
  before insert or update on agenda_store
  for each row execute function agenda_store_touch();

-- Segurança em nível de linha (RLS).
alter table agenda_store enable row level security;

-- Ferramenta INTERNA de equipe: acesso liberado usando a chave anônima.
-- A senha de cada usuário é controlada DENTRO do app (aba Config).
-- Se quiser algo mais restrito depois, troque por policies com Supabase Auth.
drop policy if exists "equipe_floow_all" on agenda_store;
create policy "equipe_floow_all"
  on agenda_store for all
  using (true) with check (true);
