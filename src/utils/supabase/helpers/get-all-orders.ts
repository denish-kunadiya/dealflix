'use server';
import { createSupabaseServerClient } from '../server';
import getUserId from './get-user-id';

export const allOrders = async (filter: OrderFilter) => {
  const supabase = createSupabaseServerClient();
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders: null },
      error: userIdRes.error,
    };

  const { searchVal, state, floor, mile } = filter;
  let query;
  if (mile) {
    const { data: location, error: locationError } = await supabase.rpc('get_user_location', {
      user_id: userId,
    });
    if (!locationError && userId && location.latitude && location.longitude) {
      const distance = mile * 1609.34; //convert mile to meter (accepted distance only meters)
      query = supabase.rpc('get_orders', {
        tlongitude: location.longitude,
        tlatitude: location.latitude,
        distance,
      });
    } else {
      query = supabase.rpc('get_orders');
    }
  } else {
    query = supabase.rpc('get_orders');
  }

  query = query.or(
    `and(assignee_id.eq.${userId},status.eq.ASSIGNED),and(assignee_id.is.null,status.eq.AVAILABLE)`,
  );

  if (searchVal) {
    query = query.or(
      `state.ilike.%${searchVal}%,city.ilike.%${searchVal}%,street_address.ilike.%${searchVal}%`,
    );
  }

  if (state) {
    query = query.eq('state', state);
  }

  if (floor) {
    query = query.eq('floors_number', floor);
  }

  query = query.order('created_at', { ascending: true });

  const { data, error } = await query;

  return {
    data: data || [],
    error,
  };
};
