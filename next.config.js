/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites() {
    return [
      {
        source: "/gen",
        destination: "/api/ong",
      },
    ];
  },
};

module.exports = nextConfig;
