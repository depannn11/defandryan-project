-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Admin can view all profiles
create policy "admin_select_all" on public.profiles for select using (
  exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
);

-- Create function to handle new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'user')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create trigger
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Create download_history table
create table if not exists public.download_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  video_url text not null,
  video_title text,
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for download_history
alter table public.download_history enable row level security;

-- Policies for download_history
create policy "download_history_select_own" on public.download_history for select using (auth.uid() = user_id);
create policy "download_history_insert_own" on public.download_history for insert with check (auth.uid() = user_id);

-- Admin can view all download history
create policy "admin_select_all_downloads" on public.download_history for select using (
  exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  )
);
