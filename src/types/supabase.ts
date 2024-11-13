type TPdaService = 'fannie-mae' | 'freddie-mac';

interface IDbSeviceResponse<T> {
  data: T;
  error: {
    message: string;
    code?: string;
    hint?: string;
    details?: string;
  } | null;
}

type TOrderStatus =
  | 'INITIATED'
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'QC_SUBMITTED'
  | 'QC_ACCEPTED'
  | 'QC_REJECTED'
  | 'GSE_SUBMITTED'
  | 'GSE_ACCEPTED'
  | 'GSE_REJECTED'
  | 'COMPLETE';
