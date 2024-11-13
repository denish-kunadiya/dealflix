create type "public"."fnm_image_status" as enum ('meta_verified', 'meta_rejected', 'fnm_accepted', 'fnm_rejected');

CREATE TABLE public.order_property_images (
    id uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES public.order(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.profile(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
    image_group character varying,
    image_type character varying,
    image_name character varying,
    fnm_status fnm_image_status,
    uploaded_metadata jsonb DEFAULT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);
comment on table public.order_property_images is 'Service data for order_property_images bucket.';

alter table "public"."order_property_images" enable row level security;

create policy "Enable select for authenticated users only"
on "public"."order_property_images"
as permissive
for select
to authenticated
using (true);

create policy "Enable insert for authenticated users only"
on "public"."order_property_images"
as permissive
for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users only"
on "public"."order_property_images"
as permissive
for update
to authenticated
using (true)
with check (true);

create policy "Enable delete for authenticated users only"
on "public"."order_property_images"
as permissive
for delete
to authenticated
using (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('order_property_image', 'order_property_image', false);

CREATE POLICY "Enable select for authenticated users only" ON storage.objects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update access for authenticated users only" ON storage.objects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete access for authenticated users only" ON storage.objects FOR DELETE TO authenticated USING (true);
