const OrderLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="pb-32 pt-8">{children}</div>;
};

export default OrderLayout;
