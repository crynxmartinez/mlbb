/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    domains: ['mlbb.rone.dev', 'assets.cdn.filesafe.space'],
  },
}

module.exports = nextConfig
