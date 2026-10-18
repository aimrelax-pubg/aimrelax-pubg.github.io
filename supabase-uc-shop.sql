-- AIMRELAX PUBG UC shop: initial secure order system
-- Run in Supabase SQL Editor before using uc-shop.html.
-- Package prices intentionally start at 0; replace with your real AMD prices before accepting orders.

CREATE TABLE IF NOT EXISTS public.uc_packages (
  id text PRIMARY KEY,
  title text NOT NULL,
  uc_amount integer NOT NULL CHECK (uc_amount > 0),
  price_amd integer NOT NULL DEFAULT 0 CHECK (price_amd >= 0),
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);

INSERT INTO public.uc_packages (id, title, uc_amount, price_amd, active, sort_order)
VALUES
  ('uc60', '60 UC', 60, 0, true, 1),
  ('uc325', '325 UC', 325, 0, true, 2),
  ('uc660', '660 UC', 660, 0, true, 3),
  ('uc1800', '1800 UC', 1800, 0, true, 4),
  ('uc3850', '3850 UC', 3850, 0, true, 5),
  ('uc8100', '8100 UC', 8100, 0, true, 6)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.uc_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id text NOT NULL REFERENCES public.uc_packages(id),
  uc_amount integer NOT NULL CHECK (uc_amount > 0),
  price_amd integer NOT NULL CHECK (price_amd > 0),
  player_id text NOT NULL CHECK (length(player_id) BETWEEN 5 AND 32),
  player_nickname text,
  payment_method text NOT NULL CHECK (payment_method IN ('idram', 'bank_transfer')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  delivery_status text NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'processing', 'delivered', 'failed')),
  provider_order_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.uc_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uc_orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.uc_packages FROM anon, authenticated;
REVOKE ALL ON public.uc_orders FROM anon, authenticated;
GRANT SELECT ON public.uc_packages TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can view active UC packages" ON public.uc_packages;
CREATE POLICY "Authenticated users can view active UC packages"
ON public.uc_packages FOR SELECT TO authenticated
USING (active = true);

DROP POLICY IF EXISTS "Users can view own UC orders" ON public.uc_orders;
CREATE POLICY "Users can view own UC orders"
ON public.uc_orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.list_uc_packages()
RETURNS TABLE (id text, title text, uc_amount integer, price_amd integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT p.id, p.title, p.uc_amount, p.price_amd
  FROM public.uc_packages p
  WHERE p.active = true
  ORDER BY p.sort_order, p.uc_amount;
$$;

REVOKE ALL ON FUNCTION public.list_uc_packages() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_uc_packages() TO authenticated;

CREATE OR REPLACE FUNCTION public.create_uc_order(
  p_package_id text,
  p_player_id text,
  p_player_nickname text DEFAULT NULL,
  p_payment_method text DEFAULT 'idram'
)
RETURNS TABLE (order_id uuid, package_title text, uc_amount integer, price_amd integer, payment_status text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_package public.uc_packages%ROWTYPE;
  v_order_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Պատվեր ստեղծելու համար մուտք գործեք հաշիվ։';
  END IF;

  IF p_payment_method NOT IN ('idram', 'bank_transfer') THEN
    RAISE EXCEPTION 'Վճարման եղանակը սխալ է։';
  END IF;

  IF p_player_id IS NULL OR length(btrim(p_player_id)) < 5 OR length(btrim(p_player_id)) > 32
     OR btrim(p_player_id) !~ '^[0-9]+$' THEN
    RAISE EXCEPTION 'Մուտքագրեք ճիշտ PUBG Player ID։';
  END IF;

  SELECT * INTO v_package
  FROM public.uc_packages
  WHERE id = p_package_id AND active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'UC փաթեթը հասանելի չէ։';
  END IF;

  IF v_package.price_amd <= 0 THEN
    RAISE EXCEPTION 'Այս փաթեթի գինը դեռ սահմանված չէ։';
  END IF;

  INSERT INTO public.uc_orders (
    user_id, package_id, uc_amount, price_amd,
    player_id, player_nickname, payment_method
  )
  VALUES (
    v_user_id, v_package.id, v_package.uc_amount, v_package.price_amd,
    btrim(p_player_id), nullif(btrim(p_player_nickname), ''), p_payment_method
  )
  RETURNING id INTO v_order_id;

  RETURN QUERY
  SELECT v_order_id, v_package.title, v_package.uc_amount, v_package.price_amd, 'pending'::text;
END;
$$;

REVOKE ALL ON FUNCTION public.create_uc_order(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_uc_order(text, text, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.list_my_uc_orders()
RETURNS TABLE (
  id uuid, uc_amount integer, price_amd integer, player_id text,
  player_nickname text, payment_method text, payment_status text,
  delivery_status text, created_at timestamptz
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT o.id, o.uc_amount, o.price_amd, o.player_id, o.player_nickname,
         o.payment_method, o.payment_status, o.delivery_status, o.created_at
  FROM public.uc_orders o
  WHERE o.user_id = auth.uid()
  ORDER BY o.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.list_my_uc_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_my_uc_orders() TO authenticated;

-- Admin-only UC order management. Only the site owner's authenticated UUID may use these RPCs.
CREATE OR REPLACE FUNCTION public.admin_list_uc_orders()
RETURNS TABLE (
  id uuid, user_id uuid, package_title text, uc_amount integer, price_amd integer,
  player_id text, player_nickname text, payment_method text, payment_status text,
  delivery_status text, created_at timestamptz
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM '5f1c951f-1e76-4f82-9849-46becf038b55'::uuid THEN
    RAISE EXCEPTION 'Մուտքն արգելված է։';
  END IF;

  RETURN QUERY
  SELECT o.id, o.user_id, p.title, o.uc_amount, o.price_amd,
         o.player_id, o.player_nickname, o.payment_method, o.payment_status,
         o.delivery_status, o.created_at
  FROM public.uc_orders o
  JOIN public.uc_packages p ON p.id = o.package_id
  ORDER BY o.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_uc_order(
  p_order_id uuid,
  p_payment_status text,
  p_delivery_status text
)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS DISTINCT FROM '5f1c951f-1e76-4f82-9849-46becf038b55'::uuid THEN
    RAISE EXCEPTION 'Մուտքն արգելված է։';
  END IF;

  IF p_payment_status NOT IN ('pending','paid','failed','refunded') THEN
    RAISE EXCEPTION 'Վճարման կարգավիճակը սխալ է։';
  END IF;
  IF p_delivery_status NOT IN ('pending','processing','delivered','failed') THEN
    RAISE EXCEPTION 'Առաքման կարգավիճակը սխալ է։';
  END IF;

  UPDATE public.uc_orders
  SET payment_status = p_payment_status,
      delivery_status = p_delivery_status
  WHERE id = p_order_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Պատվերը չի գտնվել։';
  END IF;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_uc_orders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_uc_orders() TO authenticated;
REVOKE ALL ON FUNCTION public.admin_update_uc_order(uuid, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_update_uc_order(uuid, text, text) TO authenticated;
