import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'cdn.jsdelivr.net',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'avatars.githubusercontent.com',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: 'picsum.photos',
  //     },
  //   ],
  // },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/upload/:slug',
        destination: `${process.env.NEXT_PUBLIC_BASE_URL}/upload/:slug`,
      },
    ]
  },
}

export default nextConfig
