import { Input } from '@/components/ui/input';
const OrdersSearchBar = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center gap-10">
      <div className="text-2xl font-bold text-slate-900">{label}</div>
      <div className="">
        <Input
          placeholder="Type of Search"
          type="search"
          className="w-96"
        />
      </div>
    </div>
  );
};

export default OrdersSearchBar;
