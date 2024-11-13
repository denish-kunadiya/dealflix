import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import React, { useState } from 'react';
import OrdersStatus from './order-status';
import { formatPhoneNumber } from '@/utils/helper';
import CancelOrderDropdown from './action-dropdown';
import AssignDialog from './dialogs/assign-order';
import { ORDER_STATUS } from '@/utils/constants';

interface IProps {
  handleDrawerToggle: (data: OrderData) => void;
  orders: Orders[];
  handleInitiateAvailableOrder: (
    assignee: string,
    type: 'available' | 'initiated',
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  handleAssignOrder: (orderId: string, data: AssignedUser) => Promise<void>;
}

const AdminOrderTable: React.FC<IProps> = ({
  handleDrawerToggle,
  orders,
  handleInitiateAvailableOrder,
  deleteOrder,
  handleAssignOrder,
}) => {
  const [assign, setAssign] = useState<boolean>(false);
  const [order, setOrder] = useState<Orders | undefined>();

  return (
    <div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="h-[65px] w-[209px] text-[13px] text-slate-900">Address</TableHead>
            <TableHead className=" text-[13px] text-slate-900">Property Owner</TableHead>
            <TableHead className=" text-[13px] text-slate-900">Photographer</TableHead>
            <TableHead className=" text-[13px] text-slate-900">Updates</TableHead>
            <TableHead className=" text-[13px] text-slate-900">Status</TableHead>
            <TableHead className=" text-[13px] text-slate-900"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.length > 0 &&
            orders?.map((item: Orders) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="mb-4 text-base font-semibold text-slate-900">
                    {' '}
                    {item?.street_address}
                  </div>
                  <div className="mt-2 text-sm font-normal text-slate-400">
                    {item?.city} · {item?.state} {item?.postal_code}
                  </div>
                </TableCell>
                <TableCell className="">
                  <div className="mb-4 mt-2 flex items-center justify-start text-xs text-slate-400">
                    <Icon
                      icon="user"
                      size="sm"
                      className="me-2.5"
                    />
                    <span className="text-sm font-normal">{item.onsite_contact_name}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-start text-xs ">
                    <Icon
                      icon="call"
                      size="sm"
                      className="me-2.5 text-slate-400"
                    />
                    <span className="text-sm font-normal text-sky-500">
                      {item?.onsite_contact_phone && formatPhoneNumber(item?.onsite_contact_phone)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="mb-4 mt-2 flex items-center text-xs text-slate-400">
                    <Icon
                      icon="camera"
                      size="sm"
                      className="me-2.5 "
                    />
                    {['INITIATED', 'AVAILABLE'].includes(item.status) ? (
                      '-'
                    ) : (
                      <span className="text-sm font-normal text-sky-500">{`${item.assignee?.first_name ? item.assignee?.first_name : ''} ${item.assignee?.last_name ? item.assignee?.last_name : ''}`}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="mb-4 mt-2 flex items-center text-xs text-slate-400">
                    <Icon
                      icon="calendar"
                      size="sm"
                      className="me-2.5 "
                    />
                    <span className="text-sm font-normal">
                      {' '}
                      Creation date: {format(parseISO(item.created_at), 'dd MMM yyyy')}
                    </span>
                  </div>
                  {item.last_updated?.user_id &&
                    item.last_updated.status &&
                    ![
                      ORDER_STATUS.AVAILABLE,
                      ORDER_STATUS.INITIATED,
                      ORDER_STATUS.COMPLETE,
                    ].includes(item.last_updated.status) && (
                      <div className="mb-4 mt-2 flex items-center text-xs text-slate-400">
                        <Icon
                          icon="flag"
                          size="sm"
                          className="me-2.5"
                        />
                        <span className="text-sm font-normal">
                          {' '}
                          {item.last_updated.status === ORDER_STATUS.ASSIGNED
                            ? 'Assigned'
                            : item.last_updated.status === ORDER_STATUS.IN_PROGRESS
                              ? 'Taken into work'
                              : item.last_updated.status === ORDER_STATUS.GSE_SUBMITTED
                                ? 'Submitted'
                                : item.last_updated.status === ORDER_STATUS.GSE_ACCEPTED
                                  ? 'Accepted'
                                  : item.last_updated.status === ORDER_STATUS.GSE_REJECTED
                                    ? 'Rejected'
                                    : ''}
                          : {format(item.last_updated.created_at, 'dd MMM yyyy')}
                        </span>
                      </div>
                    )}
                </TableCell>
                <TableCell>
                  <OrdersStatus order={item} />
                </TableCell>
                <TableCell className=" pr-0">
                  <div className=" flex items-center justify-end">
                    {item.status === 'INITIATED' && (
                      <Button
                        size={'sm'}
                        className=" me-5 h-9 w-[153px] rounded-md"
                        onClick={() => handleInitiateAvailableOrder(item.id, 'available')}
                      >
                        Make Available
                      </Button>
                    )}
                    {item.status === 'AVAILABLE' && (
                      <>
                        <Button
                          size={'sm'}
                          className="me-5 h-9 w-[150px] rounded-md"
                          variant={'ghost'}
                          onClick={() => {
                            setAssign(!assign);
                            setOrder(item);
                          }}
                        >
                          Assign
                        </Button>
                      </>
                    )}
                    <CancelOrderDropdown
                      handleDrawerToggle={handleDrawerToggle}
                      item={item}
                      handleInitiateAvailableOrder={handleInitiateAvailableOrder}
                      deleteOrder={deleteOrder}
                      handleAssignOrder={handleAssignOrder}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        {assign && (
          <AssignDialog
            open={assign}
            handleClose={() => setAssign(false)}
            order={order}
            handleAssignOrder={handleAssignOrder}
          />
        )}
      </Table>
    </div>
  );
};

export default AdminOrderTable;
