/**
 * Development Config
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const baseConfig = require('./webpack.config')

const webpackConfig = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': require(path.join(__dirname, './env.development'))
    }),
    // new BundleAnalyzerPlugin({
    //   analyzerPort: 8889
    // }),
  ]
})

module.exports = webpackConfig
