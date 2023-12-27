const withBuilderDevTools = require("@builder.io/dev-tools/next")();

/** @type {import('next').NextConfig} */
const nextConfig = withBuilderDevTools({
  experimental: {
    serverMinification: false
  }
});

module.exports = nextConfig;
