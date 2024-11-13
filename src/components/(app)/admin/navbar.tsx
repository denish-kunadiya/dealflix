'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react'; // TODO: replace with @radix-ui
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { signOut } from '@/app/(app)/actions';

import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/icon';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const userNavigation = [
  { name: 'Profile', href: '/settings/profile' },
  { name: 'Dashboard', href: '/dashboard' },
];

const ordersFeedPath = '/admin/orders';
const myOrdersPath = '/admin/users';

const AdminAppNavbar = () => {
  const path = usePathname();

  const navigation = [
    { name: 'Orders', href: ordersFeedPath, current: path === ordersFeedPath },
    { name: 'Users', href: myOrdersPath, current: path === myOrdersPath },
  ];

  return (
    <Disclosure
      as="nav"
      className=" border-b border-slate-200 bg-slate-50"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl">
            <div className="flex h-[60px] justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Image
                    className="block h-8 w-auto"
                    width={154}
                    height={33}
                    src="/images/logo-row.svg"
                    alt="Property Data Collector"
                  />
                </div>
                <div className="hidden sm:-my-px sm:ml-16 sm:flex sm:space-x-10">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={cn(
                        item.current
                          ? 'border-sky-500 text-sky-500'
                          : 'border-transparent text-slate-900 hover:border-sky-500',
                        'inline-flex items-center border-b-[3px] px-1 pt-1 text-lg font-medium',
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="relative rounded-full bg-slate-50 p-1 text-slate-700 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <Icon
                    icon={'bell'}
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>

                <Menu
                  as="div"
                  className="relative ml-3"
                >
                  <div>
                    <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>

                      <Icon
                        icon={'setting'}
                        className="h-6 w-6 rounded-full"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-50 py-1 text-sm font-medium text-slate-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={cn(active ? 'bg-sky-50' : '', 'block px-4 py-2')}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                      <Menu.Item>
                        {({ active }) => (
                          <span
                            className={cn(
                              active ? 'bg-sky-50' : '',
                              'block cursor-pointer px-4 py-2',
                            )}
                            onClick={() => signOut()}
                          >
                            Sign Out
                          </span>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  ) : (
                    <Bars3Icon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={cn(
                    item.current
                      ? 'border-sky-500 bg-sky-50 text-sky-500'
                      : 'border-transparent hover:border-sky-500 hover:bg-sky-50',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.imageUrl}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <button
                  type="button"
                  className="relative ml-auto flex-shrink-0 rounded-full bg-slate-50 p-1 text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon
                    className="h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                {userNavigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="text-salte-900 block px-4 py-2 text-base font-medium hover:bg-sky-50"
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
                <Disclosure.Button
                  as="span"
                  className="block cursor-pointer px-4 py-2 text-base font-medium text-slate-900 hover:bg-sky-50"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AdminAppNavbar;
