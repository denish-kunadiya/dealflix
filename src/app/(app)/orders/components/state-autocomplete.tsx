'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { STATES } from '@/utils/constants';
import { Icon } from '@/components/ui/icon';

interface IProps {
  setSelectedState: (v: string) => void;
  selectedState: string | undefined;
}

const StateAutocomplete: React.FC<IProps> = ({ setSelectedState, selectedState }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label="Select State"
          className="ring-offset-background relative z-10  flex h-[42px] w-full 
          justify-between rounded-lg border border-slate-200 bg-white  py-3 text-sm font-normal text-slate-900  placeholder:text-slate-400  hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setOpen(true)}
        >
          {selectedState ? (
            <div className="text-slate-900 hover:text-slate-900">
              {STATES.find((item) => item.shortCode === selectedState)?.state}
            </div>
          ) : (
            <div className="text-slate-400 ">Select from the list...</div>
          )}

          <div
            className={`${selectedState && 'divide-x divide-slate-200'} absolute right-3 grid h-[26px] w-[50px] grid-cols-2 `}
          >
            <div className="flex items-center justify-start">
              {selectedState && (
                <Icon
                  icon={'x'}
                  size="sm"
                  className="text-slate-900"
                  onClick={() => {
                    setSelectedState('');
                    setOpen(false);
                    setValue('');
                  }}
                />
              )}
            </div>
            <div className="flex h-[26px] w-4 flex-col-reverse items-center">
              <Icon
                icon={'chevron-down'}
                size="xs"
                className="top-0 ml-4 rotate-90 text-slate-900"
              />
              <Icon
                icon={'chevron-down'}
                size="xs"
                className="ml-4 -rotate-90 text-slate-900"
              />
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="popover-content-width-full">
        <Command className="w-full">
          <CommandInput
            placeholder="Select from the list..."
            className="mb-3 mt-2 h-9 border border-sky-500 text-sm font-normal hover:text-slate-900 focus:border-sky-500 focus:ring-1  focus:ring-sky-500"
          />
          <CommandList>
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup>
              {STATES.map((state) => {
                const isSelected = state.state === value;
                return (
                  <CommandItem
                    key={state.state}
                    value={state.state}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setSelectedState(state.shortCode);
                      setOpen(false);
                    }}
                    className="flex gap-2"
                  >
                    <Check
                      className={cn(
                        'h-6 w-6',
                        isSelected ? 'text-sky-500 opacity-100' : 'opacity-0',
                      )}
                    />
                    <span
                      className={`cursor-pointer text-sm font-normal hover:text-sky-500  ${isSelected ? 'text-sky-500' : 'text-slate-700'}`}
                    >
                      {state.state}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default StateAutocomplete;
