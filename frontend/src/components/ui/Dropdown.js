import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { classNames } from '../../utils/helpers';

const Dropdown = ({
  trigger,
  children,
  align = 'right',
  width = 'w-56',
  className = '',
}) => {
  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button as={Fragment}>
          {trigger}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            'absolute z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            width,
            align === 'left' ? 'left-0' : 'right-0'
          )}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const DropdownItem = ({ children, onClick, className = '', danger = false }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={classNames(
            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
            danger && 'text-red-600',
            'block w-full px-4 py-2 text-left text-sm',
            className
          )}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

export { Dropdown, DropdownItem };
