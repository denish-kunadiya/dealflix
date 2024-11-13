alter table "public"."order" add column "started_at" timestamp with time zone;

INSERT INTO role_permissions (role, permission) VALUES ('photographer', 'order.update');


