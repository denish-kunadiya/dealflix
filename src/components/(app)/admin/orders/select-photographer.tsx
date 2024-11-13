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
import { Icon } from '@/components/ui/icon';

interface IProps {
  loading: boolean;
  photographers: AssignedUser[];
  selectedUserId?: string | null;
  onSelectUser: (v?: AssignedUser | null) => void;
}

const UserAutocomplete: React.FC<IProps> = ({
  photographers,
  loading,
  onSelectUser,
  selectedUserId,
}) => {
  const [open, setOpen] = useState(false);
  let user: AssignedUser | undefined;
  const userList = photographers.map((userItem) => {
    const name = `${userItem?.photographer?.first_name} ${userItem.photographer?.last_name}`;

    const updatedUser = {
      value: `${name} ${userItem?.photographer?.email}`,
      label: `${userItem?.photographer?.first_name} ${userItem.photographer?.last_name}`,
      ...userItem,
    };

    if (userItem.user_id === selectedUserId) {
      user = updatedUser;
    }

    return updatedUser;
  });

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
          aria-label="Select User"
          className="ring-offset-background relative flex h-11 w-full min-w-[357px] justify-start rounded-lg border py-3 text-sm font-normal text-slate-900"
          onClick={() => setOpen(!open)}
        >
          {user ? (
            <div className="text-start">
              <span className="text-sm font-normal text-slate-700">
                {user?.photographer?.first_name} {user?.photographer?.last_name}
              </span>
              <div className="text-xs font-normal text-slate-400">{user?.photographer?.email}</div>
            </div>
          ) : (
            <div className="text-slate-400">Select from the list...</div>
          )}

          <div
            className={`${user && 'divide-x divide-slate-200'} absolute right-3 grid h-[26px] w-[50px] grid-cols-2 `}
          >
            <div className=" flex items-center justify-start">
              {user && (
                <Icon
                  icon={'x'}
                  size="sm"
                  className=" text-slate-900"
                  onClick={() => {
                    onSelectUser(undefined);
                    setOpen(false);
                  }}
                />
              )}
            </div>
            <div className="flex h-[26px] w-4 flex-col-reverse items-center">
              <Icon
                icon={'chevron-down'}
                className=" top-0 ml-4 h-3 w-3 rotate-90 text-slate-900"
                size="xs"
              />
              <Icon
                icon={'chevron-down'}
                className="ml-4 h-3 w-3 -rotate-90 text-slate-900"
                size="xs"
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

          <CommandList onWheel={(event) => event.stopPropagation()}>
            {loading ? (
              <div className="flex justify-center py-20">
                <Icon
                  icon={'spin'}
                  className="inline h-8 w-8 animate-spin fill-blue-600 text-slate-200 dark:text-slate-600"
                />
              </div>
            ) : (
              <>
                <CommandEmpty>No photographers found.</CommandEmpty>
                <CommandGroup>
                  {userList.map((p) => {
                    const isSelected = p?.photographer?.email === user?.photographer?.email;
                    return (
                      <CommandItem
                        key={p?.value}
                        value={p?.value}
                        onSelect={() => {
                          onSelectUser(p);
                          setOpen(false);
                        }}
                        className="cursor-pointer text-sm"
                      >
                        <div className="flex w-full items-center justify-between">
                          <div>
                            <span
                              className={`text-sm font-normal ${isSelected ? 'text-sky-500' : 'text-slate-700'}`}
                            >
                              {p.label}
                            </span>
                            <div
                              className={`text-xs font-normal ${isSelected ? 'text-sky-500' : 'text-slate-400'}`}
                            >
                              {p?.photographer?.email}
                            </div>
                          </div>
                          <Check
                            className={cn(
                              'h-6 w-6',
                              isSelected ? 'text-sky-500 opacity-100' : 'opacity-0',
                            )}
                          />
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default UserAutocomplete;
