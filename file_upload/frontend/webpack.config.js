const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/chunk.[name].[hash].js',
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    axios: 'axios',
    'element-ui': 'ELEMENT',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            stylus: [
              // 'vue-style-loader',
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  hmr: process.env.NODE_ENV === 'development',
                },
              },
              'css-loader',
              'stylus-loader',
            ]
          }
        },
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.styl(us)$/,
        use: [
          // 'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          // 'vue-style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
          },
        }],
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: [
      '.js',
      '.vue',
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      title: '文件上传',
      template: 'public/index.html',
      chunksSortMode: 'none',
      favicon: 'public/22.ico'
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
      ignoreOrder: false,
    }),
    new CopyPlugin([
      { from: 'public/*.js', to: '', flatten: true },
    ]),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // tuiEditor: {
        //   name: 'tuiEditor',
        //   priority: 40,
        //   test: /node_modules\/tui-editor/,
        // },
        // highlightJs: {
        //   name: 'highlightJs',
        //   priority: 40,
        //   test: /node_modules\/highlight.js/,
        // },
        // aliOSS: {
        //   name: 'aliOSS',
        //   priority: 20,
        //   test: /node_modules\/ali-oss/
        // },
        // 单独打包elementUI
        // elementUI: {
        //   name: 'elementUI', // 单独将 elementUI 拆包
        //   priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
        //   test: /[\\/]node_modules[\\/]element-ui[\\/]/
        // },
        // 第三方库
        libs: {
          name: 'libs',
          test: /node_modules/,
          priority: -10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        common: {
          name: 'comomn',
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        },
      },
    },
  },
}