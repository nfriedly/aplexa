module.exports = {
  webpack: (_config, { isServer }) => {
    const config = _config;
    if (!isServer) {
      config.node = config.node || {};
      config.node.fs = 'empty';
    }
    return config;
  },
  // set up the url prefix for a gh-pages export
  assetPrefix: process.env.GH_PAGES ? '/aplexa' : '',
};
