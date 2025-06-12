/** @type {import('next').NextConfig} */
require('dotenv').config();

// Check if we're building on Cloudflare Pages
const isCloudflare = process.env.CF_PAGES === '1' || process.env.CF_PAGES_BRANCH;

const nextConfig = {
  // Enable SWC minification for Cloudflare Pages to reduce bundle size
  swcMinify: isCloudflare ? true : false,
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

    // Ignore HeartbeatWorker files completely
    config.module.rules.push({
      test: /HeartbeatWorker/,
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
      const TerserPlugin = require('terser-webpack-plugin');

      if (isCloudflare) {
        // For Cloudflare Pages: Use selective Terser exclusion to keep bundle size manageable
        config.optimization.minimizer = config.optimization.minimizer.filter(
          (minimizer) => minimizer.constructor.name !== 'TerserPlugin'
        );

        // Add TerserPlugin with more selective exclusions for Cloudflare
        config.optimization.minimizer.push(
          new TerserPlugin({
            test: /\.m?js(\?.*)?$/i,
            exclude: [
              /HeartbeatWorker/,
              /\.worker\./,
              /edge-chunks.*HeartbeatWorker/,
              /asset_HeartbeatWorker/,
              /telegram-web-app/,
              /node_modules\/@metamask\/sdk/,
              /node_modules\/@coinbase\/wallet-sdk/,
            ],
            terserOptions: {
              parse: {
                ecma: 2020,
              },
              compress: {
                ecma: 2020,
                warnings: false,
                drop_console: true, // Remove console.log in production
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info'],
                passes: 2, // Multiple passes for better optimization
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 2020,
                comments: false,
                ascii_only: true,
              },
              module: true,
            },
            parallel: true,
            extractComments: false,
          })
        );
      } else {
        // Remove existing terser plugins and add a new one with proper configuration
        config.optimization.minimizer = config.optimization.minimizer.filter(
          (minimizer) => minimizer.constructor.name !== 'TerserPlugin'
        );

        // Add new TerserPlugin with proper configuration
        config.optimization.minimizer.push(
          new TerserPlugin({
            test: /\.m?js(\?.*)?$/i,
            exclude: [
              /HeartbeatWorker/,
              /\.worker\./,
              /edge-chunks.*HeartbeatWorker/,
              /asset_HeartbeatWorker/,
              /telegram-web-app/,
            ],
            terserOptions: {
              parse: {
                ecma: 2020,
              },
              compress: {
                ecma: 2020,
                warnings: false,
                drop_console: false,
                drop_debugger: true,
                pure_funcs: ['console.log'],
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 2020,
                comments: false,
                ascii_only: true,
              },
              module: true,
            },
            parallel: true,
            extractComments: false,
          })
        );
      }
    }

    // Additional configuration for Cloudflare Pages compatibility
    if (process.env.CF_PAGES) {
      // Cloudflare Pages specific optimizations
      console.log('🚀 Building for Cloudflare Pages - Selective Terser with SWC minification');
    }

    // Additional webpack configuration to handle external scripts
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        'telegram-web-app': 'Telegram.WebApp'
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
