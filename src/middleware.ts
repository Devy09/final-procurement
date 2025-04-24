import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/',
  '/_next/image(.*)',
  '/public/images/(.*)'
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon\.ico).*)',
    '/public/images/(.*)',

    // Only exclude specific API routes that need to bypass auth
    '/(api/(?!key-metrics/officer-metrics|admin-api/backup-restore-api/backup).*)',
  ],
};