/**
 * External dependencies.
 */
const { merge } = require('webpack-merge');

/**
 * Internal dependencies.
 */
const sharedConfig = require('./shared');

module.exports = merge(sharedConfig, {
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    hot: true,
    historyApiFallback: true, // To fix routing issue in dev mode.
  },
  mode: 'development',
  cache: false,
  devtool: 'cheap-module-source-map',
  plugins: [],
  externals: {
    react: 'React',
  },
});
