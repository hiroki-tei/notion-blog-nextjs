const withBuilderDevTools = require("@builder.io/dev-tools/next")();

/** @type {import('next').NextConfig} */
const nextConfig = withBuilderDevTools({
  experimental: {
    serverMinification: false
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/builder/blog/top",
        permanent: false
      }
    ];
  }
});

module.exports = nextConfig;
