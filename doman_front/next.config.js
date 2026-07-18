/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const uploadsUrl = process.env.NEXT_PUBLIC_UPLOADS_URL;

const buildRemotePattern = (url, pathname) => {
  try {
    const { protocol, hostname, port } = new URL(url);
    return {
      protocol: protocol.replace(":", ""),
      hostname,
      port: port || "",
      pathname,
    };
  } catch {
    return null;
  }
};

const remotePatterns = [
  // Object storage / CDN (production image host).
  uploadsUrl && buildRemotePattern(uploadsUrl, "/**"),
  // Backend-served uploads (local/dev fallback).
  buildRemotePattern(apiUrl, "/uploads/**"),
  buildRemotePattern("http://localhost:5000", "/uploads/**"),
].filter(Boolean);

const nextConfig = {
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;
