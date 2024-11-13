import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ORDER_STATUS } from '@/utils/constants';
import MoveOrderDialog from './dialogs/move-order';
import DeleteOrderDialog from './dialogs/delete-order';
import AssignDialog from './dialogs/assign-order';

interface IProps {
  handleDrawerToggle: (data: OrderData) => void;
  item: Orders;
  handleInitiateAvailableOrder: (
    assignee: string,
    type: 'available' | 'initiated',
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  handleAssignOrder: (orderId: string, data: AssignedUser) => Promise<void>;
}

interface MoveOrder {
  move: boolean;
  type?: 'available' | 'initiated';
}

const CancelOrderDropdown: React.FC<IProps> = ({
  item,
  handleInitiateAvailableOrder,
  deleteOrder,
  handleAssignOrder,
  handleDrawerToggle,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAssign, setIsAssign] = useState<boolean>(false);
  const [move, setMove] = useState<MoveOrder>({
    move: false,
    type: undefined,
  });
  const [delOrder, setDelOrder] = useState<boolean>(false);
  const handleButtonClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };
  return (
    <>
      <DropdownMenu
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DropdownMenuTrigger
          className="border-0 focus-visible:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <EllipsisVertical className=" h-[29px] w-[29px] text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-2">
          {![ORDER_STATUS.GSE_ACCEPTED].includes(item.status) && (
            <Button
              className={`text  group flex h-[38px] w-[203px] justify-start rounded-md text-[13px] font-medium text-slate-700`}
              variant={'ghost'}
              onClick={() => {
                setIsOpen(false);
                handleDrawerToggle({
                  ...item,
                  assignee: item.assignee_id ? item.assignee : null,
                  lender_contact_phone: item.lender_contact_phone ?? undefined,
                  lender_loan_id: item.lender_loan_id ?? '',
                  lender_name: item.lender_name ?? undefined,
                  lender_id: item.lender_id ?? '',
                } as OrderData);
              }}
            >
              <div className="me-1">
                <Icon
                  icon={'pencil'}
                  size={'sm'}
                  className="me-2.5"
                />
              </div>
              <span className="text-[13px] font-medium ">Edit</span>
            </Button>
          )}
          {[ORDER_STATUS.INITIATED].includes(item.status) ? (
            <Button
              className={`group  flex h-[38px] w-[203px]  justify-start rounded-md text-[13px] font-medium text-slate-700`}
              variant={'ghost'}
              onClick={() => handleButtonClick(() => setIsAssign(true))}
            >
              <div className="me-1">
                <Icon
                  icon={'user'}
                  size={'sm'}
                  className="me-2.5"
                />
              </div>
              <span className="text-[13px] font-medium">Assign</span>
            </Button>
          ) : [ORDER_STATUS.ASSIGNED].includes(item.status) ? (
            <Button
              className={`group  flex h-[38px] w-[203px]  justify-start rounded-md text-[13px] font-medium text-slate-700`}
              variant={'ghost'}
              onClick={() => handleButtonClick(() => setIsAssign(true))}
            >
              <div className="me-1">
                <Icon
                  icon={'user'}
                  size={'sm'}
                  className="me-2.5"
                />
              </div>
              <span className="text-[13px] font-medium ">Change Assignee</span>
            </Button>
          ) : (
            ''
          )}
          {![ORDER_STATUS.INITIATED].includes(item.status) && (
            <Button
              className={`group  flex h-[38px] w-[203px]  justify-start rounded-md text-[13px] font-medium text-slate-700`}
              variant={'ghost'}
              onClick={() => handleButtonClick(() => setMove({ move: true, type: 'initiated' }))}
            >
              <div className="me-1">
                <Icon
                  icon={'flag'}
                  size={'sm'}
                  className="me-2.5"
                />
              </div>
              <span className="text-[13px] font-medium">Move to Initiated</span>
            </Button>
          )}
          {![ORDER_STATUS.AVAILABLE, ORDER_STATUS.INITIATED].includes(item.status) && (
            <Button
              className={`group  flex h-[38px] w-[203px]  justify-start rounded-md text-[13px] font-medium text-slate-700`}
              variant={'ghost'}
              onClick={() => handleButtonClick(() => setMove({ move: true, type: 'available' }))}
            >
              <div className="me-1">
                <Icon
                  icon={'flag'}
                  size={'sm'}
                  className="me-2.5"
                />
              </div>
              <span className="text-[13px] font-medium">Move to Available</span>
            </Button>
          )}

          <Button
            className={`group  flex h-[38px] w-[203px]  justify-start rounded-md text-[13px] font-medium text-red-500`}
            variant={'ghost'}
            onClick={() => handleButtonClick(() => setDelOrder(true))}
          >
            <div className="me-2.5">
              <Icon
                icon={'trash'}
                size={'sm'}
              />
            </div>
            <span className="text-[13px] font-medium ">Delete</span>
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
      {isAssign && (
        <AssignDialog
          open={isAssign}
          handleClose={() => setIsAssign(false)}
          order={item}
          handleAssignOrder={handleAssignOrder}
        />
      )}
      {move.move && move.type && (
        <MoveOrderDialog
          open={move.move}
          handleClose={() => setMove({ move: false, type: undefined })}
          handleInitiateAvailableOrder={handleInitiateAvailableOrder}
          order={item}
          moveTo={move.type}
        />
      )}
      {delOrder && (
        <DeleteOrderDialog
          open={delOrder}
          handleClose={() => setDelOrder(false)}
          deleteOrder={deleteOrder}
          order={item}
        />
      )}
    </>
  );
};

export default CancelOrderDropdown;
