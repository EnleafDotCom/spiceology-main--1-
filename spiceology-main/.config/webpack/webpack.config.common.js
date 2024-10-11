// General
const path = require('path')
const sectionsEntries = require('./utils/sections')
const componentsEntries = require('./utils/components')

// Webpack plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const SizePlugin = require('size-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MediaQueryPlugin = require('media-query-plugin');

// Directories
const rootDir = path.dirname(path.dirname(__dirname))
const configDir = path.dirname(__dirname)

const nodeDir = path.join(rootDir, 'node_modules')
const srcDir = path.join(rootDir, 'src')

const scriptsDir = path.join(srcDir, 'scripts')
const stylesDir = path.join(srcDir, 'styles')
const publicDir = path.join(srcDir, 'public')

const resolveConfig = require('tailwindcss/resolveConfig');
const tailwind = resolveConfig(require('./../../tailwind.config'));

// Common configuration
module.exports = {
  // Entry
  entry: {
    base: [path.join(scriptsDir, 'base.js'), path.join(stylesDir, 'base.scss')],
    ...sectionsEntries(),
    ...componentsEntries(),
  },
  // Output
  output: {
    filename: '[name].js',
    path: path.resolve(rootDir, 'assets'),
    /* Remove this option to integrate it with your existing theme */
    clean: true,
  },
  // Plugins
  plugins: [
    // #1: Remove empty JS files
    new RemoveEmptyScriptsPlugin(),
    // #2: Extract CSS to separate css file
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    // #3: Prints the gzipped sizes of assets.
    new SizePlugin({
      publish: false,
      writeFile: false,
    }),
    // #4: Copy files to assets directory
    new CopyPlugin({
      patterns: [{ from: publicDir, to: '[name][ext]' }],
    }),
    new MediaQueryPlugin({
      include: ['base'],
      queries: (() => {
        const keys = Object.keys(tailwind.theme.screens);
        const values = Object.values(tailwind.theme.screens);

        const queries = {};

        keys.forEach((key, index) => {
          const value = values[index];

          if (typeof value === 'string') {
            queries[`(min-width: ${value})`] = key;
          }
        });

        return queries;
      })(),
    }),
  ],
  // Webpack Loaders
  module: {
    rules: [
      // #1: Bundling JavaScript
      {
        test: /\.m?js$/,
        exclude: nodeDir,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      // #2: Bundling SCSS
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // Creates `style` nodes from JS strings
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          MediaQueryPlugin.loader,
          // Postcss
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: require(path.join(
                configDir,
                'postcss.config.js'
              )),
            },
          },
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      styles: stylesDir,
      scripts: scriptsDir,
      public: publicDir,
    },
  },
  stats: {
    preset: 'errors-warnings',
    version: false,
  },
}
