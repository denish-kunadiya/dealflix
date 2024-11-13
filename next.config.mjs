/** @type {import('next').NextConfig} */

const remotePatternsArray = [
  {
    ...(process.env.NODE_ENV === 'development' ? {} : { protocol: 'https' }),
    hostname: process.env.NEXT_PUBLIC_APP_URL,
  },
  ...(process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
    ? [
        {
          protocol: 'https',
          hostname: process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
        },
      ]
    : []),
];

const nextConfig = {
  images: {
    remotePatterns: remotePatternsArray,
  },
};

export default nextConfig;
