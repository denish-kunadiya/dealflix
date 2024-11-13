import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import _debounce from 'lodash/debounce';
import { usePathname } from 'next/navigation';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

interface IProps {
  label: string;
  handleDrawerToggle?: () => void | undefined;
  resetFilters?: () => void;
  displayClearFilter?: boolean | undefined;
  setFilter?: Dispatch<SetStateAction<OrderFilter>>;
}

const OrderHeader: React.FC<IProps> = ({
  label,
  handleDrawerToggle,
  resetFilters,
  displayClearFilter,
  setFilter,
}) => {
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState('In Progress');
  const tabs = [
    { name: 'In Progress', href: '#', current: selectedTab === 'In Progress' },
    { name: 'Complete', href: '#', current: selectedTab === 'Complete' },
  ];

  const getTabStatus = (tab: string): ActiveTab => {
    switch (tab) {
      case 'In Progress':
        return 'IN_PROGRESS';
      case 'Complete':
        return 'COMPLETE';
      default:
        throw new Error('Invalid tab value');
    }
  };

  const handleStatusChange = (tab: string) => {
    if (selectedTab === tab) {
      return;
    }
    setSelectedTab(tab);
    if (setFilter) {
      setFilter((prev: OrderFilter) => ({
        ...prev,
        activeTab: getTabStatus(tab),
      }));
    }
  };

  const debounceSearch = useCallback(
    _debounce((value: string) => {
      setFilter?.((prev: OrderFilter) => ({
        ...prev,
        searchVal: value.trim(),
      }));
    }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl pb-[58px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="me-10 text-2xl font-bold text-slate-900">{label}</h1>
              <div className="relative ">
                <Input
                  type="text"
                  placeholder={
                    pathname === '/orders' ? 'Search address, state, city...' : 'Type of Search'
                  }
                  className=" h-9 w-[394px]  placeholder:font-medium placeholder:text-slate-400 focus:border-0 focus-visible:border-0"
                  onChange={(e) => debounceSearch(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                  <Icon
                    icon="search"
                    size="sm"
                    className="me-2.5 h-5 w-5 text-slate-400"
                  />
                </div>
              </div>
            </div>
            <div className="flex  items-center">
              {pathname === '/orders' ? (
                <>
                  {displayClearFilter && (
                    <Button
                      onClick={resetFilters}
                      size="sm"
                      className="mr-2.5 w-24"
                      variant={'ghost'}
                    >
                      Reset
                    </Button>
                  )}
                  <Button
                    variant={'outline'}
                    size="sm"
                    className="w-24 border"
                    onClick={() => handleDrawerToggle && handleDrawerToggle()}
                  >
                    <Icon
                      icon="filter"
                      size="sm"
                      className="text-sky-500"
                    />
                    <span className="ms-2 text-base font-bold text-sky-500"> Filters</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="sm:hidden">
                    <label
                      htmlFor="tabs"
                      className="sr-only"
                    >
                      Select a tab
                    </label>
                    <select
                      id="tabs"
                      name="tabs"
                      className="block w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <nav
                      className="isolate flex h-9 w-[236px] divide-x divide-slate-200 rounded-lg shadow"
                      aria-label="Tabs"
                    >
                      {tabs.map((tab, tabIdx) => (
                        <a
                          key={tab.name}
                          href={tab.href}
                          className={`${selectedTab === tab.name ? 'bg-sky-500 text-white' : 'text-slate-700'}
                            ${tabIdx === 0 ? 'rounded-l-lg' : ''}
                            ${tab.name === 'Complete' ? 'min-w-[111px]' : 'min-w-[125px]'}
                           ${tabIdx === tabs.length - 1 ? 'rounded-r-lg' : ''}
                             relative flex h-9 min-w-[125px]  items-center justify-center overflow-hidden  text-center text-base font-medium hover:opacity-85 focus:z-10`}
                          aria-current={tab.current ? 'page' : undefined}
                          onClick={() => handleStatusChange(tab.name)}
                        >
                          <span>{tab.name}</span>
                        </a>
                      ))}
                    </nav>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default OrderHeader;
