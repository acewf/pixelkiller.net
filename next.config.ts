import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The old portfolio lived at /projects. That history is now the Story section,
  // so inbound links land there instead of on a 404.
  async redirects() {
    return [{ source: "/projects", destination: "/#story", permanent: true }];
  },
};

export default nextConfig;
