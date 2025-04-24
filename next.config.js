/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'csuprocurement.com'],
    unoptimized: true,
  },
};

module.exports = nextConfig;