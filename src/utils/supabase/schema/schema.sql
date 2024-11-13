CREATE SCHEMA "auth";

CREATE TYPE "app_role" AS ENUM (
  'admin',
  'photographer'
);

CREATE TYPE "app_permission" AS ENUM (
  'order.create',
  'order.read',
  'order.update',
  'order.delete'
);

CREATE TABLE "report" (
  "id" uuid PRIMARY KEY,
  "order_id" uuid,
  "user_id" uuid,
  "inspection_id" varchar DEFAULT null,
  "inspection_report" jsonb DEFAULT null,
  "inspection_status" varchar DEFAULT 'INCOMPLETE',
  "validation_errors" jsonb DEFAULT null,
  "required_photos" jsonb DEFAULT null,
  "missing_image_files" jsonb DEFAULT null,
  "appraisal_requirements_messages" jsonb DEFAULT null,
  "messages" jsonb DEFAULT null
);

CREATE TABLE "order" (
  "id" uuid PRIMARY KEY,
  "creator_id" uuid,
  "assignee_id" uuid,
  "status" varchar,
  "created_at" timestamptz,
  "updated_at" timestamptz,
  "street_address" varchar NOT NULL,
  "city" varchar NOT NULL,
  "state" varchar NOT NULL,
  "postal_code" int NOT NULL,
  "floors_number" int NOT NULL,
  "onsite_contact_name" varchar NOT NULL,
  "onsite_contact_phone" varchar NOT NULL,
  "onsite_contact_email" varchar NOT NULL,
  "deliver_email" varchar NOT NULL,
  "delivery_company" varchar,
  "delivery_name" varchar,
  "delivery_phone" varchar,
  "borrower_name" varchar NOT NULL,
  "amc_name" varchar NOT NULL,
  "lender_name" varchar NOT NULL,
  "type" varchar NOT NULL,
  "is_rush" bool
);

CREATE TABLE "order_history" (
  "id" INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "order_id" uuid,
  "user_id" uuid,
  "type" varchar NOT NULL,
  "action" varchar NOT NULL,
  "created_at" timestamptz
);

CREATE TABLE "profile" (
  "user_id" uuid PRIMARY KEY,
  "first_name" varchar(255) NOT NULL,
  "last_name" varchar(255) NOT NULL,
  "postal_code" varchar(5),
  "work_radius" int NOT NULL DEFAULT 100,
  "updated_at" timestamptz,
  "blocked_at" timestamptz,
  "deleted_at" timestamptz
);

CREATE TABLE "role" (
  "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" uuid NOT NULL,
  "role" app_role NOT NULL
);

CREATE TABLE "role_permissions" (
  "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "role" app_role NOT NULL,
  "permission" app_permission NOT NULL
);

CREATE TABLE "auth"."users" (
  "id" uuid PRIMARY KEY,
  "email" varchar
);

CREATE UNIQUE INDEX ON "role" ("user_id", "role");

CREATE UNIQUE INDEX ON "role_permissions" ("role", "permission");

COMMENT ON COLUMN "report"."inspection_status" IS 'enum: COMPLETE, INCOMPLETE';

COMMENT ON COLUMN "profile"."user_id" IS 'UUID from auth.users';

COMMENT ON COLUMN "profile"."work_radius" IS 'miles or kms?';

COMMENT ON COLUMN "profile"."updated_at" IS 'db trigger';

ALTER TABLE "report" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "report" ADD FOREIGN KEY ("user_id") REFERENCES "profile" ("user_id");

ALTER TABLE "order" ADD FOREIGN KEY ("assignee_id") REFERENCES "profile" ("user_id");

ALTER TABLE "order" ADD FOREIGN KEY ("creator_id") REFERENCES "profile" ("user_id");

ALTER TABLE "order_history" ADD FOREIGN KEY ("user_id") REFERENCES "profile" ("user_id");

ALTER TABLE "order_history" ADD FOREIGN KEY ("order_id") REFERENCES "order" ("id");

ALTER TABLE "role" ADD FOREIGN KEY ("user_id") REFERENCES "profile" ("user_id");

ALTER TABLE "profile" ADD FOREIGN KEY ("user_id") REFERENCES "auth"."users" ("id");