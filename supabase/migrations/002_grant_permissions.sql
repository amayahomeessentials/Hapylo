-- Run this in your Supabase SQL Editor to grant API access to the tables

-- Grant access to the service_role (Admin API access)
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.categories TO service_role;
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.addresses TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;

-- Grant access to authenticated users (Logged in API access)
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.addresses TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.order_items TO authenticated;

-- Grant access to anon (Public API access)
GRANT ALL ON public.profiles TO anon;
GRANT ALL ON public.categories TO anon;
GRANT ALL ON public.products TO anon;
GRANT ALL ON public.addresses TO anon;
GRANT ALL ON public.orders TO anon;
GRANT ALL ON public.order_items TO anon;

-- Grant sequence access if any (for serials, though we use UUIDs mostly)
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role, authenticated, anon;
