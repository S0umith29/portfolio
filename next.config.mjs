/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
  },
  trailingSlash: true,
  basePath: '/portfolio',
  assetPrefix: '/portfolio',
};

export default nextConfig;

