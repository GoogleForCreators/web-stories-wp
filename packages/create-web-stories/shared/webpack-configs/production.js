/**
 * External dependencies.
 */
const { resolve } = require('path');
const { merge } = require('webpack-merge');

/**
 * Internal dependencies.
 */
const sharedConfig = require('./shared');

module.exports = merge(sharedConfig, {
  output: {
    filename: 'js/bundle.[contenthash].min.js',
    path: resolve(__dirname, '../dist'),
    publicPath: '/',
  },
  mode: 'production',
  devtool: 'source-map',
  plugins: [],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
});
