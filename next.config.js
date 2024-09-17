const withBuilderDevTools = require("@builder.io/dev-tools/next")();

/** @type {import('next').NextConfig} */
const nextConfig = withBuilderDevTools({
  async redirects() {
    return [
      {
        source: "/",
        destination: "/blog/top",
        permanent: false
      }
    ];
  },
  staticPageGenerationTimeout: 120
});

module.exports = nextConfig;
