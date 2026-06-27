/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@indasyatri/shared'],
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

module.exports = nextConfig;
