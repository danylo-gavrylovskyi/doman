/** @type {import('next').NextConfig} */

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const buildRemotePattern = (url) => {
  try {
    const { protocol, hostname, port } = new URL(url);
    return {
      protocol: protocol.replace(":", ""),
      hostname,
      port: port || "",
      pathname: "/uploads/**",
    };
  } catch {
    return null;
  }
};

const remotePatterns = [
  buildRemotePattern(apiUrl),
  buildRemotePattern("http://localhost:5000"),
].filter(Boolean);

const nextConfig = {
  images: {
    remotePatterns,
  },
};

module.exports = nextConfig;
