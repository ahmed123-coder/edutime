/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Removed hardcoded dashboard redirect - now handled by role-based routing
}

export default nextConfig
