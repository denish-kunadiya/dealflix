alter table "public"."profile" add column "email" character varying;

alter table "public"."order" drop constraint if exists "order_assignee_id_fkey";
alter table "public"."order" add constraint "order_assignee_id_fkey" foreign key (assignee_id) references profile(user_id) not valid;
alter table "public"."order" validate constraint "order_assignee_id_fkey";

alter table "public"."order" drop constraint if exists "order_creator_id_fkey";
alter table "public"."order" add constraint "order_creator_id_fkey" foreign key (creator_id) references profile(user_id) not valid;
alter table "public"."order" validate constraint "order_creator_id_fkey";

alter table "public"."order" add column "borrower_contact_info" character varying;
alter table "public"."order" add column "lender_contact_phone" text;

alter table "public"."report" drop constraint "report_order_id_fkey";
alter table "public"."report" add constraint "public_report_order_id_fkey" foreign key (order_id) references "order"(id) on delete cascade not valid;
alter table "public"."report" validate constraint "public_report_order_id_fkey";

alter table "public"."report" drop constraint "report_user_id_fkey";
alter table "public"."report" add constraint "report_user_id_fkey" foreign key (user_id) references profile(user_id) not valid;
alter table "public"."report" validate constraint "report_user_id_fkey";

alter table "public"."role" drop constraint if exists "role_user_id_fkey";
alter table "public"."role" add constraint "role_user_id_fkey" foreign key (user_id) references profile(user_id) not valid;
alter table "public"."role" validate constraint "role_user_id_fkey";

grant select on table "public"."role" to "authenticated";

create policy "Allow authorized read access"
on "public"."role"
as permissive
for select
to authenticated
using (authorize('role.read'::app_permission));

insert into role_permissions (role, permission)
values ('admin', 'role.read')
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('photographer', 'report.delete')
on conflict (role, permission) do nothing;

CREATE TABLE public.order_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  user_id uuid NOT NULL,
  order_status order_status NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT order_history_order_id_fkey
    FOREIGN KEY (order_id)
    REFERENCES public.order(id)
    ON DELETE CASCADE,
  CONSTRAINT order_history_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES public.profile(user_id)
);
comment on table public.order_history is 'Order status history.';

alter table "public"."order_history" enable row level security;

create policy "Enable delete for authenticated users only"
on "public"."order_history"
as permissive
for delete
to authenticated
using (true);

create policy "Enable insert for authenticated users only"
on "public"."order_history"
as permissive
for insert
to authenticated
with check (true);

create policy "Enable read access for authenticated users only"
on "public"."order_history"
as permissive
for select
to authenticated
using (true);

create policy "Enable update for authenticated users only"
on "public"."order_history"
as permissive
for update
to authenticated
using (true)
with check (true);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'extensions', 'auth', 'public'
AS $function$
BEGIN
  INSERT INTO public.profile (user_id, first_name, last_name, phone, postal_code,email, location)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'first_name'::varchar,
      NEW.raw_user_meta_data->>'last_name'::varchar,
      NEW.raw_user_meta_data->>'phone'::varchar,
      NEW.raw_user_meta_data->>'postal_code'::varchar,
      NEW.raw_user_meta_data->>'email'::varchar,
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

CREATE OR REPLACE FUNCTION public.get_orders_with_history(creator_id uuid)
  RETURNS jsonb
  LANGUAGE plpgsql
AS $function$
DECLARE
  result_json JSONB;
