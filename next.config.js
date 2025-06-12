/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
  reactStrictMode: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    config.module.rules.push(
      {
        test: /\.d\.ts$/,
        loader: 'ignore-loader'
      },
      {
        test: /\.map$/,
        loader: 'ignore-loader'
      },
      {
        test: /\.d\.ts\.map$/,
        loader: 'ignore-loader'
      }
    );

    config.module.rules.push({
      test: /node_modules\/@metamask\/sdk\/.*\.(d\.ts|map)$/,
      loader: 'ignore-loader'
    });

    // Handle web workers properly
    config.module.rules.push({
      test: /\.worker\.(js|ts)$/,
      use: {
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
          publicPath: '/_next/'
        }
      }
    });

    // Configure Terser optimization to handle module syntax in workers
    if (config.optimization && config.optimization.minimizer) {
      config.optimization.minimizer.forEach((minimizer) => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          if (!minimizer.options.exclude) {
            minimizer.options.exclude = [];
          }
          // Exclude worker files and files with HeartbeatWorker in the name
          minimizer.options.exclude.push(/HeartbeatWorker/);
          minimizer.options.exclude.push(/\.worker\./);

          // Update terser options to handle module syntax
          if (!minimizer.options.terserOptions) {
            minimizer.options.terserOptions = {};
          }
          if (!minimizer.options.terserOptions.parse) {
            minimizer.options.terserOptions.parse = {};
          }
          minimizer.options.terserOptions.parse.ecma = 2020;
          minimizer.options.terserOptions.module = true;
        }
      });
    }

    return config;
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'cdn-stg.rocketlaunch.fun',
  //       pathname: '**'
  //     }
  //   ],
  //   // domains: ['cdn-stg.rocketlaunch.fun', 'pump.mypinata.cloud', 'ipfs.io','s2.coinmarketcap.com']
  // }

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-stg.rocketlaunch.fun',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'pump.mypinata.cloud',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
