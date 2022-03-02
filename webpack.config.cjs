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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RtlCssPlugin = require('rtlcss-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

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

  if (request.includes('react-refresh/runtime')) {
    return false;
  }

  return undefined;
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

const sharedConfig = {
  resolve: {
    // Fixes resolving packages in the monorepo so we use the "src" folder, not "dist".
    exportsFields: ['customExports', 'exports'],
  },
  mode,
  devtool: !isProduction ? 'source-map' : undefined,
  output: {
    path: path.resolve(process.cwd(), 'assets', 'js'),
    filename: '[name].js',
    chunkFilename: '[name].js?v=[chunkhash]',
    publicPath: '',
  },
  target: 'browserslist',
  module: {
    rules: [
      !isProduction && {
        test: /\.m?js$/,
        use: ['source-map-loader'],
        // html-to-image and react-blurhash reference source maps but don't currently ship with any.
        exclude: /node_modules\/html-to-image|node_modules\/react-blurhash/,
        enforce: 'pre',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: 'fallback',
          },
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        resolve: {
          // Avoid having to provide full file extension for imports.
          // See https://webpack.js.org/configuration/module/#resolvefullyspecified
          fullySpecified: false,
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              // Babel uses a directory within local node_modules
              // by default. Use the environment variable option
              // to enable more persistent caching.
              cacheDirectory: process.env.BABEL_CACHE_DIRECTORY || true,
              plugins: [
                !isProduction && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
      // These should be sync'd with the config in `.storybook/main.cjs`.
      {
        test: /\.svg$/,
        // Use asset SVG and SVGR together.
        // Not using resourceQuery because it doesn't work well with Rollup.
        // https://react-svgr.com/docs/webpack/#use-svgr-and-asset-svg-in-the-same-project
        oneOf: [
          {
            type: 'asset/inline',
            include: [/inline-icons\/.*\.svg$/],
          },
          {
            issuer: /\.js?$/,
            include: [/\/icons\/.*\.svg$/],
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  titleProp: true,
                  svgo: true,
                  memo: true,
                  svgoConfig: {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                            convertColors: {
                              currentColor: /^(?!url|none)/i,
                            },
                          },
                        },
                      },
                      'removeDimensions',
                    ],
                  },
                },
              },
            ],
          },
          {
            issuer: /\.js?$/,
            include: [/images\/.*\.svg$/],
            use: [
              {
                loader: '@svgr/webpack',
                options: {
                  titleProp: true,
                  svgo: true,
                  memo: true,
                  svgoConfig: {
                    plugins: [
                      {
                        name: 'preset-default',
                        params: {
                          overrides: {
                            removeViewBox: false,
                            convertColors: {
                              // See https://github.com/googleforcreators/web-stories-wp/pull/6361
                              currentColor: false,
                            },
                          },
                        },
                      },
                      'removeDimensions',
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
        sideEffects: true,
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]',
        },
      },
    ].filter(Boolean),
  },
  plugins: [
    process.env.BUNDLE_ANALYZER &&
      new BundleAnalyzerPlugin({
        analyzerPort: 'auto',
      }),
    new MiniCssExtractPlugin({
      filename: '../css/[name].css',
    }),
    new RtlCssPlugin({
      filename: `../css/[name]-rtl.css`,
    }),
    new webpack.DefinePlugin({
      WEB_STORIES_CI: JSON.stringify(process.env.CI),
      WEB_STORIES_ENV: JSON.stringify(process.env.NODE_ENV),
      WEB_STORIES_DISABLE_ERROR_BOUNDARIES: JSON.stringify(
        process.env.DISABLE_ERROR_BOUNDARIES
      ),
      WEB_STORIES_DISABLE_OPTIMIZED_RENDERING: JSON.stringify(
        process.env.DISABLE_OPTIMIZED_RENDERING
      ),
      WEB_STORIES_DISABLE_PREVENT: JSON.stringify(process.env.DISABLE_PREVENT),
      WEB_STORIES_DISABLE_QUICK_TIPS: JSON.stringify(
        process.env.DISABLE_QUICK_TIPS
      ),
    }),
    new DependencyExtractionWebpackPlugin(),
  ].filter(Boolean),
  optimization: {
    sideEffects: true,
    splitChunks: {
      automaticNameDelimiter: '-',
    },
    mangleExports: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
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
      new CssMinimizerPlugin(),
    ],
  },
};

const EDITOR_CHUNK = 'wp-story-editor';
const DASHBOARD_CHUNK = 'wp-dashboard';