BEGIN
  SELECT jsonb_agg(result)
  INTO result_json
  FROM (
    SELECT
      o.*,  -- Select all fields from the "order" table
      CASE
        WHEN p.user_id IS NOT NULL THEN
          jsonb_build_object(
            'user_id', p.user_id,
            'first_name', p.first_name,
            'last_name', p.last_name,
            'email', p.email
          )
        ELSE
          NULL
      END AS assignee,
      (
        SELECT jsonb_build_object(
          'id', h.id,
          'status', h.order_status,
          'user_id', h.user_id,
          'created_at', h.created_at
        )
        FROM order_history h
        WHERE h.order_id = o.id
        ORDER BY h.created_at DESC
        LIMIT 1
      ) AS last_updated
    FROM
      "order" o
    LEFT JOIN profile p ON o.assignee_id = p.user_id
    ORDER BY
      o.created_at ASC
  ) AS result;

  RETURN result_json;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_filtered_orders(p_creator_id uuid DEFAULT NULL::uuid, p_assigned_id uuid DEFAULT NULL::uuid, p_status text DEFAULT NULL::text, p_onsite_contact_name text DEFAULT NULL::text, p_onsite_contact_phone text DEFAULT NULL::text, p_created_at timestamp without time zone DEFAULT NULL::timestamp without time zone, p_state text DEFAULT NULL::text, p_city text DEFAULT NULL::text, p_street_address text DEFAULT NULL::text, p_postal_code text DEFAULT NULL::text, p_floors_number integer DEFAULT NULL::integer, p_search_val text DEFAULT NULL::text)
  RETURNS jsonb
  LANGUAGE plpgsql
AS $function$
DECLARE
  result_json JSONB;
BEGIN
  SELECT jsonb_agg(result)
  INTO result_json
  FROM (
    SELECT
      o.*,  -- Select all fields from the "order" table
      CASE
        WHEN p.user_id IS NOT NULL THEN
          jsonb_build_object(
            'user_id', p.user_id,
            'first_name', p.first_name,
            'last_name', p.last_name,
            'email', p.email
          )
        ELSE
          NULL
      END AS assignee,
      (
        SELECT jsonb_build_object(
          'id', h.id,
          'status', h.order_status,
          'user_id', h.user_id,
          'created_at', h.created_at
        )
        FROM order_history h
        WHERE h.order_id = o.id
        ORDER BY h.created_at DESC
        LIMIT 1
      ) AS last_updated
    FROM
      "order" o
    LEFT JOIN profile p ON o.assignee_id = p.user_id
    WHERE
      (p_assigned_id IS NULL OR o.assignee_id = p_assigned_id)
      AND (p_status IS NULL OR o.status = p_status)
      AND (p_onsite_contact_name IS NULL OR o.onsite_contact_name = p_onsite_contact_name)
      AND (p_onsite_contact_phone IS NULL OR o.onsite_contact_phone = p_onsite_contact_phone)
      AND (p_created_at IS NULL OR DATE(o.created_at) = DATE(p_created_at)) -- Filter by date part of created_at
      AND (p_state IS NULL OR o.state = p_state)
      AND (p_city IS NULL OR o.city = p_city)
      AND (p_street_address IS NULL OR o.street_address = p_street_address)
      AND (p_postal_code IS NULL OR o.postal_code = p_postal_code)
      AND (p_floors_number IS NULL OR o.floors_number = p_floors_number)
      AND (
        p_search_val IS NULL OR (
          o.state ILIKE '%' || p_search_val || '%' OR
          o.city ILIKE '%' || p_search_val || '%' OR
          o.street_address ILIKE '%' || p_search_val || '%'
        )
      )
    ORDER BY
      o.created_at ASC
  ) AS result;

  RETURN result_json;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_update_order()
  RETURNS trigger
  LANGUAGE plpgsql
AS $function$
BEGIN
  -- Check if the trigger was fired due to an INSERT or an UPDATE on the status column
  -- and only proceed if auth.uid() is not null
  IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.status IS DISTINCT FROM OLD.status)) AND auth.uid() IS NOT NULL THEN
    INSERT INTO order_history(order_id, user_id, order_status)
    VALUES (NEW.id, auth.uid(), NEW.status::order_status);
  END IF;
  
  RETURN NEW;
END;
$function$
;

CREATE TRIGGER order_change_trigger AFTER INSERT OR UPDATE OF status ON public."order" FOR EACH ROW EXECUTE FUNCTION trigger_update_order();

