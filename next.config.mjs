/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["snaptok.my.id", "www.snaptok.my.id", "localhost:3000"],
    },
  },
  serverExternalPackages: [],
}

export default nextConfig
