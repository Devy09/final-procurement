/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  basePath: undefined, // Remove this line if not needed
  trailingSlash: true, // Ensures correct file paths
  images: {
    unoptimized: true, // Fix issues with Next.js image optimization on Vercel
  }
};

module.exports = nextConfig;
