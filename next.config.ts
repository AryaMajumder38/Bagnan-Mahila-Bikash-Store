import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
        source: '/media/:path*',
        destination: '/media/:path*',
      }
    ];
  },
  serverExternalPackages: ['sharp', 'payload'],
  transpilePackages: ['@payloadcms/next'],
};

export default withPayload(nextConfig);
