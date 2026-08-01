-- Leaderboard RPC function
-- Aggregates XP from user_data and joins with auth.users for display info

create or replace function get_leaderboard(
  time_range text default 'all',
  limit_count int default 50
)
returns table (
  rank bigint,
  user_id uuid,
  display_name text,
  avatar_url text,
  xp bigint,
  streak bigint
)
language plpgsql
security definer
as $$
begin
  return query
  select
    row_number() over (order by coalesce((ud.data->>'xp')::bigint, 0) desc) as rank,
    ud.user_id,
    coalesce(
      u.raw_user_meta_data->>'display_name',
      u.raw_user_meta_data->>'full_name',
      split_part(u.email, '@', 1)
    ) as display_name,
    (u.raw_user_meta_data->>'avatar_url')::text as avatar_url,
    coalesce((ud.data->>'xp')::bigint, 0) as xp,
    coalesce((ud.data->'streak'->>'count')::bigint, 0) as streak
  from user_data ud
  join auth.users u on u.id = ud.user_id
  where ud.data_type = 'progress'
    and (
      time_range = 'all'
      or (time_range = 'week' and ud.updated_at >= now() - interval '7 days')
      or (time_range = 'month' and ud.updated_at >= now() - interval '30 days')
    )
  order by xp desc
  limit limit_count;
end;
$$;
