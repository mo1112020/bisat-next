-- site_settings table
create table if not exists public.site_settings (
  key        text primary key,
  value      text not null,
  label      text not null default '',
  type       text not null default 'text',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "public read site_settings"
  on public.site_settings for select using (true);

create policy "service role all site_settings"
  on public.site_settings for all using (auth.role() = 'service_role');

-- site_images public read policy (table already exists, just missing the policy)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'site_images'
      and policyname = 'public read site_images'
  ) then
    execute 'create policy "public read site_images" on public.site_images for select using (true)';
  end if;
end
$$;
