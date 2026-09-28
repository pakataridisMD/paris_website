import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    // Serve AVIF where supported (smaller, sharper), WebP otherwise.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 90],
  },
  // The Bulgarian version was retired; send old links to the English site.
  async redirects() {
    return [
      { source: '/bg', destination: '/', permanent: true },
      { source: '/bg/:path*', destination: '/:path*', permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
