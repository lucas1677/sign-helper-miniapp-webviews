const webpack = require('webpack');
const Path = require('path');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');

const isProduction = process.argv.indexOf('-p') >= 0;
const isDev = process.argv.indexOf('-dev') >= 0;
const outPath = Path.join(__dirname, './dist');
const sourcePath = Path.join(__dirname, './src');

module.exports = {
  mode: isProduction ? "production" : "development",
  context: sourcePath,
  entry: {
    main: './index.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux'
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: "vendor",
          name: "vendor",
          enforce: true
        }
      }
    }
  },
  output: {
    path: outPath,
    publicPath: '/',
    pathinfo: true
  },
  target: "web",
  resolve: {
    extensions: ['.ts', '.tsx', '.jsx', '.js'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ['browser', 'main'],
    alias: {
      '@src': Path.join(__dirname, 'src')
    }
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: isProduction
        ? 'ts-loader'
        : [
          'react-hot-loader/webpack',
          'ts-loader'
        ]
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }, {
      test: /\.html$/,
      loader:
        'html-loader'
    }, {
      test: /\.(pdf|jpg|png|gif|svg|ico)$/,
      use: isProduction
        ? [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]-[hash:8].[ext]'
            },
          },
        ] : [
          {
            loader: 'url-loader'
          },
        ]
    }, {
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use:
        [
          'file-loader'
        ]
    }, {
      test: /\.(csv|tsv)$/,
      use:
        [
          'csv-loader'
        ]
    }, {
      test: /\.xml$/,
      use:
        [
          'xml-loader'
        ]
    }
    ],
  },
  plugins: isProduction || !isDev ? [
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({template: 'index.html', hash: true}),
    new EncodingPlugin({
      encoding: 'utf-8'
    })
  ] : [
    new webpack.optimize.AggressiveMergingPlugin(),
    new HtmlWebpackPlugin({template: 'index.html', hash: true}),
    new EncodingPlugin({
      encoding: 'utf-8'
    }),
    new DashboardPlugin()
  ],
  devServer:
    {
      contentBase: sourcePath,
      hot: true,
      stats: {
        warnings: false
      },
      allowedHosts: [
        'lucas.com',
        'lucas.s3.natapp.cc',
        'j44rjx.natappfree.cc',
        '192.168.1.110',
      ]
    }
  ,
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
};
