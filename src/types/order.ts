interface Orders {
  id: string;
  creator_id: string;
  assignee_id: string | null | undefined;
  status: string;
  street_address: string | null;
  city: string | null;
  state: string | undefined;
  postal_code: string | null;
  floors_number?: number | null | undefined;
  onsite_contact_name: string | undefined;
  onsite_contact_phone?: string | number | undefined;
  onsite_contact_email?: string | undefined;
  deliver_email: string | null;
  delivery_company: string | null;
  delivery_name: string | null;
  delivery_phone: string | number | null;
  borrower_name?: string | undefined;
  amc_name?: string | undefined;
  lender_name?: string | undefined;
  lender_id: string | null;
  lender_loan_id: string | null;
  type: string;
  is_rush: boolean;
  created_at: string;
  updated_at: string;
  started_at?: string | null;
  zip?: string | null | undefined;
  closedDate?: string | null | undefined;
  assignee?: {
    email?: string | undefined | '';
    user_id?: string | null | undefined;
    first_name?: string | null | '';
    last_name?: string | null | '';
  };
  last_updated?: {
    id?: string | null | undefined;
    status: string;
    user_id?: string | null | undefined;
    created_at: string;
  };
  lender_contact_phone: number | undefined;
}
type ActiveTab = 'IN_PROGRESS' | 'COMPLETE';

interface OrderFilter {
  searchVal?: string | undefined;
  floor?: number | undefined;
  mile?: number | '' | undefined;
  state?: string | undefined;
  activeTab?: ActiveTab;
}

interface AssignedUser {
  photographer: Photographer;
  id: string | null | undefined;
  role: 'photographer';
  user_id: string | null | undefined;
}

interface OrderData {
  assigned?:
    | {
        photographer: {
          email: string;
          user_id: string | null | undefined;
          last_name: string | undefined;
          first_name: string;
        };
        role: string;
        id: string;
        user_id: string | null | undefined;
        email: string;
        last_name: string | undefined;
        first_name: string;
        label?: string;
      }
    | undefined;
  onsite_contact_name?: string;
  onsite_contact_phone?: string | number | undefined;
  state?: string | undefined;
  city?: string | undefined;
  street_address?: string | undefined;
  postal_code?: string | null | number;
  floors_number?: number | null;
  id?: string;
  type?: string;
  status?: string;
  is_rush?: boolean;
  amc_name?: string;
  assignee?: {
    email?: string;
    user_id?: string | null;
    last_name?: string | null; // Allowing null here
    first_name?: string | null; // Allowing null here
  };
  location?: string;
  lender_id?: string;
  created_at?: string;
  creator_id?: string;
  is_deleted?: boolean;
  started_at?: string | null;
  updated_at?: string;
  assignee_id?: string | null; // Allowing null here
  lender_name?: string;
  last_updated?: {
    id: string;
    status: string;
    user_id?: string | null;
    created_at: string;
  } | null;
  borrower_name?: string;
  deliver_email?: string;
  delivery_name?: string | null;
  delivery_phone?: string | null;
  lender_loan_id?: string;
  borrower_contact_info?: string;
  delivery_company?: string | null;
  lender_contact_phone?: number;
  onsite_contact_email?: string;
}

interface FilterOrder {
  status?: string | '';
  assignedId?: string | '';
  onsiteContactName?: string | '';
  onsiteContactPhone?: string | '';
  createdAt?: string | '';
  state?: string | '';
  city?: string | '';
  streetAddress?: string | '';
  postalCode?: string | '';
  floorsNumber?: string | '';
  searchVal?: string | '';
}
