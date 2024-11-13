import AdminAppNavbar from '@/components/(app)/admin/navbar';

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-full">
      <AdminAppNavbar />
      <div className="grow">{children}</div>
    </div>
  );
};

export default AdminLayout;