// Template for html-webpack-plugin to generate JS/CSS chunk manifests in PHP.
const templateContent = ({ htmlWebpackPlugin, chunkNames }) => {
  // Extract filename without extension from arrays of JS and CSS chunks.
  // E.g. "../css/some-chunk.css" -> "some-chunk"
  const filenameOf = (pathname) =>
    pathname.substr(pathname.lastIndexOf('/') + 1);

  const chunkName = htmlWebpackPlugin.options.chunks[0];
  const omitPrimaryChunk = (f) => f !== chunkName;

  const js = htmlWebpackPlugin.files.js
    .map((pathname) => {
      const f = filenameOf(pathname);
      return f.split('.js')[0];
    })
    .filter(omitPrimaryChunk);

  const css = htmlWebpackPlugin.files.css
    .map((pathname) => {
      const f = filenameOf(pathname);
      return f.split('.css')[0];
    })
    .filter(omitPrimaryChunk);

  // We're only interested in chunks from dynamic imports;
  // ones that are not already in `js` and not primaries.
  const chunks = chunkNames.filter(
    (chunk) =>
      !js.includes(chunk) && ![DASHBOARD_CHUNK, EDITOR_CHUNK].includes(chunk)
  );

  return `<?php
  return [
    'css'    => ${JSON.stringify(css)},
    'js'     => ${JSON.stringify(js)},
    'chunks' => ${JSON.stringify(chunks)},
  ];`;
};

const templateParameters = (compilation, assets, assetTags, options) => ({
  compilation,
  webpackConfig: compilation.options,
  htmlWebpackPlugin: {
    tags: assetTags,
    files: assets,
    options,
  },
  // compilation.chunks is a Set.
  chunkNames: [...compilation.chunks].map(({ name }) => name).filter(Boolean),
});

const editorAndDashboard = {
  ...sharedConfig,
  devServer: !isProduction
    ? {
      devMiddleware: {
        writeToDisk: true,
      },
      hot: true,
      allowedHosts: 'all',
      host: 'localhost',
      port: 'auto',
    }
    : undefined,
  entry: {
    [EDITOR_CHUNK]: './packages/wp-story-editor/src/index.js',
    [DASHBOARD_CHUNK]: './packages/wp-dashboard/src/index.js',
  },
  plugins: [
    ...sharedConfig.plugins.filter(
      (plugin) => !(plugin instanceof DependencyExtractionWebpackPlugin)
    ),
    // React Fast Refresh.
    !isProduction && new ReactRefreshWebpackPlugin(),
    new DependencyExtractionWebpackPlugin({
      requestToExternal,
    }),
    new WebpackBar({
      name: 'Editor & Dashboard',
    }),
    new HtmlWebpackPlugin({
      filename: `${EDITOR_CHUNK}.chunks.php`,
      inject: false, // Don't inject default <script> tags, etc.
      minify: false, // PHP not HTML so don't attempt to minify.
      chunks: [EDITOR_CHUNK],
      templateContent,
      templateParameters,
    }),
    new HtmlWebpackPlugin({
      filename: `${DASHBOARD_CHUNK}.chunks.php`,
      inject: false, // Don't inject default <script> tags, etc.
      minify: false, // PHP not HTML so don't attempt to minify.
      chunks: [DASHBOARD_CHUNK],
      templateContent,
      templateParameters,
    }),
  ].filter(Boolean),
  optimization: {
    ...sharedConfig.optimization,
    splitChunks: {
      ...sharedConfig.optimization.splitChunks,
      chunks: 'all',
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
    new WebpackBar({
      name: 'WP Frontend Scripts',
      color: '#EEE070',
    }),
  ].filter(Boolean),
};

// Collect all core themes style sheet paths.
const coreThemesBlockStylesPaths = glob.sync(
  './packages/stories-block/src/css/core-themes/*.css'
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
      './packages/stories-block/src/index.js',
      './packages/stories-block/src/block/edit.css',
    ],
    'web-stories-list-styles': './packages/stories-block/src/css/style.css',
    'web-stories-embed': './packages/stories-block/src/css/embed.css',
    ...coreThemeBlockStyles,
  },
  plugins: [
    ...sharedConfig.plugins,

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
    new WebpackBar({
      name: 'WP TinyMCE Button',
      color: '#4deaa2',
    }),
  ].filter(Boolean),
};

const storiesImgareaselect = {
  ...sharedConfig,
  entry: {
    imgareaselect: './packages/imgareaselect/src/index.js',
  },
  plugins: [
    ...sharedConfig.plugins,
    new WebpackBar({
      name: 'WP ImgAreaSelect Patch',
      color: '#7D02F1',
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
  storiesImgareaselect,
];
