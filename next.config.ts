import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // 로컬 개발 환경에서 상대 경로 이미지 허용
    unoptimized: process.env.NODE_ENV === 'development',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      return []
    }

    return [
      {
        source: '/upload/:slug',
        destination: `${baseUrl}/upload/:slug`,
      },
    ]
  },
}

export default nextConfig
