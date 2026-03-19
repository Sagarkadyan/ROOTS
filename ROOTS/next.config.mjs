/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...(isProd ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(!isProd && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://127.0.0.1:5000/api/:path*',
        },
        {
          source: '/login',
          destination: 'http://127.0.0.1:5000/login',
        },
        {
          source: '/logout',
          destination: 'http://127.0.0.1:5000/logout',
        },
      ];
    },
  }),
};

export default nextConfig;
