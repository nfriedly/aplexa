const withSass = require('@zeit/next-sass');

module.exports = withSass({
  webpack: (_config, { isServer }) => {
    const config = _config;
    if (!isServer) {
      config.node = config.node || {};
      config.node.fs = 'empty';
    }
    return config;
  },
});
