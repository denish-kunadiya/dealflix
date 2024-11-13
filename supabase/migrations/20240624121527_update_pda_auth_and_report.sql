create policy "Allow logged-in all access"
  on public.pda_auth
  as permissive
  for all
  to public
  using ((auth.role() = 'authenticated'::text));

alter table public.report rename column inspection_id to fnm_inspection_id;
alter table public.report rename column ispection_status to fnm_inspection_status;
alter table public.report rename column validation_errors to fnm_validation_errors;
alter table public.report rename column required_photos to fnm_required_photos;
alter table public.report rename column missing_image_files to fnm_missing_image_files;
