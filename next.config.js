const fs = require('fs');
const path = require('path');

const babelRcPath = path.resolve(process.cwd(), `.babelrc`);

module.exports = {
  webpack(webpackConfig, {defaultLoaders}) {


    const babelRcConfig = JSON.parse(fs.readFileSync(babelRcPath, `utf8`));

    defaultLoaders.babel.loader = `babel-loader`;

    // Apply local babelrc config and ignore babelrc in imports
    defaultLoaders.babel.options = {
      ...babelRcConfig,
      babelrc: false,
    };

    // Add babel loader for core modules
    webpackConfig.module.rules.push(
      {
        test: /\.jsx?$/,
        include(fp) {
          const test = /(@next-lerna|packages)(?!.*node_modules)/.test(fp);

          if (test) console.log('***TRANSPILING***', fp);

          return test;
        },
        use: defaultLoaders.babel,
      }
    );

    return webpackConfig;
  },
  webpackDevMiddleware(config) {
    config.watchOptions.ignored = [
      ...config.watchOptions.ignored.slice(0, 2),
      /(@next-lerna|packages)(?!.*node_modules)/
    ];

    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config;
  },
  exportPathMap: () => ({
    '/': { page: `/home` },
  }),
};
