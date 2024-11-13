import { ORDER_STATUS } from './constants';

export const formatPhoneNumber = (phoneNumber: string | number) => {
  const phoneStr = phoneNumber?.toString();
  if (phoneStr.length !== 10) {
    return phoneNumber;
  }
  const formattedPhoneNumber = `+1 (${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  return formattedPhoneNumber;
};

export const maxFileSize = (sizeInMb: number) => {
  return Number(sizeInMb) * 1024 * 1024;
};

export const getStatus = (status: string) => {
  switch (status) {
    case ORDER_STATUS.IN_PROGRESS:
      return 'IN PROGRESS';
    case ORDER_STATUS.INITIATED:
      return 'ORDER INITIATED';
    case ORDER_STATUS.AVAILABLE:
      return 'AVAILABLE';
    case ORDER_STATUS.ASSIGNED:
      return 'ASSIGNED';
    case ORDER_STATUS.GSE_SUBMITTED:
      return 'SUBMITTED TO GSE';
    case ORDER_STATUS.GSE_ACCEPTED:
      return 'GSE ACCEPTED';
    case ORDER_STATUS.GSE_REJECTED:
      return 'GSE REJECTED';
    case ORDER_STATUS.COMPLETE:
      return 'COMPLETE';

    default:
      return status;
  }
};
