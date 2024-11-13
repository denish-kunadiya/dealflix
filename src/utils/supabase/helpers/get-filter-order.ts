'use server';
import { createSupabaseServerClient } from '../server';
import getUserId from './get-user-id';

export const getFilterOrder = async (filter: FilterOrder) => {
  const supabase = createSupabaseServerClient();
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders: null },
      error: userIdRes.error,
    };

  const {
    status,
    assignedId,
    onsiteContactName,
    onsiteContactPhone,
    createdAt,
    state,
    city,
    streetAddress,
    postalCode,
    floorsNumber,
    searchVal,
  } = filter;

  const { data, error } = await await supabase.rpc('get_filtered_orders', {
    p_creator_id: userId,
    p_status: status,
    p_assigned_id: assignedId,
    p_onsite_contact_name: onsiteContactName,
    p_onsite_contact_phone: onsiteContactPhone,
    p_created_at: createdAt,
    p_state: state,
    p_city: city,
    p_street_address: streetAddress,
    p_postal_code: postalCode,
    p_floors_number: floorsNumber,
    p_search_val: searchVal,
  });

  return {
    data: data || [],
    error,
  };
};
