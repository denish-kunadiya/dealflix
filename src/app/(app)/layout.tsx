import AppNavbar from '@/components/(app)/navbar';

const AppLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-full">
      <AppNavbar />
      <div className="grow">{children}</div>
    </div>
  );
};

export default AppLayout;
