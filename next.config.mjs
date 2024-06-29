/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    serverActions: {
      allowedOrigins: ["*.lzrs.workers.dev", "*.modular.cloud"],
    },
  },
};

export default nextConfig;
