/**
 * External dependencies.
 */
const { merge } = require( 'webpack-merge' );

/**
 * Internal dependencies.
 */
const sharedConfig = require( './shared' );

require( 'babel-polyfill' );

module.exports = merge( sharedConfig, {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './index.js',
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
  mode: 'development',
  cache: false,
  devtool: 'cheap-module-source-map',
  plugins: [],
  externals: {
    react: 'React',
  },
} );
