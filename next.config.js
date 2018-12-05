const fs = require('fs');
const path = require('path');
const withTM = require('next-plugin-transpile-modules');

const base = path.join.bind(path, process.cwd());
const babelRcPath = base(`.babelrc`);

const modules = fs.readdirSync(base(`packages`)).reduce((list, dir) => {
  list.push(
    require(base(`packages`, dir, `package.json`)).name
  );

  return list;
}, []);

console.log(modules);

module.exports = withTM({
  transpileModules: modules,
  webpack(webpackConfig, {defaultLoaders}) {
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
});
