import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals, files, and the generated share images
  // (so /en/opengraph-image isn't redirected to a locale-less path).
  matcher: ['/', '/(el)/:path*', '/((?!api|_next|_vercel|.*opengraph-image|.*\\..*).*)'],
};
