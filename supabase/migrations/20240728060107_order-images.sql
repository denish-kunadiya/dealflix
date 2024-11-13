CREATE TABLE public.order_images (
  "id" UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "order_id" UUID REFERENCES public.order(id) ON DELETE CASCADE NOT NULL,
  "user_id" UUID REFERENCES public.profile(user_id) ON DELETE CASCADE NOT NULL,
  "image_group" VARCHAR,
  "image_type" VARCHAR,
  "image_name" VARCHAR,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "description" VARCHAR,
  "is_other" BOOLEAN NOT NULL DEFAULT FALSE
);
comment on table public.order_images is 'Service data for order_images bucket.';

alter table "public"."order_images" enable row level security;

INSERT INTO storage.buckets (id, name, public) VALUES ('order_image', 'order_image', false);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_order_images(p_order_id uuid)
 RETURNS TABLE(identifier text, number_of_images integer, first_image_url text)
 LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  WITH order_identifiers AS (
    SELECT
      CAST(oi.order_id AS TEXT) AS identifier,
      oi.order_id,
      NULL AS image_group
    FROM order_images oi
    WHERE oi.order_id = p_order_id

    UNION ALL
    
    SELECT
      oi.image_group AS identifier,
      NULL AS order_id,
      oi.image_group
    FROM order_images oi
    WHERE oi.order_id = p_order_id
      AND oi.image_group NOT IN (p_order_id::TEXT)
  ),

  order_details AS (
    SELECT
      oi.identifier,
      (
        SELECT oi2.image_name 
        FROM order_images oi2 
        WHERE (
          (oi2.order_id = p_order_id) AND 
          (oi2.image_group = oi.identifier OR oi2.order_id::TEXT = oi.identifier)
        )
        ORDER BY oi2.created_at 
        LIMIT 1
      ) AS first_image_name
    FROM order_identifiers oi
  ),

  order_image_count AS (
    SELECT
      oi.image_group AS identifier,
      COUNT(*)::INT AS number_of_images
    FROM order_images oi
    WHERE oi.order_id = p_order_id
    GROUP BY oi.image_group

    UNION ALL

    SELECT
      CAST(oi.order_id AS TEXT) AS identifier,
      COUNT(*)::INT AS number_of_images
    FROM order_images oi
    WHERE oi.order_id = p_order_id
    GROUP BY oi.order_id
  )

  SELECT
    od.identifier,
    oic.number_of_images,
    CONCAT(p_order_id::TEXT, '/', od.first_image_name) AS first_image_url
  FROM order_details od
  JOIN order_image_count oic ON od.identifier = oic.identifier
  WHERE od.identifier != p_order_id::TEXT
  GROUP BY od.identifier, od.first_image_name, oic.number_of_images;
END;
$function$
;

create policy "Enable delete for users based on user_id"
on "public"."order_images"
as permissive
for delete
to public
using (auth.uid()  = user_id);

create policy "Enable create for authenticated users only"
on "public"."order_images"
as permissive
for insert
to authenticated
with check (true);

create policy "Enable select for authenticated users only"
on "public"."order_images"
as permissive
for select
to authenticated
using (true);

create policy "Enable update for authenticated users only"
on "public"."order_images"
as permissive
for update
to authenticated
using (true);
