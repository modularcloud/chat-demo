/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*.lzrs.workers.dev", "*.modular.cloud"],
    },
  },
};

export default nextConfig;
