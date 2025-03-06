/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove trailingSlash and assetPrefix settings to use Vercel defaults
};

module.exports = nextConfig;