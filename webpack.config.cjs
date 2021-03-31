/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * WordPress dependencies
 */
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

/**
 * Prevents externalizing certain packages.
 *
 * @param {string} request Requested module
 * @return {(string|undefined|boolean)} Script global
 */
function requestToExternal(request) {
  const packages = ['react', 'react-dom', 'react-dom/server'];
  if (packages.includes(request)) {
    return false;
  }

  return undefined;
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

const sharedConfig = {
  mode,
  devtool: !isProduction ? 'source-map' : undefined,
  output: {
    path: path.resolve(process.cwd(), 'assets', 'js'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '',
    /**
     * If multiple webpack runtimes (from different compilations) are used on the same webpage,
     * there is a risk of conflicts of on-demand chunks in the global namespace.
     *
     * @see (@link https://webpack.js.org/configuration/output/#outputjsonpfunction)
     */
    jsonpFunction: '__webStories_webpackJsonp',
  },
  module: {
    rules: [
      !isProduction && {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          require.resolve('thread-loader'),
          {
            loader: require.resolve('babel-loader'),
            options: {
              // Babel uses a directory within local node_modules
              // by default. Use the environment variable option
              // to enable more persistent caching.
              cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true,
            },
          },
        ],
      },
      // These should be sync'd with the config in `.storybook/main.cjs`.
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      currentColor: /^(?!url|none)/i,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        exclude: [/images\/.*\.svg$/],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      // See https://github.com/google/web-stories-wp/pull/6361
                      currentColor: false,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        include: [/images\/.*\.svg$/],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        sideEffects: true,
      },
    ].filter(Boolean),
  },
  plugins: [
    process.env.BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
    }),
    new RtlCssPlugin({
      filename: `../css/[name]-rtl.css`,
    }),
    new webpack.EnvironmentPlugin({
      DISABLE_PREVENT: false,
      DISABLE_ERROR_BOUNDARIES: false,
    }),
  ].filter(Boolean),
  optimization: {
    sideEffects: true,
    splitChunks: {
      automaticNameDelimiter: '-',
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        cache: true,
        terserOptions: {
          // We preserve function names that start with capital letters as
          // they're _likely_ component names, and these are useful to have
          // in tracebacks and error messages.
          keep_fnames: /__|_x|_n|_nx|sprintf|^[A-Z].+$/,
          output: {
            comments: /translators:/i,
          },
        },
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
};

// Template for html-webpack-plugin to generate JS/CSS chunk manifests in PHP.
const templateContent = ({ htmlWebpackPlugin }) => {
  // Extract filename without extension from arrays of JS and CSS chunks.
  // E.g. "../css/some-chunk.css" -> "some-chunk"
  const filenameOf = (pathname) =>
    pathname.substr(pathname.lastIndexOf('/') + 1);

  const chunkName = htmlWebpackPlugin.options.chunks[0];
  const omitPrimaryChunk = (f) => f != chunkName;

  const js = htmlWebpackPlugin.files.js
    .map((pathname) => {
      const f = filenameOf(pathname);
      return f.substring(0, f.length - '.js'.length);
    })
    .filter(omitPrimaryChunk);

  const css = htmlWebpackPlugin.files.css
    .map((pathname) => {
      const f = filenameOf(pathname);
      return f.substring(0, f.length - '.css'.length);
    })
    .filter(omitPrimaryChunk);

  return `<?php return array(
    'css' => ${JSON.stringify(css)},
    'js' => ${JSON.stringify(js)});`;
};

const editorAndDashboard = {
  ...sharedConfig,
  entry: {
    'edit-story': './assets/src/edit-story/index.js',
    'stories-dashboard': './assets/src/dashboard/index.js',
  },
  plugins: [
    ...sharedConfig.plugins,
    new DependencyExtractionWebpackPlugin({
      requestToExternal,
    }),
    new WebpackBar({
      name: 'Editor & Dashboard',
    }),
    new HtmlWebpackPlugin({
      filename: 'edit-story.chunks.php',
      inject: false, // Don't inject default <script> tags, etc.
      minify: false, // PHP not HTML so don't attempt to minify.
      templateContent,
      chunks: ['edit-story'],
    }),
    new HtmlWebpackPlugin({
      filename: 'stories-dashboard.chunks.php',
      inject: false, // Don't inject default <script> tags, etc.
      minify: false, // PHP not HTML so don't attempt to minify.
      templateContent,
      chunks: ['stories-dashboard'],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      automaticNameDelimiter: '-',
    },
  },
};

const webStoriesScripts = {
  ...sharedConfig,
  entry: {
    lightbox: './packages/stories-lightbox/src/index.js',
    'carousel-view': './packages/stories-carousel/src/index.js',
  },
  plugins: [
    ...sharedConfig.plugins,
    new DependencyExtractionWebpackPlugin({
      injectPolyfill: true,
    }),
    new WebpackBar({
      name: 'WP Frontend Scripts',
      color: '#EEE070',
    }),
  ].filter(Boolean),
};

// Collect all core themes style sheet paths.
const coreThemesBlockStylesPaths = glob.sync(
  './assets/src/web-stories-block/css/core-themes/*.css'
);

// Build entry object for the Core Themes Styles.
const coreThemeBlockStyles = coreThemesBlockStylesPaths.reduce((acc, curr) => {
  const fileName = path.parse(curr).name;

  return {
    ...acc,
    [`web-stories-theme-style-${fileName}`]: curr,
  };
}, {});

const webStoriesBlock = {
  ...sharedConfig,
  entry: {
    'web-stories-block': [
      './assets/src/web-stories-block/index.js',
      './assets/src/web-stories-block/block/edit.css',
    ],
    'web-stories-list-styles': './assets/src/web-stories-block/css/style.css',
    'web-stories-embed': './assets/src/web-stories-block/css/embed.css',
    ...coreThemeBlockStyles,
  },
  plugins: [
    ...sharedConfig.plugins,
    new DependencyExtractionWebpackPlugin({
      injectPolyfill: true,
    }),
    new WebpackBar({
      name: 'Web Stories Block',
      color: '#357BB5',
    }),
  ].filter(Boolean),
};

const activationNotice = {
  ...sharedConfig,
  entry: {
    'web-stories-activation-notice':
      './packages/activation-notice/src/index.js',
  },
  plugins: [
    ...sharedConfig.plugins,
    new DependencyExtractionWebpackPlugin({
      requestToExternal,
    }),
    new WebpackBar({
      name: 'Activation Notice',
      color: '#fcd8ba',
    }),
  ].filter(Boolean),
};

const widgetScript = {
  ...sharedConfig,
  entry: {
    'web-stories-widget': './packages/widget/src/index.js',
  },
  plugins: [
    ...sharedConfig.plugins,
    new DependencyExtractionWebpackPlugin({}),
    new WebpackBar({
      name: 'WP Widget Script',
      color: '#F757A5',
    }),
  ].filter(Boolean),
};

const storiesMCEButton = {
  ...sharedConfig,
  entry: {
    'tinymce-button': './packages/tinymce-button/src/index.js',
  },
  plugins: [
    ...sharedConfig.plugins,
    new DependencyExtractionWebpackPlugin({}),
    new WebpackBar({
      name: 'WP TinyMCE Button',
      color: '#4deaa2',
    }),
  ].filter(Boolean),
};

module.exports = [
  editorAndDashboard,
  activationNotice,
  webStoriesBlock,
  webStoriesScripts,
  widgetScript,
  storiesMCEButton,
];
