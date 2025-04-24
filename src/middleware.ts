import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/',
  '/_next/image/(.*)',
  '/public/(.*)',
  '/favicon.ico',
  '/api/auth/(.*)', // Allow Clerk auth routes
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals
    '/((?!_next/static|_next/image|favicon\.ico).*)',
    // Allow specific public routes
    '/(sign-in|_next/image|public|favicon.ico|api/auth)',
    // Protect all other routes
    '/((?!api/auth).*)',
  ],
};