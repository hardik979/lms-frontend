import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://192.168.29.250:3000"], // Replace with your actual development IP
  images: {
    domains: ["res.cloudinary.com"], // ✅ Add Cloudinary domain
  },
};

export default nextConfig;
