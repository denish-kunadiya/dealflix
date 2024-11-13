import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import _debounce from 'lodash/debounce';
import React, { Dispatch, SetStateAction, useCallback } from 'react';

interface IProps {
  handleFilterDrawerToggle: () => void;
  handleDrawerToggle: () => void;
  label: string;
  setFilter: Dispatch<SetStateAction<FilterOrder>>;
  filter: FilterOrder;

  handleReset: () => void;
}

const OrderHeader: React.FC<IProps> = ({
  filter,
  label,
  handleDrawerToggle,
  handleFilterDrawerToggle,
  setFilter,
  handleReset,
}) => {
  const debounceSearch = useCallback(
    _debounce((value: string) => {
      setFilter?.((prev: FilterOrder) => ({
        ...prev,
        searchVal: value.trim(),
      }));
    }, 300),
    [],
  );

  const isFilterEmpty = Object.values(filter).every((value) => !value);

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="me-10 text-2xl font-bold text-gray-900">{label}</h1>
              <div className="relative">
                <Input
                  type="text"
                  placeholder={'Search address, state, city...'}
                  onChange={(e) => debounceSearch(e.target.value)}
                  className=" h-9 w-[394px]  placeholder:font-medium placeholder:text-slate-400 focus:border-0 focus-visible:border-0"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                  <Icon
                    icon="search"
                    size="sm"
                    className="me-2.5 text-slate-400"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <>
                {!isFilterEmpty && (
                  <Button
                    type="button"
                    size={'sm'}
                    className="w-[135px] border"
                    onClick={handleReset}
                    variant={'outline'}
                  >
                    Reset
                  </Button>
                )}
                <Button
                  variant={'outline'}
                  className="w-[135px] border"
                  size={'sm'}
                  onClick={handleFilterDrawerToggle}
                >
                  <Icon
                    icon="filter"
                    className="me-2.5 text-sky-500"
                    size={'sm'}
                  />
                  Filters
                </Button>
                <Button
                  variant={'default'}
                  className="w-[135px] border"
                  size={'sm'}
                  onClick={() => handleDrawerToggle()}
                >
                  <Icon
                    icon="plus"
                    className="me-2.5 text-slate-50"
                    size={'sm'}
                  />
                  Add Order
                </Button>
              </>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default OrderHeader;
