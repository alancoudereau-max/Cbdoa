-- ============================================================================
--  CBDoux — schéma de base de données (PostgreSQL / Supabase)
--  À exécuter une seule fois dans Supabase → SQL Editor → New query → Run.
--  Le site utilise la clé service_role côté serveur : RLS activé, aucune
--  politique publique → rien n'est accessible depuis le navigateur.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ───────────────────────────── Commandes ─────────────────────────────
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  status text not null default 'pending'
    check (status in ('pending','awaiting_pickup_payment','paid','preparing','shipped','ready_for_pickup','delivered','cancelled','failed','expired','refunded')),
  payment_provider text,
  payment_id text,
  payment_status text,
  payment_method text,
  email text not null,
  phone text,
  first_name text not null,
  last_name text not null,
  shipping_method text not null,
  shipping_address jsonb,
  pickup_point text,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  promo_code text,
  notes text,
  tracking_number text,
  tracking_url text,
  age_confirmed boolean not null default false,
  prudence_ack boolean not null default false,
  cgv_accepted boolean not null default false,
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  shipped_at timestamptz
);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_email_idx on public.orders (lower(email));
create index if not exists orders_payment_id_idx on public.orders (payment_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  variant_sku text not null,
  name text not null,
  variant_label text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  total_cents integer not null check (total_cents >= 0)
);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

-- ───────────────────────────── Stock (disponibilité par variante) ─────────────────────────────
-- Une ligne = une variante indisponible ou forcée. Sans ligne, la variante est disponible.
create table if not exists public.stock (
  variant_sku text primary key,
  product_slug text not null,
  available boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ───────────────────────────── Codes promo ─────────────────────────────
create table if not exists public.promo_codes (
  code text primary key,
  type text not null check (type in ('percent','fixed')),
  value integer not null check (value > 0), -- % ou centimes
  min_subtotal_cents integer not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  max_uses integer,
  uses integer not null default 0,
  description text,
  created_at timestamptz not null default now()
);

-- Code de bienvenue (10 € dès 100 € d'achat) — modifiable dans /admin
insert into public.promo_codes (code, type, value, min_subtotal_cents, description)
values ('BIENVENUE10', 'fixed', 1000, 10000, '10 € offerts dès 100 € — offre de bienvenue')
on conflict (code) do nothing;

-- ───────────────────────────── Messages de contact ─────────────────────────────
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ───────────────────────────── Journal des webhooks (debug) ─────────────────────────────
create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  external_id text,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- ───────────────────────────── Horodatage automatique ─────────────────────────────
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();

-- ───────────────────────────── Compteur d'utilisation des codes promo ─────────────────────────────
create or replace function public.increment_promo_use(p_code text) returns void language sql as $$
  update public.promo_codes set uses = uses + 1 where code = p_code;
$$;

-- ───────────────────────────── Sécurité : RLS sans politique publique ─────────────────────────────
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.stock enable row level security;
alter table public.promo_codes enable row level security;
alter table public.contact_messages enable row level security;
alter table public.webhook_events enable row level security;
