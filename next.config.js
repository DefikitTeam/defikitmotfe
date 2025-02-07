/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  // comment when you deploy to production
  // experimental: {
  //   https: true,
  // },
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-stg.rocketlaunch.fun',
        pathname: '**'
      }
    ]
  }
};

module.exports = nextConfig;
