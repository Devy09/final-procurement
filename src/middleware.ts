import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon\\.ico).*)',
    
    // Exclude specific API routes (fixed format)
    '/(api/(?!key-metrics/officer-metrics|admin-api/backup-restore-api/backup|quotation).*)',
  ],
};