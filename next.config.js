module.exports = {
  webpack: (_config, { isServer }) => {
    const config = _config;
    if (!isServer) {
      config.node = config.node || {};
      config.node.fs = 'empty';
    }
    return config;
  },
};
