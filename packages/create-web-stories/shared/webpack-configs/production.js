/**
 * External dependencies.
 */
const { merge } = require( 'webpack-merge' );
const { resolve } = require( 'path' );

require( 'babel-polyfill' );

/**
 * Internal dependencies.
 */
const sharedConfig = require( './shared' );

module.exports = merge( sharedConfig, {
  entry: [
    'babel-polyfill',
    './index.js',
  ],
  output: {
    filename: 'js/bundle.[contenthash].min.js',
    path: resolve( __dirname, '../dist' ),
    publicPath: '/',
  },
  mode: 'production',
  devtool: 'source-map',
  plugins: [],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
} );
