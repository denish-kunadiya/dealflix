'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../../get-user-id';
import { ORDER_STATUS } from '@/utils/constants';
import getUserRole from '../../get-user-role';

export const create = async (
  orderData: OrderData,
  location: { latitude: number; longitude: number },
) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;
  const {
    data: { userRole },
  } = await getUserRole();

  if (!userId && userRole !== 'admin')
    return {
      data: { order: null },
      error: userIdRes.error,
    };
  const submitData = {
    creator_id: userId,
    assignee_id: orderData.assigned?.user_id ? orderData.assigned.user_id : null,
    status: orderData.assigned?.user_id ? ORDER_STATUS.ASSIGNED : ORDER_STATUS.INITIATED,
    street_address: orderData.street_address,
    city: orderData.city,
    state: orderData.state,
    postal_code: orderData.postal_code,
    floors_number: orderData.floors_number,
    onsite_contact_name: orderData.onsite_contact_name,
    onsite_contact_phone: orderData.onsite_contact_phone,
    onsite_contact_email: orderData.onsite_contact_email,
    lender_contact_phone: orderData.lender_contact_phone,
    borrower_contact_info: orderData.borrower_contact_info,
    deliver_email: orderData.deliver_email,
    borrower_name: orderData.borrower_name,
    amc_name: orderData.amc_name,
    lender_name: orderData.lender_name,
    lender_id: orderData.lender_id,
    lender_loan_id: orderData.lender_loan_id,
    type: 'test-order-type',
    location: `SRID=4326;POINT(${location.longitude} ${location.latitude})`, //added location for searching
  };

  const { data, error } = await supabase.from('order').insert(submitData).select().single();
  return {
    data: data || null,
    error,
  };
};
