-- Fix typo in tables permissions
drop policy "Allow authorized create access" on public.report;
drop policy "Allow authorized create access" on public.order;
create policy "Allow authorized create rows access" on public.report for insert with check (authorize('report.create'));
create policy "Allow authorized create rows access" on public.order for insert with check (authorize('order.create'));

-- Add missing permissions
insert into role_permissions (role, permission)
values ('photographer', 'order.update')
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('photographer', 'order.read') 
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('photographer', 'report.create') 
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('admin', 'order.create')
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('admin', 'order.read')
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('admin', 'order.update')
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('admin', 'order.delete')
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('admin', 'report.read')
on conflict (role, permission) do nothing;

insert into role_permissions (role, permission)
values ('admin', 'profile.read')
on conflict (role, permission) do nothing;
