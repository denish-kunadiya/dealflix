import { type NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

import getUserRole from '@/utils/supabase/helpers/get-user-role';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  if (
    // Public routes
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/sign-up')
  ) {
    return response;
  }

  // Check user and get role
  const {
    data: { userRole },
  } = await getUserRole();
  if (!userRole) {
    return Response.redirect(new URL('/login', request.url));
  }

  switch (userRole) {
    case 'photographer':
      if (
        !request.nextUrl.pathname.startsWith('/test') &&
        !request.nextUrl.pathname.startsWith('/orders') &&
        !request.nextUrl.pathname.startsWith('/settings') &&
        !request.nextUrl.pathname.startsWith('/dashboard') &&
        !request.nextUrl.pathname.startsWith('/api')
      ) {
        return Response.redirect(new URL('/orders', request.url));
      }
      break;
    case 'admin':
      if (
        !request.nextUrl.pathname.startsWith('/test') &&
        !request.nextUrl.pathname.startsWith('/admin')
      ) {
        return Response.redirect(new URL('/admin/orders', request.url));
      }
      break;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
