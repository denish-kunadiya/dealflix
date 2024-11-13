create extension if not exists "postgis" with schema "extensions";

alter table "public"."order" add column "location" geography(Point,4326);

alter table "public"."profile" add column "location" geography(Point,4326);

CREATE INDEX order_location_idx ON public."order" USING gist (location);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_orders(tlongitude double precision DEFAULT NULL::double precision, tlatitude double precision DEFAULT NULL::double precision, distance numeric DEFAULT NULL::numeric)
 RETURNS SETOF "order"
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF tlongitude IS NOT NULL AND tlatitude IS NOT NULL AND distance IS NOT NULL THEN
        RETURN QUERY 
        SELECT * FROM "order"
        WHERE st_distance(location, st_point(tlongitude, tlatitude)::geography) < distance;
    ELSE
        RETURN QUERY 
        SELECT * FROM "order";
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_location(user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    result JSONB;
BEGIN
  SELECT 
    jsonb_build_object(
      'latitude', ST_Y(profile.location::geometry),
      'longitude', ST_X(profile.location::geometry)
    )
  INTO result
  FROM 
    public.profile AS profile
  WHERE 
    profile.user_id = get_user_location.user_id;

  -- If no location found, return null or an empty object
  IF NOT FOUND THEN
    RETURN '{}'::JSONB; -- or RETURN NULL;
  END IF;

  RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'extensions', 'auth', 'public'
AS $function$
BEGIN
  INSERT INTO public.profile (user_id, first_name, last_name, phone, postal_code, location)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name'::varchar,
      NEW.raw_user_meta_data->>'last_name'::varchar,
      NEW.raw_user_meta_data->>'phone'::varchar,
      NEW.raw_user_meta_data->>'postal_code'::varchar,
      ST_SetSRID(ST_MakePoint(
        (NEW.raw_user_meta_data->>'longitude')::float8,
        (NEW.raw_user_meta_data->>'latitude')::float8
      ), 4326)::extensions.geography
    );
  INSERT INTO public.role (user_id, role) VALUES (NEW.id, 'photographer');

  RETURN NEW;
END;
$function$
;


