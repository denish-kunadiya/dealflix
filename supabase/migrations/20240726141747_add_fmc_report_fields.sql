alter table public.report add column fmc_inspection_id varchar default null;
alter table public.report add column fmc_inspection_status report_status default 'INCOMPLETE';
alter table public.report add column fmc_validation_errors jsonb default null;
alter table public.report add column fmc_required_photos jsonb default null;
alter table public.report add column fmc_missing_image_files jsonb default null;
