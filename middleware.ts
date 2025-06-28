import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/categories(.*)',
  '/auctions(.*)',
  '/giveaways(.*)',
  '/search(.*)',
  '/about',
  '/contact',
  '/help',
  '/terms',
  '/privacy',
  '/studio(.*)',
  '/api/webhooks(.*)',
  '/api/public(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
