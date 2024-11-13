'use client';

import OrdersSearchBar from './search-bar';
import OrderCardInProgress from './order-card-in-progress';

const OrdersInProgress = ({ orders }: { orders: any }) => {
  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-10">
      <header className="mt-8">
        <OrdersSearchBar label="Orders" />
      </header>
      <main className="mt-14">
        <div className="flex flex-col gap-5">
          {orders.map((item: any) => (
            <OrderCardInProgress
              key={item.id}
              order={item}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default OrdersInProgress;
