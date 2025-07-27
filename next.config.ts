import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
    // Allow the Image component to use our fallback image
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Configure rewrites to handle media paths
  async rewrites() {
    return [
      {
        // Ensure media files served from the media directory are accessible
        source: '/media/:path*',
        destination: '/media/:path*',
      },
      {
        // Also support accessing media through the PayloadCMS API path
        source: '/api/media/:path*',
        destination: '/api/media/:path*',
      }
    ];
  },
  serverExternalPackages: ['sharp', 'payload'],
  transpilePackages: ['@payloadcms/next'],
};

export default withPayload(nextConfig);
