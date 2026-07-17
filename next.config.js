/** @type {import('next').NextConfig} */

// If deploying to https://<user>.github.io/<repo>/, set NEXT_PUBLIC_BASE_PATH
// (e.g. "/live-orthodox") as an environment variable during build.
// If deploying to a custom domain or a root github.io site, leave it unset.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
